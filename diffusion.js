let w;
let h;

const turb = 0.1;

let dry = [];
const field = [];

let img;

function preload() {
  img = loadImage('./275x500.jpg');
  w = img.width;
  h = img.height;
}

function setup() {
  noLoop();
  noiseSeed(13);
  pixelDensity(1);
  w = img.width;
  h = img.height;
  createCanvas(w/* * 3*/, h);
  background(220);
  image(img, 0, 0);
}

function draw() {
  flowField();
  diffuse();
}

function flowField() {
  const step = .01;
  let xoff = 0;
  for (let i = 0; i < w; i++) {
    let yoff = 0;
    for (let j = 0; j < h; j++) {
      let noiseval = noise(xoff, yoff);
      let noisecolor = map(noiseval, 0, 1  , 0, 255);
      let noiseangle = map(noiseval, 0, 1, 0, TWO_PI);
      field.push(p5.Vector.fromAngle(noiseangle));
      stroke(noisecolor);
      //point(i + w * 2, j);
      yoff += step;
    }
    xoff += step;
  }
}

function diffuse() {
  loadPixels();
  console.log(pixels.length);
  console.log(field.length);
  for (let i = 0; i < pixels.length / 4; i++) {
    let xpos = i % width;
    let ypos = floor(i / width);
    xpos = xpos + field[i].x;
    ypos = ypos + field[i].y;
    let newval = round(xpos + width * ypos);
    let pixelval = i * 4;
    pixels[pixelval] = pixels[newval];
    pixels[pixelval + 1] = pixels[newval + 1];
    pixels[pixelval + 3] = pixels[newval + 2];
    pixels[pixelval + 3] = pixels[newval + 3];
  }
  updatePixels();
}
