/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Login.css';
import { connect } from 'react-redux';
import { login } from '../../actions/authActions';
import Signup from './Signup';
import validate from 'validate.js';
import { BeatLoader } from 'react-spinners';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
    validationIssues: undefined,
  };

  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  onLoginClick() {
    const { email, password } = this.state;
    const { login } = this.props;

    const loginConstraints = {
      email: {
        presence: true,
        email: {
          message: 'does not seem valid.',
        },
      },
      password: {
        presence: true,
        length: {
          minimum: 6,
          message: 'must be at least 6 characters.',
        },
      },
    };

    const validationIssues = validate({ email, password }, loginConstraints);
    this.setState({
      validationIssues: validationIssues,
    });
    if (!validationIssues) {
      login(email, password);
    } else {
      this.setState({
        validationIssues: { ...validationIssues, server: [] },
      });
    }
  }

  render() {
    var issues = this.state.validationIssues;
    if (!issues && this.props.error) {
      issues = { server: [this.props.error.error.message] };
    }
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>{this.props.title}</h1>
          <p className={s.lead}>Log in with your email address.</p>
          <ErrorList issues={issues} />
          <div className={s.formGroup}>
            <label className={s.label} htmlFor="email">
              Email address:
              <input
                className={s.input}
                value={this.state.email}
                onChange={event => this.handleEmailChange(event)}
                id="login-email"
                type="text"
                name="email"
                autoFocus // eslint-disable-line jsx-a11y/no-autofocus
              />
            </label>
          </div>
          <div className={s.formGroup}>
            <label className={s.label} htmlFor="password">
              Password:
              <input
                className={s.input}
                id="login-password"
                value={this.state.password}
                onChange={event => this.handlePasswordChange(event)}
                type="password"
                name="password"
              />
            </label>
          </div>
          <div className={s.formGroup}>
            <button
              onClick={() => this.onLoginClick()}
              className={s.button}
              type="submit"
            >
              {!this.props.loading ? 'Login' : <BeatLoader color={'#ffffff'} />}
            </button>
          </div>
          {/* <strong className={s.lineThrough}>OR</strong> */}
        </div>
      </div>
    );
  }
}

export class ErrorList extends React.Component {
  render() {
    const { issues } = this.props;
    if (!issues || issues.length === 0) return null;

    var messages = [];
    if (issues.email) {
      _.forEach(issues.email, reason => {
        messages.push(
          <p key={reason} className={s.issues}>
            {reason}
          </p>,
        );
      });
    }

    if (issues.password) {
      _.forEach(issues.password, reason => {
        messages.push(
          <p key={reason} className={s.issues}>
            {reason}
          </p>,
        );
      });
    }

    if (issues.server) {
      _.forEach(issues.server, reason => {
        messages.push(
          <p key={reason} className={s.issues}>
            {reason}
          </p>,
        );
      });
    }
    return <div>{messages}</div>;
  }
}

const mapState = state => ({
  loading: state.userState.isLoadingLogin,
  error: state.userState.loginError,
});

const mapDispatch = {
  login,
};

export default connect(mapState, mapDispatch)(withStyles(s)(Login));
