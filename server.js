const express = require('express');
const app = express();
const port = 3000;
const methodOverride = require('method-override');

app.use(express.urlencoded());
app.use(express.json());
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

const users = [
  { "id": 1, "name": "John" },
  { "id": 2, "name": "Jane" }
];

app.get('/api/workouts/add/:id', (req,res) =>{
  res.render('users.ejs');
})

app.post('/api/users', (req, res) => {
  const newUser ={
    id:users.length + 1,
    name: req.body.name
  };
  users.push(newUser);
    res.redirect('/api/users');
  });

app.put('/api/users/update/:id', (req, res) => {
  console.log("fired put");
    const userId = parseInt(req.params.id);
    const updatedName = req.body.name;

    const user = users.find(w => w.id === userId);

    if (user) {
      user.name = updatedName;
      res.status(200).send(`User Updated`);
    } else {
      res.status(404).send(`User Not Found`);
    }
});

app.delete('/api/users/delete/:id', (req, res) => {
  const userId = parseInt(req.params.id);

    const index = users.findIndex(w => w.id === userId);

    if (index !== -1) {
      users.splice(index, 1);
      res.redirect('/api/users')
    } else {
      res.status(404).send(`User was not found`);
    }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:3000/`);
});
