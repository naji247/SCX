import express from 'express';
import Price from '../data/models/Price';
import sequelize from '../data/sequelize';
export const getAllPrices = (req, res, next) => {
  var sqlString = `select *
  from "Prices" 
  where timestamp > now() - interval '1 year' 
  and ticker = 'BTC'
  ORDER BY timestamp`;

  if (req.query.latest && req.query.latest === 'true') {
    sqlString =
      'select distinct on ("ticker") * FROM "Prices" ORDER BY ticker, timestamp DESC';
  } else if (req.query.func) {
    if (req.query.func === 'min') {
      sqlString = `select ticker, min(price) as price from "Prices"  where timestamp > now() - interval '3 months' GROUP BY "ticker"`;
    } else if (req.query.func === 'max') {
      sqlString = `select ticker, max(price) as price from "Prices"  where timestamp > now() - interval '3 months' GROUP BY "ticker"`;
    }
  }

  sequelize
    .query(sqlString, { type: sequelize.QueryTypes.SELECT })
    .then(results => {
      res.send(results);
      next();
    });
};
