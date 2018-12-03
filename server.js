//requiring express so it can be used in this project
const express = require('express');
//defining a specific instance of express
const app = express();
//requiring body parser so it can be used in this project
const bodyParser = require('body-parser');
//specifying which environment the project should be running in
const environment = process.env.NODE_ENV || 'development';
//fetching the database configuration from the knex file based on the environment (this is for both lines 10 and 11)
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

//using body parser to parse the body of an HTTP request
app.use(bodyParser.json());
//using express to serve static files
app.use(express.static('public'));

//setting the port to either the one found in process.env or 3000
app.set('port', process.env.PORT || 3000);

//getting projects
app.get('/api/v1/projects', (request, response) => {
  //selecting projects from the projects table on the database
  database('projects').select()
    //then
    .then((projects) => {
      //responding with a status code of 200 (success!) and returning the readable projects
      response.status(200).json(projects);
    })
    //catching and error
    .catch((error) => {
      //responding with a status code of 500 (unsuccessful...) and returning the readable error
      response.status(500).json({ error });
    });
});

//posting a project to this URL
app.post('/api/v1/projects', (request, response) => {
  //defining a project variable and setting it's value to the body of the request
  const project = request.body;

  //looping through the required parameters
  for (let requiredParameter of ['name']) {
    //if the specific parameter is missing, 
    if (!project[requiredParameter]) {
      //return a status code of 422 and an error explaining what else is needed 
      return response
        .status(422)
        .send({ error: `Expected format: { name: <String> }. You're missing a "${requiredParameter}" property.` });
    }
  }

  //inserting a project into the 'projects' table in the database
  database('projects').insert(project, 'id')
    //then
    .then(project => {
      //responsing with a status code of 201 (successfully created) and sending back the id of the posted project
      response.status(201).json({ id: project[0] })
    })
    //catching an error
    .catch(error => {
      //responding with a status of 500 and the error that was caught
      response.status(500).json({ error });
    });
});

//getting a specific project based off of its id
app.get('/api/v1/projects/:id', (request, response) => {
  //selecting the project from the projects table of the database that has the correct id
  database('projects').where('id', request.params.id).select()
    //then
    .then(projects => {
      //if the length projects array has a length
      if (projects.length) {
        //responde with a statust code of 200 (success!) and return the project
        response.status(200).json(projects);
      //otherwise,
      } else {
        //respond with a status code of 404 (not found) and alert the user that the specific project could not be found
        response.status(404).json({ 
          error: `Could not find project with id ${request.params.id}`
        });
      }
    })
    //catching an error
    .catch(error => {
      //responding with a status code of 500 (error) and the error
      response.status(500).json({ error });
    });
});

//getting the palettes using this URL
app.get('/api/v1/projects/:project_id/palettes', (request, response) => {
  //selecting the palettes from the palettes table
  database('palettes').select()
    //then
    .then((palettes) => {
      //responding with a status code of 200 and returning the palettes
      response.status(200).json(palettes);
    })
    //catching an error
    .catch((error) => {
      //responding with a status code of 500 and the error
      response.status(500).json({ error });
    });
});

//posting a palette using the specified URL
app.post('/api/v1/projects/:project_id/palettes', (request, response) => {
  //defining the variable palette and assigning it the value of the request body
  const palette = request.body;
  //defining the variable project_id and assigning it the value of the request params id
  const project_id = request.params.id;

  //looping through the parameters
  for (let requiredParameter of ['name', 'hex1', 'hex2', 'hex3', 'hex4', 'hex5' ]) {
    //if a parameter is missing
    if (!palette[requiredParameter]) {
      //return a status code of 422 and an error specifying what's missing
      return response
        .status(422)
        .send({ error: `Expected format: {hex1: <String>, hex2: <String>, hex3: <String>, hex4: <String>, hex5: <String>, project_id: <Number>}. You're missing a "${requiredParameter}" property.` });
    }
  }

  //inserting a palette to the palettes table in the database
  database('palettes').insert(palette, 'id')
    //then
    .then(palette => {
      //responding with a status code of 201 (successfully created) and the id of the posted palette
      response.status(201).json({ id: palette[0] })
    })
    //catching an error
    .catch(error => {
      //responding with a status code of 500 and the error
      response.status(500).json({ error });
    });
});

//getting a specific palette using the specified URL
app.get('/api/v1/projects/:project_id/palettes/:palette_id', (request, response) => {
  //selecting the palette with the specified id
  database('palettes').where('id', request.params.id).select()
    //then
    .then(palettes => {
      //if the palettes array has a length
      if (palettes.length) {
        //respond with a status code of 200 and return the palette
        response.status(200).json(palettes);
      //otherwise
      } else {
        //respond with a status code of 404 and and error that the palette could not be found
        response.status(404).json({ 
          error: `Could not find palette with id ${request.params.id}`
        });
      }
    })
    //catching an error
    .catch(error => {
      //responding with a status code of 500 and the error that was caught
      response.status(500).json({ error });
    });
});

//used to delete a palette using this URL
app.delete('/api/v1/projects/:project_id/palettes/:id', (request, response) => {
  //assigning a variable of id based off of the request params
  const { id } = request.params

  //deleting and palette with the matching id
  database('palettes').where(id, 'id').del()
    //sending a response that the palette was successfully deleted
    .then(() => response.send({ message: `Palette ${id} has been deleted.` }))

    //catching the error
    .catch(error => {
      //giving a status response of 500 and the error that was caught
      response.status(500).json({ error });
    });
})

//app is poised and ready to recieve changes from the port
app.listen(app.get('port'), () => {
  //logging which port the project is running on
  console.log(`PalettePicker is running on ${app.get('port')}.`);
});