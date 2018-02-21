import express from 'express';
import { getAnalytics } from './analytics';
import * as cronApi from './crons';
export const api = express.Router();

api.route('/analytics').get(getAnalytics);

// CRON JOBS
api.route('/crons/marketcaps/start').get(cronApi.startMarketCapCron);
api.route('/crons/marketcaps/stop').get(cronApi.stopMarketCapCron);
api.route('/crons/marketcaps/status').get(cronApi.statusMarketCapCron);

api.route('/crons/prices/start').get(cronApi.startPricesCron);
api.route('/crons/prices/stop').get(cronApi.stopPricesCron);
api.route('/crons/prices/status').get(cronApi.statusPricesCron);
