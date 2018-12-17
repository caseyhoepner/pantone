exports.seed = function(knex, Promise) {
  return knex('palettes').del()
    .then(() => knex('projects').del()) 
    .then(() => {
      return Promise.all([
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
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};