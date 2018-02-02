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

class Home extends React.Component {
  render() {
    return (
      <Table>
        <TableHeader displaySelectAll={false}>
          <TableRow>
            <TableHeaderColumn>Ticker</TableHeaderColumn>
            <TableHeaderColumn>Name</TableHeaderColumn>
            <TableHeaderColumn>Price</TableHeaderColumn>
            <TableHeaderColumn>Market Cap</TableHeaderColumn>
            <TableHeaderColumn>24 Hour Range</TableHeaderColumn>
            <TableHeaderColumn>3 Month Range</TableHeaderColumn>
            <TableHeaderColumn>Volatility</TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody displayRowCheckbox={false}>
          <TableRow>
            <TableRowColumn>BTC</TableRowColumn>
            <TableRowColumn>Bitcoin</TableRowColumn>
            <TableRowColumn>$8,631.01</TableRowColumn>
            <TableRowColumn>$146B</TableRowColumn>
            <TableRowColumn>$1,322.32</TableRowColumn>
            <TableRowColumn>$12,323</TableRowColumn>
            <TableRowColumn>71%</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>BTC</TableRowColumn>
            <TableRowColumn>Bitcoin</TableRowColumn>
            <TableRowColumn>$8,631.01</TableRowColumn>
            <TableRowColumn>$146B</TableRowColumn>
            <TableRowColumn>1,322.32</TableRowColumn>
            <TableRowColumn>$12,323</TableRowColumn>
            <TableRowColumn>71%</TableRowColumn>
          </TableRow>
          <TableRow>
            <TableRowColumn>BTC</TableRowColumn>
            <TableRowColumn>Bitcoin</TableRowColumn>
            <TableRowColumn>$8,631.01</TableRowColumn>
            <TableRowColumn>$146B</TableRowColumn>
            <TableRowColumn>1,322.32</TableRowColumn>
            <TableRowColumn>$12,323</TableRowColumn>
            <TableRowColumn>71%</TableRowColumn>
          </TableRow>
        </TableBody>
      </Table>
    );
  }
}

export default withStyles(s)(Home);
