/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import expressJwt, { UnauthorizedError as Jwt401Error } from 'express-jwt';
import expressGraphQL from 'express-graphql';
import jwt from 'jsonwebtoken';
import nodeFetch from 'node-fetch';
import React from 'react';
import { CronJob } from 'cron';
import request from 'request-promise';
import ReactDOM from 'react-dom/server';
import PrettyError from 'pretty-error';
import App from './components/App';
import Html from './components/Html';
import { ErrorPageWithoutStyle } from './routes/error/ErrorPage';
import errorPageStyle from './routes/error/ErrorPage.css';
import createFetch from './createFetch';
import passport from './passport';
import router from './router';
import models from './data/models';
import schema from './data/schema';
import assets from './assets.json'; // eslint-disable-line import/no-unresolved
import configureStore from './store/configureStore';
import { setRuntimeVariable } from './actions/runtime';
import config from './config';
import Price from './data/models/Price';
import DailyPrice from './data/models/DailyPrice';
import MarketCap from './data/models/MarketCap';
const COINBASE_URL = 'https://www.coinbase.com/api/v2/prices/';
const ALPHAVANTAGE_URL = 'https://www.alphavantage.co/';
const COINMARKETCAP_URL = 'https://api.coinmarketcap.com/v1/ticker/';
const GOOGLE_FINANCE_API = 'https://finance.google.com/finance?output=json&q=';
import _ from 'lodash';
import uuid from 'aguid';
// Routers
import { api } from './api/index';

const app = express();

//
// Tell any CSS tooling (such as Material UI) to use all vendor prefixes if the
// user agent is not known.
// -----------------------------------------------------------------------------
global.navigator = global.navigator || {};
global.navigator.userAgent = global.navigator.userAgent || 'all';

//
// Register Node.js middleware
// -----------------------------------------------------------------------------
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//
// Authentication
// -----------------------------------------------------------------------------
app.use(
  expressJwt({
    secret: config.auth.jwt.secret,
    credentialsRequired: false,
    getToken: req => req.cookies.id_token,
  }),
);
// Error handler for express-jwt
app.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  if (err instanceof Jwt401Error) {
    // console.error('[express-jwt-error]', req.cookies.id_token);
    // `clearCookie`, otherwise user can't use web-app until cookie expires
    res.clearCookie('id_token');
  }
  next(err);
});

app.use(passport.initialize());

if (__DEV__) {
  app.enable('trust proxy');
}
app.get(
  '/login/facebook',
  passport.authenticate('facebook', {
    scope: ['email', 'user_location'],
    session: false,
  }),
);
app.get(
  '/login/facebook/return',
  passport.authenticate('facebook', {
    failureRedirect: '/login',
    session: false,
  }),
  (req, res) => {
    const expiresIn = 60 * 60 * 24 * 180; // 180 days
    const token = jwt.sign(req.user, config.auth.jwt.secret, { expiresIn });
    res.cookie('id_token', token, { maxAge: 1000 * expiresIn, httpOnly: true });
    res.redirect('/');
  },
);

app.use('/api', api);

//
// Register API middleware
// -----------------------------------------------------------------------------
app.use(
  '/graphql',
  expressGraphQL(req => ({
    schema,
    graphiql: __DEV__,
    rootValue: { request: req },
    pretty: __DEV__,
  })),
);

//
// Register server-side rendering middleware
// -----------------------------------------------------------------------------
app.get('*', async (req, res, next) => {
  try {
    const css = new Set();

    // Universal HTTP client
    const fetch = createFetch(nodeFetch, {
      baseUrl: config.api.serverUrl,
      cookie: req.headers.cookie,
    });

    const initialState = {
      user: req.user || null,
    };

    const store = configureStore(initialState, {
      fetch,
      // I should not use `history` on server.. but how I do redirection? follow universal-router
    });

    store.dispatch(
      setRuntimeVariable({
        name: 'initialNow',
        value: Date.now(),
      }),
    );

    // Global (context) variables that can be easily accessed from any React component
    // https://facebook.github.io/react/docs/context.html
    const context = {
      // Enables critical path CSS rendering
      // https://github.com/kriasoft/isomorphic-style-loader
      insertCss: (...styles) => {
        // eslint-disable-next-line no-underscore-dangle
        styles.forEach(style => css.add(style._getCss()));
      },
      fetch,
      // You can access redux through react-redux connect
      store,
      storeSubscription: null,
    };

    const route = await router.resolve({
      ...context,
      pathname: req.path,
      query: req.query,
    });

    if (route.redirect) {
      res.redirect(route.status || 302, route.redirect);
      return;
    }

    const data = { ...route };
    data.children = ReactDOM.renderToString(
      <App context={context}>{route.component}</App>,
    );
    data.styles = [{ id: 'css', cssText: [...css].join('') }];
    data.scripts = [assets.vendor.js];
    if (route.chunks) {
      data.scripts.push(...route.chunks.map(chunk => assets[chunk].js));
    }
    data.scripts.push(assets.client.js);
    data.app = {
      apiUrl: config.api.clientUrl,
      state: context.store.getState(),
    };

    const html = ReactDOM.renderToStaticMarkup(<Html {...data} />);
    res.status(route.status || 200);
    res.send(`<!doctype html>${html}`);
  } catch (err) {
    next(err);
  }
});

