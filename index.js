import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import https from 'https';
import fs from 'fs';
import passportLocalMongoose from 'passport-local-mongoose'; 

const app = express();
app.use(cors());
const PORT = 3000;

app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://Gilbert:V89EKOUwRu3x41sO@1.h0mvxrz.mongodb.net', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  posted_by: String, 
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'SECRET',
  resave: false,
  saveUninitialized: false,
}));

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req, res, next) => {
  if (req.headers && req.headers.authorization) {
    jwt.verify(req.headers.authorization, 'SECRET', (err, decoded) => {
      if (err) return res.status(401).send({ message: 'Unauthorized' });
      req.user = decoded;
      next();
    });
  } else {
    next();
  }
});

app.get('/register', (req, res) => res.render('register'));
app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({ username: req.body.username, password: hashedPassword, posted_by: req.body.posted_by });
    await newUser.save();
    res.json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user' });
  }
});

app.get('/login', (req, res) => res.render('login'));
app.post('/login', passport.authenticate('local'), (req, res) => {
  const token = jwt.sign({ userId: req.user._id, username: req.user.username }, 'SECRET', { expiresIn: '1h' });
  res.json({ message: 'Logged in successfully', token });
});

app.get('/logout', (req, res) => res.render('logout'));
app.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

const httpsOptions = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem'),
};

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`HTTPS server running on https://localhost:${PORT}`);
});
