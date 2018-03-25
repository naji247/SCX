/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from 'material-ui/Table';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import { withStyles as muiStyles } from 'material-ui/styles';
import React from 'react';
import s from './Home.css';
import { connect } from 'react-redux';
import { getPrices } from '../../actions/runtime';
import _ from 'lodash';
import numeral from 'numeral';
import Tooltip from 'material-ui/Tooltip';
import Typography from 'material-ui/Typography';

const CustomTableCell = muiStyles(theme => ({
  head: {
    backgroundColor: '#ebf3fa',
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

class Home extends React.Component {
  componentDidMount() {
    this.props.getPrices();
  }
  render() {
    return (
      <div className={s.tableContainer}>
        <h1 className={s.tableHeader}>Stability Metrics</h1>
        <Table />

        <PriceTable
          name="Stable Coins"
          prices={this.props.prices}
          members={['USDT', 'DAI', 'BITUSD']}
        />
        <br />
        <PriceTable
          name="Other Coins"
          prices={this.props.prices}
          members={['BTC', 'ETH', 'LTC']}
        />
        <br />
        <PriceTable
          name="Traditional Financial Assets"
          prices={this.props.prices}
          members={['SPY', 'AGG', 'GLD']}
        />
      </div>
    );
  }
}

class PriceTable extends React.PureComponent {
  render() {
    const { prices, members } = this.props;
    const filteredPrices = _.filter(prices, row =>
      _.includes(members, row.ticker),
    );
    const orderedFilteredPrices = _.orderBy(filteredPrices, row =>
      _.indexOf(members, row.ticker),
    );
    const rows = orderedFilteredPrices.map((obj, i) => (
      <PriceRow key={i} {...obj} />
    ));
    return (
      <Table>
        <TableHead>
          <TableRow>
            <CustomTableCell>
              <Typography>Ticker</Typography>
            </CustomTableCell>
            <CustomTableCell>
              <Typography>Name</Typography>
            </CustomTableCell>
            <CustomTableCell>
              <Typography>Price</Typography>
            </CustomTableCell>
            <CustomTableCell>
              <Typography>Market Cap</Typography>
            </CustomTableCell>
            <CustomTableCell>
              <Typography>3 Month Range (%)</Typography>
            </CustomTableCell>
            <CustomTableCell>
              <Typography>Volatility</Typography>
            </CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    );
  }
}

class PriceRow extends React.PureComponent {
  render() {
    const {
      ticker,
      latest,
      marketCap,
      max,
      min,
      volatility,
      name,
    } = this.props;
    return (
      <TableRow>
        <CustomTableCell>
          <Typography>{ticker}</Typography>
        </CustomTableCell>
        <CustomTableCell>
          <Typography>{name}</Typography>
        </CustomTableCell>
        <CustomTableCell>
          <Typography>{formatPrice(latest)}</Typography>
        </CustomTableCell>
        <CustomTableCell>
          <Typography>{formatMktCap(marketCap)}</Typography>
        </CustomTableCell>
        <CustomTableCell>
          <Typography>
            {formatPrice(min)} - {formatPrice(max)}
            <br />
            ({formatPct(100 * (max - min) / latest)})
          </Typography>
        </CustomTableCell>
        <CustomTableCell>
          <Tooltip title="HELP ME! 'position: absolute;'" placement="top">
            <Typography>
              <span>{formatPct(volatility)}</span>
            </Typography>
          </Tooltip>
        </CustomTableCell>
      </TableRow>
    );
  }
}

function formatPct(x) {
  return Number.parseFloat(x).toPrecision(3) + '%';
}

function formatMktCap(x) {
  return numeral(x)
    .format('$0a')
    .toString()
    .toUpperCase();
}

export function formatPrice(x) {
  return (
    '$' +
    Number.parseFloat(x)
      .toFixed(2)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  );
}

const mapState = state => ({
  ...state.price,
});

const mapDispatch = {
  getPrices,
};

export default connect(mapState, mapDispatch)(withStyles(s)(Home));
