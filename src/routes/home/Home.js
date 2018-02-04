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

        <Table selectable={false}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow className={s.titleRow}>
              <TableHeaderColumn colSpan="7" style={{ height: '36px' }}>
                <div className={s.tableSubHeader}>Other Cryptocurrencies</div>
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} showRowHover>
            <TableRow>
              <TableRowColumn>BTC</TableRowColumn>
              <TableRowColumn>Bitcoin</TableRowColumn>
              <TableRowColumn>$8,631.01</TableRowColumn>
              <TableRowColumn>$146B</TableRowColumn>
              <TableRowColumn>
                $1,322.32 <br /> (28.23%)
              </TableRowColumn>
              <TableRowColumn>
                $12,323 <br /> (102.1%)
              </TableRowColumn>
              <TableRowColumn>71%</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>ETH</TableRowColumn>
              <TableRowColumn>Ethereum</TableRowColumn>
              <TableRowColumn>$951.81</TableRowColumn>
              <TableRowColumn>$91B</TableRowColumn>
              <TableRowColumn>
                $1,322.32 <br /> (28.23%)
              </TableRowColumn>
              <TableRowColumn>
                $12,323 <br /> (102.1%)
              </TableRowColumn>
              <TableRowColumn>71%</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>LTC</TableRowColumn>
              <TableRowColumn>Litecoin</TableRowColumn>
              <TableRowColumn>$162.14</TableRowColumn>
              <TableRowColumn>$8B</TableRowColumn>
              <TableRowColumn>
                $1,322.32 <br /> (28.23%)
              </TableRowColumn>
              <TableRowColumn>
                $12,323 <br /> (102.1%)
              </TableRowColumn>
              <TableRowColumn>71%</TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>

        <Table selectable={false}>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow className={s.titleRow}>
              <TableHeaderColumn colSpan="7" style={{ height: '36px' }}>
                <div className={s.tableSubHeader}>
                  Traditional Financial Assets
                </div>
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false} showRowHover>
            <TableRow>
              <TableRowColumn>SPY</TableRowColumn>
              <TableRowColumn>S&amp;P 500 ETF</TableRowColumn>
              <TableRowColumn>$275.45</TableRowColumn>
              <TableRowColumn>$277.54B</TableRowColumn>
              <TableRowColumn>
                $4.82 <br /> (1.75%)
              </TableRowColumn>
              <TableRowColumn>
                $11.17 <br /> (4.06%)
              </TableRowColumn>
              <TableRowColumn>9.18%</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>AGG</TableRowColumn>
              <TableRowColumn>Agg Bond ETF</TableRowColumn>
              <TableRowColumn>$107.20</TableRowColumn>
              <TableRowColumn>$53.0B</TableRowColumn>
              <TableRowColumn>
                $0.25 <br /> (0.25%)
              </TableRowColumn>
              <TableRowColumn>
                $3.58 <br /> (3.34%)
              </TableRowColumn>
              <TableRowColumn>2.69%</TableRowColumn>
            </TableRow>
            <TableRow>
              <TableRowColumn>GC1</TableRowColumn>
              <TableRowColumn>Gold Futures</TableRowColumn>
              <TableRowColumn>$8,631.01</TableRowColumn>
              <TableRowColumn>$146B</TableRowColumn>
              <TableRowColumn>1,322.32</TableRowColumn>
              <TableRowColumn>$12,323</TableRowColumn>
              <TableRowColumn>71%</TableRowColumn>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default withStyles(s)(Home);
