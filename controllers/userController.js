import User from '../models/userModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const saltRounds = 10;

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

function isNotValid(str) {
  if (str == undefined || str.length == 0) {
    return true;
  } else {
    return false;
  }
}

const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  if (isNotValid(name) || isNotValid(email) || isNotValid(password)) {
    return res
      .status(400)
      .send({ type: 'error', message: 'Invalid Form Data!' });
  }
  try {
    const user = await User.findOne({ where: { email: email } });

    if (user) {
      throw { type: 'error', message: 'Email Already Exists!' };
    } else {
      const hash = await bcrypt.hash(password, saltRounds);
      await User.create({ name, email, password: hash });
      res.status(200).send({ message: 'user created successfully' });
    }
  } catch (error) {
    if (error.type === 'error') {
      res.status(403).send(error.message);
    } else {
      console.log(error);
      res.status(500).send({ message: 'Internal server error' });
    }
  }
};

const logIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (isNotValid(email) || isNotValid(password)) {
    return res
      .status(400)
      .send({ type: 'error', message: 'Invalid Form Data!' });
  }

  try {
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      throw { type: 'error', message: 'email not found!' };
    } else {
      bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
          res.status(500).send({ message: 'Internal server error' });
        }
        if (result == true) {
          const token = jwt.sign(
            { userId: user.id, userEmail: user.email },
            JWT_SECRET_KEY
          );
          res
            .status(200)
            .send({ message: 'logged in successfully', sessionToken: token });
        } else {
          res
            .status(404)
            .send({ type: 'error', message: 'password is incorrect' });
        }
      });
    }
  } catch (error) {
    if (error.type === 'error') {
      res.status(403).send(error.message);
    } else {
      console.log(error);
      res.status(500).send({ message: 'Internal server error' });
    }
  }
};

export default {
  signUp,
  logIn,
};
