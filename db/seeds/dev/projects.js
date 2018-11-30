exports.seed = function(knex, Promise) {
  // We must return a Promise from within our seed function
  // Without this initial `return` statement, the seed execution
  // will end before the asynchronous tasks have completed
  return knex('palettes').del() // delete all palettes first
    .then(() => knex('projects').del()) // delete all projects

    // Now that we have a clean slate, we can re-insert our project data
    .then(() => {
      return Promise.all([
        
        // Insert a single project, return the project ID, insert 2 palettes
        knex('projects').insert({
          name: 'my first project'
        }, 'id')
        .then(project => {
          return knex('palettes').insert([
            { 
              hex1: '#N10377', 
              hex2: '#VAIE99',
              hex3: '#NDIAO8', 
              hex4: '#MAOPF0', 
              hex5: '#1094HD', 
              project_id: project[0]
            }
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) // end return Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};