const express = require('express');
const app = express();

app.use(express.json());

app.use(express.static('public'));

const fs = require('fs');
const path = require('path');

const notesPath = path.join(__dirname, 'db.json');

// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get('/api/notes', (req, res) => {
  fs.readFile(notesPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    res.json(JSON.parse(data));
  });
});

// POST /api/notes should receive a new note to save on the request body, add it to the db.json file,
// and then return the new note to the client.
app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;
  if (!title || !text) {
    return res.status(400).json({ message: 'Title and text are required' });
  }
  fs.readFile(notesPath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    const notes = JSON.parse(data);
    const newNote = { title, text, id: Date.now().toString() };
    notes.push(newNote);
    fs.writeFile(notesPath, JSON.stringify(notes), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      res.json(newNote);
    });
  });
});
