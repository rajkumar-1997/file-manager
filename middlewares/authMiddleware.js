import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import dotenv from 'dotenv';
dotenv.config();

const authenticate = async (req, res, next) => {
  const token = req.header('Authorization');
  try {
    const { userId } = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findByPk(userId);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).send({ type: 'error', message: 'Authorization Failed!' });
    }
  } catch (error) {
    res.status(401).send({ type: 'error', message: 'Authorizetion Failed!' });
  }
};

export default { authenticate };
