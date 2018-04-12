/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import Layout from '../../components/Layout';
import About from '../../components/About';
import Introducing from '../../components/Introducing';
import Description from '../../components/Description';
import StablecoinPrimer from '../../components/StablecoinPrimer';
import CallToAction from '../../components/CallToAction';

import about from './about.md';

function action() {
  return {
    chunks: ['about'],
    title: about.title,
    component: (
      <Layout>
        <Introducing />
        <Description />
        <StablecoinPrimer />
        <CallToAction />
      </Layout>
    ),
  };
}

export default action;
