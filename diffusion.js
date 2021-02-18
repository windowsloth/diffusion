let w;
let h;

const turb = 100;
const blur = 0;
const passes = 1;

const dry = [];
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
  img = loadImage('./275x500.jpg');
  w = img.width;
  h = img.height;
}

function setup() {
  noLoop();
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
}

function draw() {
  flowField(field, 3);
  diffuse();
}

// function mousePressed() {
//   console.log("oho!");
//   diffuse();
//   console.log("done");
// }

function flowField(arr, channels) {
  const step = .1;
  let xoff = 0;
  for (let s = 0; s < channels; s++) {
    for (let i = 0; i < w; i++) {
      let yoff = 0;
      for (let j = 0; j < h; j++) {
        let noiseval = noise(xoff, yoff);
        let noisecolor = map(noiseval, 0, 1  , 0, 255);
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
}

function diffuse() {
  loadPixels();
  for (let pixel of pixels) {
    dry.push(pixel);
  }

  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      let current = i + w * j;
      let newx = floor(i + field[current].x) % w;
      let newy = floor(j + field[current].y) % h;

      let result = newx + w * newy;

      // pixels[result * 4] = dry[current * 4];
      // pixels[result * 4 + 1] = dry[current * 4 + 1];
      // pixels[result * 4 + 2] = dry[current * 4 + 2];

      pixels[current * 4] -= dry[current * 4];
      pixels[current * 4 + 1] -= dry[current * 4 + 1];
      pixels[current * 4 + 2] -= dry[current * 4 + 2];

      kernel(pixels, current, newx, newy, 0);
    }
  }
  pixels[3000] = pixels[10000];
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

function kernel(arr, current, x, y, ksize) {
  const kw = ksize * 2 + 1;

  for (let i = 0; i < kw; i ++) {
    for (let j = 0; j < kw; j++) {
      let kx = x + i - ksize;
      let ky = y + j - ksize;
      let result = kx + w * ky;

      arr[result * 4] += dry[current * 4] / (ksize * ksize);
      arr[result * 4 + 1] += dry[current * 4 + 1] / (ksize * ksize);
      arr[result * 4 + 2] += dry[current * 4 + 2] / (ksize * ksize);

      // arr[result * 4] = arr[result * 4] + dry[current * 4] / (ksize * ksize) % 255;
      // arr[result * 4 + 1] = arr[result * 4 + 1] + dry[current * 4 + 1] / (ksize * ksize) % 255
      // arr[result * 4 + 2] = arr[result * 4 + 2] + dry[current * 4 + 2] / (ksize * ksize) % 255
    }
  }
}

function popKernels(arr) {
  for (let i = 0; i < w * h; i++) {
    let kernelsize = map(noise(i % w, floor(i / w)), 0, 1, 1, blur * 2 + 1);
    kernelsize = round(kernelsize);
    arr.push(kernelsize);
  }
}
