//routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';
export const auth = express.Router();
import config from '../config';
import User from '../data/models/User';
import moment from 'moment';
import bcrypt from 'bcrypt';
import _ from 'lodash';
import bip39 from 'bip39';
import walletjs from 'ethereumjs-wallet/hdkey';
import Wallet from '../data/models/Wallet';
import * as kmsUtil from '../kmsUtils';
import crypto from 'crypto-js';

/* POST login. */

const authenticate = (req, res, err, user, info) => {
  if (err) {
    return res.status(500).json({
      message: err.message
    });
  }

  if (!user) {
    return res.status(400).json({
      message: 'Incorrect email or password.'
    });
  }

  req.login(user, { session: false }, err => {
    if (err) {
      res.status(500).send(err);
    }

    // generate a signed son web token with the contents of user object and return it in the response
    const token = jwt.sign(
      { id: user.id, email: user.email },
      config.auth.jwt.secret,
      { expiresIn: '10h' }
    );

    const noPasswordUser = _.omit(user.dataValues, [
      'emailConfirmed',
      'password'
    ]);
    return res.json({ ...noPasswordUser, token });
  });
};

auth.post('/signup', function(req, res, next) {
  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    country
  } = req.body;

  var errorMessage = [];
  if (!firstName) {
    errorMessage.push('Missing first name.');
  }

  if (!lastName) {
    errorMessage.push('Missing last name.');
  }

  if (!email) {
    errorMessage.push('Missing email.');
  }

  if (!password) {
    errorMessage.push('Missing password.');
  }

  if (!phoneNumber) {
    errorMessage.push('Missing phone number.');
  }

  if (errorMessage.length > 0) {
    return res.status(400).json({
      message: errorMessage
    });
  }

  var user;
  bcrypt
    .hash(password, 10)
    .then(password => {
      user = User.build({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
        phone_number: phoneNumber,
        created_at: moment(),
        updated_at: moment()
      });

      return user.save();
    })
    .then(newUser => {
      try {
        const userId = newUser.userId;
        const walletSeed = bip39.generateMnemonic();
        const hdWallet = walletjs.fromMasterSeed(walletSeed);
        const normalWallet = hdWallet.getWallet();

        const unencryptedPublicKey = normalWallet.getPublicKey();
        console.log(unencryptedPublicKey);
        const unencryptedPrivateKey = normalWallet.getPrivateKey();
        const unencryptedWalletAddress = normalWallet.getAddress();
      } catch (error) {
        return newUser.destroy({ force: true }).then(() => {
          throw new Error(
            'Failed to sign up user because wallet creation failed.'
          );
        });
      }

      console.log('2nd: ');
      return Promise.all([
        kmsUtil.encrypt(unencryptedPublicKey.toString('hex')),
        kmsUtil.encrypt(unencryptedPrivateKey.toString('hex')),
        kmsUtil.encrypt(unencryptedWalletAddress.toString('hex'))
      ])
        .then(encryptedResults =>
          // In order to decrypt, use new Buffer(encryptedString, 'base64')
          Wallet.create({
            user_id: userId,
            public_key: encryptedResults[0].toString('base64'),
            private_key: encryptedResults[1].toString('base64'),
            address: encryptedResults[2].toString('base64')
          }).then(wallet => newUser)
        )
        .catch(err =>
          newUser.destroy({ force: true }).then(() => {
            throw new Error(
              'Failed to sign up user because wallet creation failed.'
            );
          })
        );
    })
    .then(newUser => {
      return authenticate(req, res, null, newUser, null);
    })
    .catch(err => {
      if (
        err.original &&
        err.original.code == 23505 &&
        err.original.constraint === 'User_email_key'
      ) {
        return res.status(409).send({
          message: `User with the email ${user.email} already exists.`
        });
      }
      return res.status(500).send({
        message: err.message
      });
    });
});

auth.post('/login', function(req, res, next) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    return authenticate(req, res, err, user, info);
  })(req, res);
});
