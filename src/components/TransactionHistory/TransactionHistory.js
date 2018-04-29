/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
// import cx from 'classnames';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './TransactionHistory.css';
import Link from '../Link';

class TransactionHistory extends React.Component {
  render() {
    return (
      <div className={s.container}>
        <h1 className={s.tableTitle}> Your Transaction History</h1>
        <div className={s.tableWrapper}>
          <table className={s.transactionTable}>
            <tr className={s.tableHeaderRow}>
              <th>Date</th>
              <th>Description</th>
              <th>Recipient</th>
              <th>Amount</th>
            </tr>
            <tr className={s.transactionRow}>
              <td className={s.transactionElem}>3/16/2018</td>
              <td className={s.transactionElem}>Flights to Vienna</td>
              <td className={s.transactionElem}>Naseem</td>
              <td className={s.transactionElem}>
                <font color="#61a414">+$100.11</font>
              </td>
            </tr>
            <tr className={s.transactionRow}>
              <td className={s.transactionElem}>3/14/2018</td>
              <td className={s.transactionElem}>Pi day pies</td>
              <td className={s.transactionElem}>Darren</td>
              <td className={s.transactionElem}>
                <font color="#d0011b">-$90.00</font>
              </td>
            </tr>
            <tr className={s.transactionRow}>
              <td className={s.transactionElem}>2/4/2018</td>
              <td className={s.transactionElem}>Dinner and Drinks</td>
              <td className={s.transactionElem}>Joel</td>
              <td className={s.transactionElem}>
                <font color="#d0011b">-$32.21</font>
              </td>
            </tr>
            <tr className={s.transactionRow}>
              <td className={s.transactionElem}>1/28/2018</td>
              <td className={s.transactionElem}>Uber to airport</td>
              <td className={s.transactionElem}>Naseem</td>
              <td className={s.transactionElem}>
                <font color="#61a414">+$20.68</font>
              </td>
            </tr>
          </table>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(TransactionHistory);
