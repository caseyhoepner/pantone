
const generateColors = () => {
  console.log('generating colors')
  $('.color1').css('background-color', getRandomColor())
  $('.color2').css('background-color', getRandomColor())
  $('.color3').css('background-color', getRandomColor())
  $('.color4').css('background-color', getRandomColor())
  $('.color5').css('background-color', getRandomColor())
};

$(window).on("load", generateColors);
$('.new-palette-btn').on('click', generateColors);

const getRandomColor = () => {
  return (
    "#" +
    Math.random()
      .toString(16)
      .slice(2, 8)
  );
};