//
// Error handling
// -----------------------------------------------------------------------------
const pe = new PrettyError();
pe.skipNodeFiles();
pe.skipPackage('express');

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // console.error(pe.render(err));
  const html = ReactDOM.renderToStaticMarkup(
    <Html
      title="Internal Server Error"
      description={err.message}
      styles={[{ id: 'css', cssText: errorPageStyle._getCss() }]} // eslint-disable-line no-underscore-dangle
    >
      {ReactDOM.renderToString(<ErrorPageWithoutStyle error={err} />)}
    </Html>,
  );
  res.status(err.status || 500);
  res.send(`<!doctype html>${html}`);
});

//
// Launch the server
// -----------------------------------------------------------------------------
const promise = models.sync().catch(err => console.error(err.stack));
if (!module.hot) {
  promise.then(() => {
    app.listen(config.port, () => {
      console.info(`The server is running at http://localhost:${config.port}/`);
    });
  });
}

const crony = new CronJob(
  '*/60 * * * * *',
  async () => {
    // const payload = await request({
    //   uri: 'https://api.coinmarketcap.com/v1/ticker/bitcoin/',
    //   json: true,
    // });
    // TODO: Write to database
    // console.info(payload);
    // const price = Price.build({
    //   price: payload.price_usd,
    //   ticker: payload.symbol,
    //   timestamp: Date.now(),
    // });
    // price.save();

    const coins = [
      { ticker: 'BTC', name: 'Bitcoin' },
      { ticker: 'ETH', name: 'Ethereum' },
    ];

    const etfs = ['SPY', 'AGG', 'GLD'];

    _.forEach(coins, async coin => {
      // Market Caps
      const marketCapUrl = COINMARKETCAP_URL + coin.name;
      const res2 = await request({ url: marketCapUrl, json: true });
      if (res2 && res2.length > 0 && res2[0]['market_cap_usd']) {
        const marketCap = res2[0]['market_cap_usd'];
        try {
          await MarketCap.upsert({ ticker: coin.ticker, marketCap: marketCap });
        } catch (error) {
          console.log(error);
        }
      }
    });

    _.forEach(etfs, async etf => {
      const etfMarketCapUrl = GOOGLE_FINANCE_API + etf;
      const res3 = await request({ url: etfMarketCapUrl, json: true });
      if (res3) {
        try {
          const json = JSON.parse(res3.substring(3));
          // REMOVE the B for Billion
          const etfMarketCap =
            parseFloat(json[0]['mc'].replace(/B/g, '')) * 1e9;

          await MarketCap.upsert({ ticker: etf, marketCap: etfMarketCap });
        } catch (error) {}
      }
    });
  },
  null,
  true,
  'America/Los_Angeles',
);

// SEED DATABASE HERE BECAUSE SEQUELIZE WAS A BAD CHOICE.
// OKAY?! I'M SORRY MOM.
const seedHistoricalCryptoData = async function() {
  const coins = [
    { ticker: 'BTC', name: 'Bitcoin' },
    { ticker: 'ETH', name: 'Ethereum' },
  ];

  _.forEach(coins, async coin => {
    // Price Info
    const priceUrl = COINBASE_URL + coin.ticker + '-USD/historic?period=year';
    const res1 = await request({ url: priceUrl, json: true });
    const bulkPrices = _.map(res1.data.prices, date_price_obj => {
      const { price, time } = date_price_obj;
      return {
        id: uuid(coin.ticker + time),
        price: price,
        ticker: coin.ticker,
        timestamp: new Date(time),
      };
    });
    try {
      await Price.bulkCreate(bulkPrices);
      await DailyPrice.bulkCreate(bulkPrices);
    } catch (error) {
      // console.error(error);
    }
  });
};

seedHistoricalCryptoData();

const seedHistoricalETFData = async () => {
  const etfs = ['SPY', 'AGG', 'GLD'];
  _.forEach(etfs, async etf => {
    const alphavantageUrl =
      ALPHAVANTAGE_URL +
      `query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${etf}&apikey=XHJ876BDNFFMFK1K`;
    const res = await request({ url: alphavantageUrl, json: true });
    // console.log(res[`Time Series (Daily)`]);
    const bulkPrices = _.map(res[`Time Series (Daily)`], (value, key) => {
      const date = new Date(key);
      return {
        id: uuid(etf + date),
        price: value[`5. adjusted close`],
        ticker: etf,
        timestamp: date.toISOString(),
      };
    });
    try {
      await DailyPrice.bulkCreate(bulkPrices);
    } catch (error) {
      // console.error(error);
    }
  });
};

seedHistoricalETFData();

//
// Hot Module Replacement
// -----------------------------------------------------------------------------
if (module.hot) {
  app.hot = module.hot;
  module.hot.accept('./router');
}

export default app;
