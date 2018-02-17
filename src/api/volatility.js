import express from 'express';
import sequelize from '../data/sequelize';
import moment from 'moment';
import jStat from 'jStat';
import _ from 'lodash';

export const getVolatility = (req, res, next) => {
  var sqlString = `select *
  from "Prices" 
  where timestamp > now() - interval '1 year' 
  and extract(hour from timestamp) = 00
  and extract(minute from timestamp) = 00
  and extract(second from timestamp) = 00
  and ticker='BTC'
  ORDER BY timestamp`;

  sequelize
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
      res.send({ BTC: vol });
      next();
    });
};
