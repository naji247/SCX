import express from 'express';
import sequelize from '../data/sequelize';
import moment from 'moment';
import jStat from 'jStat';
import Promise from 'promise';
import _ from 'lodash';

export const getAnalytics = (req, res, next) => {
  var tickers = ['BTC', 'ETH', 'GLD', 'AGG', 'SPY'];
  var volPromises = _.map(tickers, getVolatility);
  var allPromises = _.concat(
    getPriceStat('latest'),
    getPriceStat('max'),
    getPriceStat('min'),
    volPromises,
  );

  Promise.all(allPromises).then(allRes => {
    const tickerToName = {
      BTC: 'Bitcoin',
      ETH: 'Ethereum',
      SPY: 'S&P 500 ETF',
      AGG: 'Agg Bond ETF',
      GLD: 'Gold ETF',
    };
    var finalOutput = [];
    var latest = allRes.shift();
    var max = allRes.shift();
    var min = allRes.shift();

    _.forEach(tickers, ticker => {
      finalOutput.push({
        ticker: ticker,
        name: tickerToName[ticker],
        latest: latest[ticker],
        max: max[ticker],
        min: min[ticker],
        volatility: allRes.shift() * 100,
      });
    });
    res.send(finalOutput);
    next();
  });
};

function getLatest() {
  sqlString =
    'select distinct on ("ticker") * FROM "DailyPrices" ORDER BY ticker, timestamp DESC';

  return sequelize.query(sqlString, { type: sequelize.QueryTypes.SELECT });
}

function getPriceStat(stat) {
  var sqlString = '';
  if (stat == 'latest') {
    sqlString =
      'select distinct on ("ticker") * FROM "DailyPrices" ORDER BY ticker, timestamp DESC';
  } else if (stat == 'min') {
    sqlString = `select ticker, min(price) as price from "DailyPrices"  where timestamp > now() - interval '3 months' GROUP BY "ticker"`;
  } else if (stat == 'max') {
    sqlString = `select ticker, max(price) as price from "DailyPrices"  where timestamp > now() - interval '3 months' GROUP BY "ticker"`;
  }
  return sequelize
    .query(sqlString, { type: sequelize.QueryTypes.SELECT })
    .then(res => {
      var prices = {};
      _.forEach(res, row => {
        prices[row['ticker']] = row['price'];
      });
      return prices;
    });
}

function getVolatility(ticker) {
  var sqlString = `select *
  from "DailyPrices" 
  where timestamp > now() - interval '1 year' 
  and ticker='${ticker}'
  ORDER BY timestamp`;

  return sequelize
    .query(sqlString, { type: sequelize.QueryTypes.SELECT })
    .then(results => {
      var prevDate = null;
      var prevPrice = null;
      var dailyRets = [];
      _.forEach(results, result => {
        var currDate = moment(result.timestamp);
        var currPrice = result.price;
        if (prevDate) {
          dailyRets.push((currPrice - prevPrice) / prevPrice);
        }
        prevDate = currDate;
        prevPrice = currPrice;
      });
      console.log(dailyRets.length);
      var vol = jStat.stdev(dailyRets, false) * Math.sqrt(dailyRets.length);
      return vol;
    });
}
