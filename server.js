const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use( bodyParser.json() );

app.use(express.static('public'));

app.set('port', process.env.PORT || 3000);
app.locals.title = 'Palette Picker';
app.locals.projects = [
  { id: 1, name: 'my project',  }
];

app.locals.palettes = [
  { id: 1, name: 'nature', hex1: '#EUOSJ0', hex2: '#702931', hex3: '#9FNQW8', hex4: '#NUE9A1', hex5: '#PKFI8X', project_id: 1 },
  { id: 2, name: 'beach', hex1: '#NDI8W9', hex2: '#983819', hex3: '#BNAIUS9', hex4: '#MVIS08', hex5: '#0094HD', project_id: 1 },
  { id: 3, name: 'roadtrip', hex1: '#NAUEFG', hex2: '#NAI92K', hex3: '#MPSO9G', hex4: '#IA82I9', hex5: '#1094HD', project_id: 2 },
  { id: 4, name: 'warm', hex1: '#NSUE30', hex2: '#VSU75H', hex3: '#S2950L', hex4: '#SSE455', hex5: '#33EE44', project_id: 1 },
  { id: 5, name: 'cool', hex1: '#N10377', hex2: '#VAIE99', hex3: '#NDIAO8', hex4: '#MAOPF0', hex5: '#1094HD', project_id: 2 }
];

// get project
// post project
// delete palette

app.get('/api/v1/projects/:project_id/palettes', (request, response) => {
  const palettes = app.locals.palettes;

  return response.json({ palettes });
});

app.get('/api/v1/projects/:project_id/palette/:palette_id', (request, response) => {
  const { id } = request.params;
  const palette = app.locals.palettes.find(palette => palette.id === id);
  if (palette) {
    return response.status(200).json(palette);
  } else {
    return response.sendStatus(404);
  }
});

app.post('/api/v1/palettes', (request, response) => {
  const { palette } = request.body;
  const id = Date.now();

  if (!palette) {
    return response.status(422).send({
      error: 'No palette property provided'
    });
  } else {
    app.locals.palettes.push({ id, palette });
    return response.status(201).json({ id, palette });
  }
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`);
});