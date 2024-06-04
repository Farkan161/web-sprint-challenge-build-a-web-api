// add middlewares here related to actions
function logger(req, res, next) {
    const method = req.method
    const url = req.originalUrl
    console.log(`${method} request to ${url}`);
    next();
  }
  
  async function validateProjectId(req, res, next) {
    try {
      const project = await project.getById(req.params.id);
      if (project) {
        req.project = project;
        next();
      } else {
        res.status(404).json({ message: 'Project not found' });
      }
    } catch (error) {
      res.status(500).json({ message: 'Error validating project ID' });
    }
  }
  
  module.exports = {
    logger,
    validateProjectId,
  };
  