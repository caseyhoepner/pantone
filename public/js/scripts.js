const generateColors = () => {
  for(i = 1; i < 6; i++) {
    if(!$(`.color${i}`).hasClass('disabled')) {
      $(`.color${i}`).css('background-color', getRandomColor())
    }
  }
  activatePaletteBtn();
};

const getRandomColor = () => {
  return "#" + Math.random().toString(16).slice(2, 8);
};

const saveProject = async () => {
  $('.save-project-btn').prop('disabled', true);
  $('.save-project-btn').addClass('disabled');

  const newProject = {
    name: $('.project-name').val(),
  };
  const url = `/api/v1/projects`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(newProject),
    headers: { 
      'Content-Type': 'application/json',
    }
  })
  addOptions(newProject);
  clearInputs();
}

const fetchProjects = async () => {
  const url = `/api/v1/projects`;
  const response = await fetch(url);
  const projects = await response.json();

  fetchPalettes(projects);
  displayProjects(projects);
}

const fetchProjectsOnly = async () => {
  const url = `/api/v1/projects`;

  try {
    const response = await fetch(url)
    const projects = await response.json()
    return projects;

  } catch (error) {
    console.log(error.message);
  }
}

const displayProjects = async (projects) => {
  const projectsContainer = $('.projects');
  const newProjects = document.createElement('div');
  const htmlProjects = projects.forEach(project => {
    projectsContainer.append(`
      <div class='project'>
        <h1>${project.name}</h1>
        <div name=${project.id} class='palettes-container project-${project.id}'>
        </div>
      </div>
      `);
  })
}

const savePalette = async () => {
  $('.save-palette-btn').prop('disabled', true);
  $('.save-palette-btn').addClass('disabled');

  const name = $('#projects-list option:selected').text();
  const projects = await fetchProjectsOnly();
  const foundProjects = projects.filter(project => project.name === name);
  const projectId = foundProjects[0].id;

  const newPalette = {
    name: 'name',
    hex1: $('.color1').css('background-color'),
    hex2: $('.color2').css('background-color'),
    hex3: $('.color3').css('background-color'),
    hex4: $('.color4').css('background-color'),
    hex5: $('.color5').css('background-color'),
  };
  const url = `/api/v1/projects/${projectId}/palettes`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(newPalette),
    headers: { 
      'Content-Type': 'application/json',
    }
  })
  clearInputs();
}

const fetchPalettes = async (projects) => {
  const projectIds = projects.map(project => project.id);
  const palettes = await projectIds.map(projectId => fetchPalette(projectId));
}

const fetchPalette = async (projectId) => {
  const url = `/api/v1/projects/${projectId}/palettes`
  const response = await fetch(url);
  const palettes = await response.json();
  displayPalette(palettes, projectId);
}

const displayPalette = (palettes, projectId) => {
  palettes.forEach(palette => {
    $(`.project-${projectId}`).append(`
      <div name=${palette.id} class='palette-container'>
        <div class='colors-container'>
          <div class='palette-color ${palette.id}1'></div>
          <div class='palette-color ${palette.id}2'></div>
          <div class='palette-color ${palette.id}3'></div>
          <div class='palette-color ${palette.id}4'></div>
          <div class='palette-color ${palette.id}5'></div>
        </div>
        <img class='trash-icon' src='../assets/trash.svg' alt='Click to delete this palette' />
      </div>
    `)

    $(`.${palette.id}1`).css('background-color', palette.hex1);
    $(`.${palette.id}2`).css('background-color', palette.hex2);
    $(`.${palette.id}3`).css('background-color', palette.hex3);
    $(`.${palette.id}4`).css('background-color', palette.hex4);
    $(`.${palette.id}5`).css('background-color', palette.hex5);
  })
}

const toggleLock = () => {
  $(event.target).children().toggleClass('locked');
  $(event.target).toggleClass('disabled');
};

document.body.onkeyup = (e) => {
  if (e.keyCode == 32) {
    generateColors();
  }
};

const toggleViews = () => {
  $('.projects').toggleClass('hide');
  $('.colors').toggleClass('hide');
  $('.action-container').toggleClass('hide');
}

function addOptions(project) {
  var item = document.createElement('option');
  item.innerText = project.name;
  $('#projects-list').append(item);
};

const populateProjects = async () => {
  const url = `/api/v1/projects`
  const response = await fetch(url);
  const projects = await response.json();

  if(projects.length) {
    $('#projects-list').innerHTML = projects.forEach(project => addOptions(project))
  }
};

const clearProjects = () => {
  $('.projects').html('');
}

const switchButton = () => {
  $('.icon').toggleClass('hide');
  $('.view-palettes').toggleClass('hide');
}

const clearInputs = () => {
  $('.project-name').val('');
  $('.palette-name').val('');
}

const activateProjectBtn = () => {
  if ($('.project-name').val() !== '') {
    $('.save-project-btn').prop('disabled', false);
    $('.save-project-btn').removeClass('disabled');
  } else {
    $('.save-project-btn').prop('disabled', true);
    $('.save-project-btn').addClass('disabled');
  }
}

const activatePaletteBtn = () => {
  if ($('#projects-list option:selected').text() !== "Choose a Project") {
    $('.save-palette-btn').prop('disabled', false);
    $('.save-palette-btn').removeClass('disabled');
  } else {
    $('.save-palette-btn').prop('disabled', true);
    $('.save-palette-btn').addClass('disabled');
  }
}

const deletePalette = async (e) => {
  const projectId = e.target.parentNode.parentNode.getAttribute('name')
  const paletteId = e.target.parentNode.getAttribute('name');
  const url = `/api/v1/projects/${projectId}/palettes/${paletteId}`
  const response = await fetch(url, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
      }
    })
  clearProjects()
  fetchProjects()
}

$(window).on("load", generateColors);
$(window).on("load", populateProjects);

$('.new-palette-btn').on('click', generateColors);
$('.color').on('click', toggleLock);

$('.save-project-btn').on('click', saveProject);
$('.save-palette-btn').on('click', savePalette);

 $(document).on('click','.trash-icon', function(event) {
  deletePalette(event)
 })

$('.project-name').on('keyup', activateProjectBtn);
$('#projects-list').on('change', activatePaletteBtn);

$('.favorites-btn').on('click', toggleViews);
$('.favorites-btn').on('click', fetchProjects);
$('.favorites-btn').on('click', clearProjects);
$('.favorites-btn').on('click', switchButton);
