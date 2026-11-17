const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const users = [];

// Create a new user and add them to the users array
app.post('/api/users', function(req, res) {
  
  const userId = String(users.length + 1);
  
  users.push({
  username: req.body.username,
  _id: userId
  });

  
  res.json({ username: req.body.username, _id: userId});
});

// Return all registered users
app.get('/api/users', function(req, res) {
  res.json(users);
});

app.post('/api/users/:_id/exercises', function(req, res) {
  const userId = req.params._id;
  const description = req.body.description;
  const duration = parseInt(req.body.duration);
  const date = req.body.date ? new Date(req.body.date) : new Date();

  const user = users.find(u => u._id === userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  } else {
    if (!user.log) {
      user.log = [];
    }
    user.log.push({
      description: description,
      duration: duration,
      date: date.toDateString()
    });
    res.json({
      _id: user._id,
      username: user.username,  
      description: description,
      duration: duration,
      date: date.toDateString()
    });
  }
});

app.get('/api/users/:_id/logs', function(req, res) {
  const userId = req.params._id;
  const user = users.find(u => u._id === userId);
  const from = req.query.from;
  const to = req.query.to;
  const limit = req.query.limit;


    if (!user) {
    return res.status(404).json({ error: 'User not found' });
    } else {
      if (!user.log) {
        user.log = [];
      }}
    const filteredLog = user.log.filter(exercise => {
    return (!from || new Date(exercise.date) >= new Date(from)) &&
          (!to || new Date(exercise.date) <= new Date(to));
    });

    const limitedLog = limit ? filteredLog.slice(0, Number(limit)) : filteredLog;


    res.json({
    username: user.username,
    _id: user._id,
    count: limitedLog.length,
    log: limitedLog
  });
  });




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
