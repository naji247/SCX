import express from 'express';
import { getAnalytics } from './analytics';
export const api = express.Router();

api.route('/analytics').get(getAnalytics);
