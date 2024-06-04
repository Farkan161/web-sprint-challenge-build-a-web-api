const express = require('express');
const Actions = require('./actions-model'); 
const Projects = require('../projects/projects-model'); 

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const actions = await Actions.get();
    res.json(actions.length ? actions : []);
  } catch (error) {
    res.status(500).json();
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const action = await Actions.get(req.params.id);
    if (!action) {
      res.status(404).json({ message: 'Action not found' });
    } else {
      res.json(action);
    }
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const action = req.body;
    const project = await Projects.get(action.project_id);
    if (!project) {
      res.status(400).json({ message: 'Invalid project_id' });
    } else if (!action.description || !action.notes) {
      res.status(400).json({ message: 'Missing required fields' });
    } else {
      const newAction = await Actions.insert(action);
      res.status(201).json(newAction);
    }
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  const { notes, description, completed, project_id } = req.body;
  if (!notes || !description || completed === undefined || !project_id) {
    res.status(400).json({ message: 'Missing required fields' });
  } else {
    try {
      const updatedAction = await Actions.update(req.params.id, req.body);
      if (!updatedAction) {
        res.status(404).json({ message: 'Action not found' });
      } else {
        res.json(updatedAction);
      }
    } catch (err) {
      next(err);
    }
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const count = await Actions.remove(req.params.id);
    if (count > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Action not found' });
    }
  } catch (err) {
    next(err);
  }
});

router.use((err, req, res, next ) => { 
  res.status(err.status || 500).json({
    customMessage: "something bad is happening",
    message: err.message,
    stack: err.stack,
  })
})

module.exports = router;
