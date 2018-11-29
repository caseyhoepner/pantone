let randomColors;

const generateColors = () => {
  randomColors = [
    getRandomColor(),
    getRandomColor(),
    getRandomColor(),
    getRandomColor(),
    getRandomColor(),
  ]

  $('.color1').css('background-color', randomColors[0])
  $('.color2').css('background-color', randomColors[1])
  $('.color3').css('background-color', randomColors[2])
  $('.color4').css('background-color', randomColors[3])
  $('.color5').css('background-color', randomColors[4])
};

$(window).on("load", generateColors);
$('.new-palette-btn').on('click', generateColors);

const getRandomColor = () => {
  return "#" +Math.random().toString(16).slice(2, 8)
};

const savePalette = () => {
  const newPalette = {
    name: $('.palette-name').val(),
    color1: randomColors[0],
    color2: randomColors[1],
    color3: randomColors[2],
    color4: randomColors[3],
    color5: randomColors[4]
  }
  console.log(newPalette);
}

$('.save-palette-btn').on('click', savePalette);