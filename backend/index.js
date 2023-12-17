const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const {Token } = require('./middleware/auth');

const app = express();
const port = 3001;
const key = 'key';

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://Gilbert:V89EKOUwRu3x41sO@1.h0mvxrz.mongodb.net/taskapp', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

const User = require('./models/User');
const Task = require('./models/Task');

app.post('/register', async (req, res) => {
  try {
    const { username } = req.body;
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const newuser = new User({ username, password: hashedPassword });
    await newuser.save();
  } catch (error) {
    res.redirect('Error');
  }
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ username }, key);
    res.json({ token });
  } else {
    console.log('Error');
  }
});

app.get('/tasks', Token, async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.username });
    res.json(tasks);
  } catch (error) {
    res.redirect('Error'); 
  }
});

app.post('/tasks', Token, async (req, res) => {
  try {
    const { title } = req.body;
    const task = new Task({ title, userId: req.user.username });
    await task.save();
    res.redirect('Success');
  } catch (error) {
    res.redirect('Error'); 
  }
});

app.delete('/tasks/:taskId', Token, async (req, res) => {
  try {
    const { taskId } = req.params;
    await Task.findByIdAndDelete(taskId);
    res.redirect('Success'); 
  } catch (error) {
    res.redirect('Error'); 
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}/`);
});
