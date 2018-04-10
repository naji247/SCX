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
import s from './CallToAction.css';
import { connect } from 'react-redux';
import Fade from 'react-reveal/Fade';

class CallToAction extends React.Component {
  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1 className={s.bigText}> So what are you waiting for? </h1>
          <h3 className={s.smallText}>
            Sign up today to be part of the future
          </h3>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(CallToAction);
