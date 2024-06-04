const express = require('express');
const Projects = require('./projects-model'); 

const router = express.Router()

router.get('/', async (req, res, next) => {
  try {
    const projects = await Projects.get();
    res.json(projects.length ? projects : []);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const project = await Projects.get(req.params.id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  const { name, description, completed } = req.body;
  if (!name || !description) {
    res.status(400).json({ message: 'Missing required fields' });
  } else {
    try {
      const newProject = await Projects.insert({ name, description, completed });
      res.status(201).json(newProject);
    } catch (err) {
      next(err);
    }
  }
});

router.put('/:id', async (req, res, next) => {
  const { name, description, completed } = req.body;
  if (!name || !description || completed === undefined) {
    res.status(400).json({ message: 'Missing required fields' });
  } else {
    try {
      const updatedProject = await Projects.update(req.params.id, { name, description, completed });
      if (updatedProject) {
        res.json(updatedProject);
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    } catch (err) {
      next(err);
    }
  }  
});

router.delete('/:id', async (req, res, next) => {
  try {
    const count = await Projects.remove(req.params.id);
    if (count > 0) {
      res.status(204).end();
    } else {
      res.status(404).json({ message: 'Project not found' });
    }
  } catch (err) {
    next(err);
  }
});

router.get('/:id/actions', async (req, res, next) => {
  try {
    const actions = await Projects.getProjectActions(req.params.id);
    if (actions.length > 0) {
      res.json(actions);
    } else {
      res.json([]);
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
