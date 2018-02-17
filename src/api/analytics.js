import express from 'express';
import Price from '../data/models/Price';
import sequelize from '../data/sequelize';
import moment from 'moment';
import jStat from 'jStat';
import Promise from 'promise';
import _ from 'lodash';

export const getAnalytics = (req, res, next) => {
  var tickers = ['BTC', 'ETH'];
  var volPromises = _.map(tickers, getVolatility);
  var allPromises = _.concat(
    getPriceStat('latest'),
    getPriceStat('max'),
    getPriceStat('min'),
    volPromises,
  );

  Promise.all(allPromises).then(allRes => {
    var finalOutput = {};
    var latest = allRes.shift();
    var max = allRes.shift();
    var min = allRes.shift();
    console.log(latest);
    _.forEach(tickers, ticker => {
      finalOutput[ticker] = {
        latest: latest[ticker],
        max: max[ticker],
        min: min[ticker],
        volatility: allRes.shift(),
      };
    });
    res.send(finalOutput);
    next();
  });
};

function getLatest() {
  sqlString =
    'select distinct on ("ticker") * FROM "Prices" ORDER BY ticker, timestamp DESC';

  return sequelize.query(sqlString, { type: sequelize.QueryTypes.SELECT });
}

function getPriceStat(stat) {
  var sqlString = '';
  if (stat == 'latest') {
    sqlString =
      'select distinct on ("ticker") * FROM "Prices" ORDER BY ticker, timestamp DESC';
  } else if (stat == 'min') {
    sqlString = `select ticker, min(price) as price from "Prices"  where timestamp > now() - interval '3 months' GROUP BY "ticker"`;
  } else if (stat == 'max') {
    sqlString = `select ticker, max(price) as price from "Prices"  where timestamp > now() - interval '3 months' GROUP BY "ticker"`;
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
  from "Prices" 
  where timestamp > now() - interval '1 year' 
  and extract(hour from timestamp) = 00
  and extract(minute from timestamp) = 00
  and extract(second from timestamp) = 00
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
        if (prevDate && currDate.diff(prevDate, 'days') == 1) {
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
