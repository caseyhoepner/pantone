$(window).on("load", generateColors);
$('.new-palette-btn').on('click', generateColors);
$('.color').on('click', toggleLock);
$('.save-palette-btn').on('click', savePalette);

function generateColors() {
  for(i = 1; i < 6; i++) {
    if(!$(`.color${i}`).hasClass('disabled')) {
      $(`.color${i}`).css('background-color', getRandomColor())
    }
  }
};

function getRandomColor() {
  return "#" + Math.random().toString(16).slice(2, 8);
};

function savePalette() {
  const newPalette = {
    name: $('.palette-name').val(),
    color1: $('.color1').css('background-color'),
    color2: $('.color2').css('background-color'),
    color3: $('.color3').css('background-color'),
    color4: $('.color4').css('background-color'),
    color5: $('.color5').css('background-color')
  }
  console.log(newPalette);
};

function toggleLock() {
  $(event.target).children().toggleClass('locked');
  $(event.target).toggleClass('disabled');
};