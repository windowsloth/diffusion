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
  createCanvas(w * 3, h);
  background(220);
  image(img, 0, 0);
}

function draw() {
  flowField();
}

function flowField() {
  const step = .025;
  let xoff = 0;
  for (let i = 0; i < w; i++) {
    let yoff = 0;
    for (let j = 0; j < h; j++) {
      let noiseval = noise(xoff, yoff);
      let noisecolor = map(noiseval, 0, 1  , 0, 255);
      let noiseangle = map(noiseval, 0, 1, 0, TWO_PI);
      field.push(p5.Vector.fromAngle(noiseangle));
      stroke(noisecolor);
      point(i + w * 2, j);
      yoff += step;
    }
    xoff += step;
  }
}

function diffuse() {
  loadPixels();

  updatePixels();
}
