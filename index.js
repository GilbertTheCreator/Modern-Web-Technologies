const express = require('express');
const mongoose = require('mongoose');
const { body, validationResult } = require('express-validator');

const port = 3000;
const app = express();
app.use(express.json());

mongoose.connect('mongodb+srv://Gilbert:V89EKOUwRu3x41sO@1.h0mvxrz.mongodb.net/users', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    name: String,
    age: Number
});

const User = mongoose.model('Users', userSchema);

app.get('/Users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.post('/Users', [
    body('name').isString(),
    body('age').isInt()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
