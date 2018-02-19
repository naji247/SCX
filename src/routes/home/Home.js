/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import React from 'react';
import s from './Home.css';
import { connect } from 'react-redux';
import { getPrices } from '../../actions/runtime';
import _ from 'lodash';

class Home extends React.Component {
  componentDidMount() {
    this.props.getPrices();
  }
  render() {
    return (
      <div className={s.tableContainer}>
        <h1 className={s.tableHeader}>Stability Metrics</h1>
        <Table selectable={false}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Ticker</TableHeaderColumn>
              <TableHeaderColumn>Name</TableHeaderColumn>
              <TableHeaderColumn>Price</TableHeaderColumn>
              <TableHeaderColumn>Market Cap</TableHeaderColumn>
              <TableHeaderColumn>24 Hour Range</TableHeaderColumn>
              <TableHeaderColumn>3 Month Range</TableHeaderColumn>
              <TableHeaderColumn>Volatility</TableHeaderColumn>
            </TableRow>
            <TableRow className={s.titleRow}>
              <TableHeaderColumn colSpan="7" style={{ height: '36px' }}>
                <div className={s.tableSubHeader}>Stable Coins</div>
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} showRowHover>
            <TableRow>
              <TableRowColumn>DAI</TableRowColumn>
              <TableRowColumn>Dai</TableRowColumn>
              <TableRowColumn>$1.00</TableRowColumn>
              <TableRowColumn>$10M</TableRowColumn>
              <TableRowColumn>
                $0.01 <br /> (1%)
              </TableRowColumn>
              <TableRowColumn>
                $0.01 <br /> (1%)
              </TableRowColumn>
              <TableRowColumn>0.15%</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>USDT</TableRowColumn>
              <TableRowColumn>Tether</TableRowColumn>
              <TableRowColumn>$1.00</TableRowColumn>
              <TableRowColumn>$2.22B</TableRowColumn>
              <TableRowColumn>
                $0.005 <br /> (0.5%)
              </TableRowColumn>
              <TableRowColumn>
                $0.01 <br /> (1%)
              </TableRowColumn>
              <TableRowColumn>0.11%</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>BSE</TableRowColumn>
              <TableRowColumn>Basecoin</TableRowColumn>
              <TableRowColumn>$1.00</TableRowColumn>
              <TableRowColumn>$0M</TableRowColumn>
              <TableRowColumn>
                $0.005 <br /> (0.5%)
              </TableRowColumn>
              <TableRowColumn>
                $0.01 <br /> (1%)
              </TableRowColumn>
              <TableRowColumn>0.11%</TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
        <PriceTable
          name="Other Cryptocurrencies"
          prices={this.props.prices}
          members={['BTC', 'ETH', 'LTC']}
        />
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
      <Table selectable={false}>
        <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
          <TableRow className={s.titleRow}>
            <TableHeaderColumn colSpan="7" style={{ height: '36px' }}>
              <div className={s.tableSubHeader}>{this.props.name}</div>
            </TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false} showRowHover>
          {rows}
        </TableBody>
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
        <TableRowColumn>{ticker}</TableRowColumn>
        <TableRowColumn>{name}</TableRowColumn>
        <TableRowColumn>{latest}</TableRowColumn>
        <TableRowColumn>{precise(marketCap)}</TableRowColumn>
        <TableRowColumn>{min}</TableRowColumn>
        <TableRowColumn>{max}</TableRowColumn>
        <TableRowColumn>{precise(volatility)}</TableRowColumn>
      </TableRow>
    );
  }
}

function precise(x) {
  return Number.parseFloat(x).toPrecision(4);
}
const mapState = state => ({
  ...state.price,
});

const mapDispatch = {
  getPrices,
};

export default connect(mapState, mapDispatch)(withStyles(s)(Home));
