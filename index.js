const express = require('express');

const server = express();

server.use(express.json());

//Instanciando o array vazio de projetos
const projectsArray = [];

//MIDDLEWARE CountRequests global
server.use((req, res, next) => {
  console.count('Request Counter');

  return next();
});

//MIDDLEWARE checkProjectExists para ser usado em alguns métodos
function checkUserExists(req, res, next) {
	const { id } = req.params;

  const project = projectsArray.find(element => element.id === id);

	if(!project) {
		return res.status(400).json({error: 'Project not existant'});
	}
	
  req.project = project;

	return next();
}

//POST /projects
server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks:[]
  }

  projectsArray.push(project);

  return res.json(projectsArray);
})

//GET /projects
server.get('/projects', (req, res) => {
  return res.json(projectsArray);
})

//PUT /projects/:id
server.put('/projects/:id', checkUserExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projectsArray.find(element => element.id === id);

  project.title = title;
 
  return res.json(project);
});

//DELETE /projects/:id
server.delete('/projects/:id', checkUserExists, (req, res) => {
  const { id } = req.params;

  const index = projectsArray.findIndex(element => element.id === id);

  projectsArray.splice(index, 1);
 
  return res.send('Projeto deletado');
});

//POST /projects/:id/tasks
server.post('/projects/:id/tasks', checkUserExists, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projectsArray.find(element => element.id === id);

  project.tasks.push(title);
 
  return res.json(project);
});

server.listen(3333);

