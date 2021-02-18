let w;
let h;

let turb = 15;
let blur = 8;
let passes = 1;
let step = .1;

// const dry = [];
const field = [];
const kernels = [];
let seeds = [];

// const redfield = [];
// const greenfield = [];
// const bluefield = [];
// const redkernels = [];
// const greenkernels = [];
// const bluekernels = [];

let div;

let img;

function preload() {
  // img = loadImage('./275x500.jpg');
  img = loadImage('orpheus.jpg');
  w = img.width;
  h = img.height;
}

function setup() {
  // noLoop();
  // noiseSeed(13);
  pixelDensity(1);
  w = img.width;
  h = img.height;
  createCanvas(w/* * 3*/, h);
  // translate(w / 2, h / 2);
  background(220);
  image(img, 0, 0);

  button = createButton("more");
  button.position(w / 2, h + 15);
  button.mousePressed(diffuse);

  turbslider = createSlider(0, 100, 100);
  blurslider = createSlider(0, 10, 10);
  passslider = createSlider(1, 5, 5);
  stepslider = createSlider(1, 1000);

  turbslider.position(100, h + 20);
  blurslider.position(100, h + 30);
  passslider.position(100, h + 40);
  stepslider.position(100, h + 50);

  turbslider.value(15);
  blurslider.value(8);
  passslider.value(1);
  stepslider.value(1);
}

function draw() {
  turb = turbslider.value();
  blur = blurslider.value();
  passes = passslider.value();
  step = stepslider.value() / 1000;
  // flowField(field);
}

function flowField(arr) {
  let xoff = 0;
  for (let i = 0; i < w; i++) {
    let yoff = 0;
    for (let j = 0; j < h; j++) {
      let noiseval = noise(xoff, yoff);
      let noisecolor = map(noiseval, 0, 1, 0, 255);
      let noiseangle = noiseval * TWO_PI;
      let noisedist = map(noiseval, 0, 1, 0, turb);
      let noisevec = p5.Vector.fromAngle(noiseangle);
      noisevec.mult(noisedist);
      arr.push(noisevec);

      // stroke(255, 255, 255, 10);
      // push();
      // translate(i, j);
      // rotate(noisevec.heading());
      // line(0, 0, noisevec.mag(), 0);
      // pop();

      yoff += step;
    }
    xoff += step;
  }
}

function diffuse() {
  const dry = [];
  const redfield = [];
  const greenfield = [];
  const bluefield = [];
  const redkernels = [];
  const greenkernels = [];
  const bluekernels = [];

  seeds[0] = random(millis()) * random(1000);
  seeds[1] = random(millis()) * random(1000);
  seeds[2] = random(millis()) * random(1000);

  console.log(seeds[0])

  noiseSeed(seeds[0]);
  flowField(redfield);
  popKernels(redkernels);
  noiseSeed(seeds[1]);
  flowField(greenfield);
  popKernels(greenkernels);
  noiseSeed(seeds[2]);
  flowField(bluefield);
  popKernels(bluekernels);

  loadPixels();
  for (let pixel of pixels) {
    dry.push(pixel);
    pixel = 0;
  }
  for (let i = 0; i < w * h; i++) {
    let x = i % w;
    let y = floor(i / w);
    let pixelval = i * 4;

    let xred = round(x + redfield[i].x) % w;
    let yred = round(y + redfield[i].y) % h;
    let newred = (xred + w * yred) * 4;

    let xgreen = round(x + greenfield[i].x) % w;
    let ygreen = round(y + greenfield[i].y) % h;
    let newgreen = (xgreen + w * ygreen) * 4;

    let xblue = round(x + bluefield[i].x) % w;
    let yblue = round(y + bluefield[i].y) % h;
    let newblue = (xblue + w * yblue) * 4;

    kernelLoop(pixels, dry, pixelval, newred, redkernels[i], passes, 0);
    kernelLoop(pixels, dry, pixelval, newgreen, greenkernels[i], passes, 1);
    kernelLoop(pixels, dry, pixelval, newblue, bluekernels[i], passes, 2);
  }
  updatePixels();
}

function kernelLoop(arr, arr2, pos, newpos, kwidth, blurlevel, channel) {
  let full = kwidth * 2 + 1;
  for (let i = 0; i < kwidth * kwidth; i++) {
    if (blurlevel > 1) {
      kernelLoop(arr, pos, newpos, kwidth, blurlevel - 1, channel);
    }
    let xposk = i % kwidth;
    let yposk = floor(i / kwidth);
    let xshift = xposk - kwidth;
    let yshift = yposk - kwidth;
    let spot = (xshift + w * yshift) * 4 + channel + newpos;
    arr[spot] = arr2[pos + channel];
    // arr[spot] += arr2[pos + channel] / (kwidth * kwidth);
    // arr[spot] = (arr [spot] + arr2[pos + channel] / (kwidth * kwidth)) % 255;
    // arr[pos + channel] = 0;
  }
}

function popKernels(arr) {
  for (let i = 0; i < w * h; i++) {
    let kernelsize = map(noise(i % w, floor(i / w)), 0, 1, 1, blur * 2 + 1);
    kernelsize = round(kernelsize);
    arr.push(kernelsize);
  }
}
