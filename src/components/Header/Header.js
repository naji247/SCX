/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Header.css';
import Link from '../Link';
import Navigation from '../Navigation';
import logoUrl from './logo-small.png';

class Header extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <Navigation />
          <Link className={s.brand} to="/">
            <img
              src={logoUrl}
              srcSet={`${logoUrl} 2x`}
              width="90"
              height="90"
              alt="React"
            />
            <span className={s.brandTxt}>SCX</span>
          </Link>
          <div className={s.banner}>
            <div className={s.pricesContainer}>
              <span className={s.bannerTitle}>$10342</span>
              <span className={s.bannerTitle}>$1.01</span>
            </div>
            <p className={s.bannerDesc}>Volatility is not your friend.</p>
            <p className={s.bannerDesc}>
              Take back control of your wealth with stable coins.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Header);
