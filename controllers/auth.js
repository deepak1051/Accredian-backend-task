import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json('All fields are required');
    }

    const [user] = await pool.query(`SELECT * FROM users WHERE email=?`, [
      email,
    ]);

    if (user.length > 0) return res.status(400).json('User already exists');

    console.log(user);
    const hashPassword = await bcrypt.hash(password, 10);

    const [newUser] = await pool.query(
      `INSERT INTO users (name, email, password)
    VALUES (?, ?, ?) ;`,
      [name, email, hashPassword]
    );

    const token = jwt.sign({ email }, 'thisissupersecret', {
      expiresIn: '7d',
    });

    res.status(201).json({ token });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json('All fields are required');
    }

    const [existUser] = await pool.query(`SELECT * FROM users WHERE email=?`, [
      email,
    ]);

    if (!existUser[0]) return res.status(400).json('Invalid credentials');

    const isValidPassword = await bcrypt.compare(
      password,
      existUser[0].password
    );

    if (!isValidPassword) return res.status(400).json('Invalid credentials');

    const token = jwt.sign({ email }, 'thisissupersecret', {
      expiresIn: '7d',
    });

    res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
