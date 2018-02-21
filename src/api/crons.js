import { CronJob } from 'cron';
const COINBASE_URL = 'https://www.coinbase.com/api/v2/prices/';
const ALPHAVANTAGE_URL =
  'https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&interval=1min&apikey=XHJ876BDNFFMFK1K&symbol=';
const COINMARKETCAP_URL = 'https://api.coinmarketcap.com/v1/ticker/';
const GOOGLE_FINANCE_API = 'https://finance.google.com/finance?output=json&q=';
import Price from '../data/models/Price';
import DailyPrice from '../data/models/DailyPrice';
import MarketCap from '../data/models/MarketCap';
import request from 'request-promise';
import _ from 'lodash';
import uuid from 'aguid';

const coins = [
  { ticker: 'BTC', name: 'Bitcoin' },
  { ticker: 'ETH', name: 'Ethereum' },
  { ticker: 'LTC', name: 'Litecoin' },
  { ticker: 'DAI', name: 'Dai' },
  { ticker: 'USDT', name: 'Tether' },
];

const etfs = ['SPY', 'AGG', 'GLD'];
const pricesCron = new CronJob(
  '*/40 * * * * *',
  async () => {
    _.forEach(coins, async coin => {
      // Coin Prices
      const priceUrl = COINMARKETCAP_URL + coin.name;
      const response = await request({ url: priceUrl, json: true });
      if (response && response.length > 0 && response[0]['price_usd']) {
        try {
          const price = response[0]['price_usd'];
          const time = new Date(parseInt(response[0]['last_updated']) * 1000);
          await Price.upsert({
            id: uuid(coin.ticker + time.toISOString()),
            ticker: coin.ticker,
            price: price,
            timestamp: time,
          });
        } catch (error) {
          console.log(error);
        }
      }
    });

    _.forEach(etfs, async etf => {
      const etfPriceUrl = ALPHAVANTAGE_URL + etf;
      const res3 = await request({ url: etfPriceUrl, json: true });
      if (res3) {
        try {
          const lastRefresh = res3['Meta Data']['3. Last Refreshed'];
          const etfPrice = parseFloat(
            res3['Time Series (1min)'][lastRefresh]['4. close'],
          );

          await Price.upsert({
            id: uuid(etf + new Date(lastRefresh).toISOString()),
            ticker: etf,
            price: etfPrice,
            timestamp: new Date(lastRefresh),
          });
        } catch (error) {
          console.log(error);
        }
      }
    });
  },
  null,
  false,
  'America/Los_Angeles',
);

const marketCapCron = new CronJob(
  '*/60 * * * * *',
  async () => {
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
  false,
  'America/Los_Angeles',
);

export const startMarketCapCron = (req, res, next) => {
  try {
    marketCapCron.start();
    marketCapCron.running = true;
    res.send('Market Cap CRON started');
  } catch (error) {
    res.send(error);
  }
};

export const statusMarketCapCron = (req, res, next) => {
  if (marketCapCron.running) {
    res.send('Market Cap CRON is RUNNING');
  } else {
    res.send('Market Cap CRON is STOPPED');
  }
};

export const stopMarketCapCron = (req, res, next) => {
  try {
    marketCapCron.stop();
    marketCapCron.running = false;
    res.send('Market Cap CRON stopped');
  } catch (error) {
    res.send(error);
  }
};

export const startPricesCron = (req, res, next) => {
  try {
    pricesCron.start();
    pricesCron.running = true;
    res.send('Prices CRON started');
  } catch (error) {
    res.send(error);
  }
};

export const statusPricesCron = (req, res, next) => {
  if (pricesCron.running) {
    res.send('Prices CRON is RUNNING');
  } else {
    res.send('Prices CRON is STOPPED');
  }
};

export const stopPricesCron = (req, res, next) => {
  try {
    pricesCron.stop();
    pricesCron.running = false;
    res.send('Prices CRON stopped');
  } catch (error) {
    res.send(error);
  }
};
