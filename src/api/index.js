import express from 'express';
import { getAllPrices } from './prices';
import { getVolatility } from './volatility';
import { getAnalytics } from './analytics';
export const api = express.Router();

api.route('/prices').get(getAllPrices);
api.route('/volatility').get(getVolatility);
api.route('/analytics').get(getAnalytics);
