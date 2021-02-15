let w;
let h;

const turb = 15;
const blur = 5;
const passes = 1;

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
  flowField(field);
}

// function mousePressed() {
//   console.log("oho!");
//   diffuse();
//   console.log("done");
// }

function flowField(arr) {
  const step = .01;
  let xoff = 0;
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

    // pixels[newred] = dry[pixelval];
    // pixels[newgreen] = dry[pixelval + 1];
    // pixels[newblue] = dry[pixelval + 2];

    // pixels[pixelval] = (pixels[pixelval] / 2) + pixels[newval];
    // let redkwidth = redkernels[i] * 2 + 1;
    // for (let j = 0; j < redkwidth * redkwidth; j++) {
    //   let xposk = j % redkwidth;
    //   let yposk = floor(j / redkwidth);
    //   let xshift = xposk - redkwidth;
    //   let yshift = yposk - redkwidth;
    //   let shiftval = (xshift + w * yshift) * 4;
    //   let spot = (newred + shiftval);
    //   pixels[spot] = (pixels[spot] + dry[pixelval + 2] / (redkwidth * redkwidth)) % 255;
    //   // pixels[spot] = dry[pixelval];
    //   // pixels[newred + shiftval] = pixels[pixelval];
    //   // pixels[spot] += dry[pixelval] / (redkwidth * redkwidth);
    //   // pixels[spot + 1] = dry[pixelval + 1];
    //   // pixels[spot + 2] = dry[pixelval + 2];
    //   // pixels[spot] += dry[pixelval] / (redkwidth * redkwidth);
    //   // pixels[pixelval + shiftval] = /*pixels[pixelval + shiftval] + */pixels[newred]/* / (redkwidth * redkwidth)*/;
    //   // pixels[pixelval] = 0;
    // }
    kernelLoop(pixels, dry, pixelval, newred, redkernels[i], passes, 0);
    kernelLoop(pixels, dry, pixelval, newgreen, greenkernels[i], passes, 1);
    kernelLoop(pixels, dry, pixelval, newblue, bluekernels[i], passes, 2);

    // let greenkwidth = greenkernels[i] * 2 + 1;
    // for (let l = 0; l < greenkwidth * greenkwidth; l++) {
    //   let xposk = l % greenkwidth;
    //   let yposk = floor(l / greenkwidth);
    //   let xshift = xposk - greenkwidth;
    //   let yshift = yposk - greenkwidth;
    //   let shiftval = (xshift + w * yshift) * 4 + 1;
    //   let spot = (newgreen + shiftval);
    //   pixels[spot] = (pixels[spot] + dry[pixelval + 2] / (greenkwidth * greenkwidth)) % 255;
    //   // pixels[newgreen + shiftval] = pixels[pixelval + 1];
    //   // pixels[spot] = dry[pixelval + 1];
    //   // pixels[newgreen + shiftval] += pixels[pixelval] / (greenkwidth * greenkwidth);
    //     // pixels[pixelval + shiftval] = pixels[pixelval + shiftval] + pixels[newgreen] / (greenkwidth * greenkwidth);
    //   // pixels[spot] += dry[pixelval + 1] / (greenkwidth * greenkwidth);
    //   // pixels[pixelval + 1] = 0;
    // }

    // let bluekwidth = bluekernels[i] * 2 + 1;
    // for (let m = 0; m < bluekwidth * bluekwidth; m++) {
    //   let xposk = m % bluekwidth;
    //   let yposk = floor(m / bluekwidth);
    //   let xshift = xposk - bluekwidth;
    //   let yshift = yposk - bluekwidth;
    //   let shiftval = (xshift + w * yshift) * 4 + 2;
    //   let spot = (newblue + shiftval);
    //   // pixels[spot] = dry[pixelval + 2];
    //   pixels[spot] = (pixels[spot] + dry[pixelval + 2] / (bluekwidth * bluekwidth)) % 255;
    //   // pixels[spot] += dry[pixelval + 2] / (bluekwidth * bluekwidth);
    //   // pixels[pixelval + 2] = 0;
    // }
  }
  console.log(pixels[3000]);
  updatePixels();

  // for (let i = 0; i < w; i++) {
  //   for (let j = 0; j < h; j++) {
  //     stroke(255, 255, 255, 10);
  //     push();
  //     translate(i, j);
  //     rotate(redfield[i + w * j].heading());
  //     line(0, 0, redfield[i + w * j].mag(), 0);
  //     pop();
  //   }
  // }
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
