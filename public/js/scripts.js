let projectId = 1

const generateColors = () => {
  for(i = 1; i < 6; i++) {
    if(!$(`.color${i}`).hasClass('disabled')) {
      $(`.color${i}`).css('background-color', getRandomColor())
    }
  }
};

const getRandomColor = () => {
  return "#" + Math.random().toString(16).slice(2, 8);
};

const saveProject = async () => {
  const newProject = {
    name: $('.project-name').val(),
  }
  const url = `/api/v1/projects`;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(newProject),
    headers: { 
      'Content-Type': 'application/json',
    }
  })
  const data = await response.json();
}



const savePalette = async () => {
  const newPalette = {
    name: $('.palette-name').val(),
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
  const data = await response.json();
}

const toggleLock = () => {
  $(event.target).children().toggleClass('locked');
  $(event.target).toggleClass('disabled');
};

document.body.onkeyup = function(e) {
  if (e.keyCode == 32) {
    generateColors();
  }
};

$(window).on("load", generateColors);
$('.new-palette-btn').on('click', generateColors);
$('.color').on('click', toggleLock);
$('.save-project-btn').on('click', saveProject);
$('.save-palette-btn').on('click', savePalette);