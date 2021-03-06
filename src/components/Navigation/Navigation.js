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
import s from './Navigation.css';
import Link from '../Link';
import { connect } from 'react-redux';
import { logout } from '../../actions/authActions';
import store from '../../storeUtil';

class Navigation extends React.Component {
  onLogoutClick(event) {
    // TODO: Add long term storage
    if (store.get('scx_token')) store.remove('scx_token');
    this.props.logout();
  }

  render() {
    return (
      <div className={s.root} role="navigation">
        <Link className={s.link} to="/">
          Analytics
        </Link>
        <Link className={s.link} to="/about">
          About
        </Link>
        {this.props.token
          ? [
              <Link className={s.link} to="/accounts">
                Accounts
              </Link>,
              <Link
                className={s.link}
                to="/"
                onClick={event => this.onLogoutClick(event)}
              >
                Logout
              </Link>,
            ]
          : [
              <Link className={s.link} to="/login">
                Login
              </Link>,
              <Link className={s.link} to="/signup">
                Sign Up
              </Link>,
            ]}

        {/* <Link className={s.link} to="/trade">
          Trade
        </Link> */}
        {/* <span className={s.spacer}> | </span>
        <Link className={s.link} to="/login">
          Log in
        </Link>
        <span className={s.spacer}>or</span>
        <Link className={cx(s.link, s.highlight)} to="/register">
          Sign up
        </Link> */}
      </div>
    );
  }
}

const mapState = state => ({
  token: state.userState.token,
});

const mapDispatch = { logout };

export default connect(mapState, mapDispatch)(withStyles(s)(Navigation));
