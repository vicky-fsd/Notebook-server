const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Note = require('../models/Note');
const fetchuser = require('../middleware/fetchuser');

// ROUTE 1: get all notes
// GET /api/notes/fetchallnotes. Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id })
    res.json(notes)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")
  }
})

// ROUTE 2: Add new note
// POST /api/notes/createnote. Login required
router.post('/createnote', fetchuser, [
  body('title', 'Title cannot be empty').exists(),
  body('description', 'Description must be least 5 characters').isLength({ min: 5 })
], async (req, res) => {
  // If there are errors, return Bad request and the errors
  try {
    const { title, description, tag } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const note = new Note({
      title, description, tag, user: req.user.id
    })
    const savedNote = await note.save();
    res.json(savedNote)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")
  }
})

// ROUTE 3: Update existing note
// PUT /api/notes/updatenote. Login required

router.put('/updatenote/:id', fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {

    // Create a newNote object
    const newNote = {};
    if (title) { newNote.title = title };
    if (description) { newNote.description = description };
    if (tag) { newNote.tag = tag };

    let note = await Note.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found") };

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
    res.json({ note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")
  }
});


// ROUTE 4: Delete existing note
// DELETE /api/notes/deletenote. Login required

router.delete('/deletenote/:id', fetchuser, async (req, res) => {

  try {
    let note = await Note.findById(req.params.id);
    if (!note) { return res.status(404).send("Not Found") };

    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }

    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ "Success": "Note has been deleted", note: note });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error")
  }

});
module.exports = router;