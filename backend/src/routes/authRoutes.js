const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db/db');
const { generateToken } = require('../utils/jwtUtils');
const Joi = require('joi');

const PASSWORD_MIN_LENGTH = 6;
const router = express.Router();

const registerSchema = Joi.object({
  name: Joi.string().min(1).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(PASSWORD_MIN_LENGTH).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const createErrorResponse = (message, code) => ({
  error: message,
  code,
});

router.post('/register', async (req, res) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json(createErrorResponse('Validation Error', error.details[0].message));
  }

  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password, last_login) VALUES ($1, $2, $3, NOW()) RETURNING *',
      [name, email, hashedPassword]
    );
    const token = generateToken(result.rows[0].id);
    res.status(201).json({ user: result.rows[0], token });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.constraint === 'users_email_key') {
      return res.status(400).json(createErrorResponse('Email already exists', 'EmailExists'));
    }

    res.status(500).json(createErrorResponse('Internal server error', 'InternalError'));
  }
});

router.post('/login', async (req, res) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json(createErrorResponse('Validation Error', error.details[0].message));
  }

  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json(createErrorResponse('Invalid credentials', 'InvalidCredentials'));
    }

    if (user.status === 'blocked') {
      return res.status(403).json(createErrorResponse('User is blocked', 'UserBlocked'));
    }

    const token = generateToken(user.id);

    await pool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [user.id]);

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json(createErrorResponse('Internal server error', 'InternalError'));
  }
});

module.exports = router;
