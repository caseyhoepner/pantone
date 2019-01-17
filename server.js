const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.use(bodyParser.json());
app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);

app.get('/api/v1/projects', (request, response) => {
  database('projects').select()
    .then((projects) => {
      response.status(200).json(projects);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.post('/api/v1/projects', (request, response) => {
  const project = request.body;

  for (let requiredParameter of ['name']) {
    if (!project[requiredParameter]) {
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  database('projects').insert(project, 'id')
    .then(project => {
      response.status(201).json({ id: project[0] })
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/projects/:id', (request, response) => {
  database('projects').where('id', request.params.id).select()
    .then(projects => {
      if (projects.length) {
        response.status(200).json(projects);
      } else {
        response.status(404).json({ 
          error: `Could not find project with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/projects/:project_id/palettes', (request, response) => {
  const { project_id } = request.params;

  database('palettes').where('project_id', project_id).select()
    .then(palettes => response.status(200).json(
      palettes
    ))
    .catch(error => response.status(500).json({
      error: 'Error fetching palettes'
    }))
})

app.post('/api/v1/projects/:project_id/palettes', (request, response) => {
  const { project_id } = request.params;
  const palette = request.body;

  for(let requiredParam of ['name', 'hex1', 'hex2', 'hex3', 'hex4', 'hex5']) {
    if(!palette[requiredParam]) {
      response.status(422).json({ error: 'Missing required params' })
    }
  }

  database('palettes').insert({ ...palette, project_id }, 'id')
    .then(paletteIds => {
      response.status(201).json({ id: paletteIds[0] })
    })
    .catch(error => {
      response.status(500).json({ error: error.message })
    })
});

app.get('/api/v1/projects/:project_id/palettes/:palette_id', (request, response) => {
  database('palettes').where('id', request.params.id).select()
    .then(palettes => {
      if (palettes.length) {
        response.status(200).json(palettes);
      } else {
        response.status(404).json({ 
          error: `Could not find palette with id ${request.params.id}`
        });
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/projects/:project_id/palettes/:id', (request, response) => {
  const { id } = request.params
  database('palettes').where('id', id).del()
    .then(() => response.send({ message: 'Palette ${id} has been deleted.' }))

    .catch(error => {
      response.status(500).json({ error });
    });
})

app.listen(app.get('port'), () => {
  console.log(`PalettePicker is running on ${app.get('port')}.`);
});