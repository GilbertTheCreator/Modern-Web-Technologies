import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import session from 'express-session';
import passportLocalMongoose from 'passport-local-mongoose'; 

const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');

mongoose.connect('mongodb+srv://Gilbert:V89EKOUwRu3x41sO@1.h0mvxrz.mongodb.net', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "UserSecret",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get('/register', (req, res) => res.render('register'));

app.post('/register', (req, res) => {
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  const newUser = new User({ username: req.body.username, email: req.body.email, password: hashedPassword });
  newUser.save();
  res.json({ message: 'User registered successfully' });
});

app.get('/login', (req, res) => res.render('login'));
app.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ message: 'Logged in successfully' });
});

app.get('/logout', (req, res) => res.render('logout'));
app.post('/logout', (req, res) => {
    res.json({ message: 'Logged out successfully' });
});

app.listen(3000, () => {
  console.log('Server running on <http://localhost:3000/>');
});
