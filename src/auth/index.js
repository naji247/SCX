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

/* POST login. */

const authenticate = (req, res, err, user, info) => {
  if (err) {
    return res.status(500).json({
      message: err.message,
    });
  }

  if (!user) {
    return res.status(400).json({
      message: 'Incorrect email or password.',
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
      { expiresIn: '10h' },
    );

    const noPasswordUser = _.omit(user.dataValues, [
      'emailConfirmed',
      'password',
    ]);
    return res.json({ ...noPasswordUser, token });
  });
};

auth.post('/signup', function(req, res, next) {
  const { firstName, lastName, email, password } = req.body;

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

  if (errorMessage.length > 0) {
    return res.status(400).json({
      message: errorMessage,
    });
  }

  var user;
  bcrypt
    .hash(password, 10)
    .then(password => {
      user = User.build({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        createdAt: moment(),
        updatedAt: moment(),
      });

      return user.save();
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
          message: `User with the email ${user.email} already exists.`,
        });
      }
      return res.status(500).send({
        message: err.message,
      });
    });
});

auth.post('/login', function(req, res, next) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    return authenticate(req, res, err, user, info);
  })(req, res);
});
