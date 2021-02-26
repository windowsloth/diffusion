let w = 0;
let h = 0;

let step = .01;
let turb = 10;
let blur = 10;
const passes = 0;

const dry = [];
const order = [];
const field = [[], [], []];
const kernels = [[], [], []];
let seeds = [];

//let undobutton;
let div;

let img;

function preload() {
}

function setup() {
  // noLoop();
  pixelDensity(1);
  createCanvas(w/* * 3*/, h).parent('maincontent');
  background(220);

  browse = createFileInput(handleFile).id('file').class('upload').parent('gui');
  browsel = createElement('label', 'Select File').attribute('for','file').parent('gui');
  // browse.position(w / 2, h - 10);

  turbslider = createSlider(0, 500, 5).parent('gui');
  turbl = createP('Turbulence Level: ' + turb).class('label').parent('gui');
  blurslider = createSlider(0, 50, 1).parent('gui');
  blurl = createP('Blur Size: ' + blur).class('label').parent('gui');
  noiseslider = createSlider(1, 1000, 5).parent('gui');
  noisel = createP('Noise Variance: ' + step).class('label').parent('gui');

  turbslider.value(turb);
  blurslider.value(blur);
  noiseslider.value(step * 1000);
  diffbutton = createButton("more").class('magic').parent('gui');
  // button.position(w / 2, h + 25);
  diffbutton.mousePressed(diffuse);
  undobutton = createButton('undo').class('inactive').parent('gui');
  untobutton.mousePressed(undodiffusion);
}

function draw() {
  turbl.html('Turbulence Level: ' + turb);
  blurl.html('Blur Size: ' + blur);
  noisel.html('Noise Variance: ' + step);
  turb = turbslider.value();
  blur = blurslider.value();
  step = noiseslider.value() / 1000;
}

function handleFile(file) {
  img = null;
  if (file.type === 'image') {
    // img = createImg(file.data, '');
    img = loadImage(file.data, img => {
      if (img.width > 1000) {
        console.log(img.width);
        img.resize(1000, 0);
        console.log('width resized!');
      } else if (img.height > 1000) {
        console.log('height resized!');
        // img.resize(0, 1000);
      }
      w = img.width;
      h = img.height;
      resizeCanvas(w, h);
      image(img, 0, 0);
    });
    redraw();
  } else {
    // img = null;
  }
}

function undodiffusion() {
  if (dry.length > 0) {
    undobutton.removeClass('inactive');
    undobutton.class('active');
    loadPixels();
    for (let i = 0; i < pixels.length; i++) {
      pixels[i] = dry[i];
    }
  }
}

function flowField(arr, channels) {
  console.log(step);
  // const step = .015;
  for (let s = 0; s < channels; s++) {
    seeds[s] = random(millis()) * random(1000);
    noiseSeed(seeds[s]);
    let yoff = 0;
    for (let i = 0; i < h; i++) {
      let xoff = 0;
      for (let j = 0; j < w; j++) {
        let noiseval = noise(xoff, yoff);
        let noisecolor = map(noiseval, 0, 1, 0, 255);
        let noiseangle = noiseval * TWO_PI;
        let noisedist = map(noiseval, 0, 1, 0, turb);
        let noisevec = p5.Vector.fromAngle(noiseangle);
        noisevec.mult(noisedist);
        arr[s][j + w * i] = noisevec;

        kernels[s][j + w * i] = floor(noiseval * blur);
        // stroke(255, 255, 255, 10);
        // push();
        // translate(i, j);
        // rotate(noisevec.hea  ding());
        // line(0, 0, noisevec.mag(), 0);
        // pop();

        xoff += step;
      }
      yoff += step;
    }
  }
}

function diffuse() {
  flowField(field, 3);
  loadPixels();
  for (let p = 0; p < w * h; p++) {
    // console.log('hi');
    order[p] = p;
    dry[p * 4] = pixels[p * 4];
    dry[p * 4 + 1] = pixels[p * 4 + 1];
    dry[p * 4 + 2] = pixels[p * 4 + 2];
    dry[p * 4 + 3] = pixels[p * 4 + 3];
  }
  shuffle(order, true);
  // for (let pixel of pixels) {
  //   dry.push(pixel);
  // }

  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      // let current = i + w * j;
      let current = order[i + w * j];
      let x = current % w;
      let y = floor(current / w);
      let rx = round(x + field[0][current].x) % w;
      let ry = round(y + field[0][current].y) % h;
      let gx = round(x + field[1][current].x) % w;
      let gy = round(y + field[1][current].y) % h;
      let bx = round(x + field[2][current].x) % w;
      let by = round(y + field[2][current].y) % h;

      // pixels[result * 4] = dry[current * 4];
      // pixels[result * 4 + 1] = dry[current * 4 + 1];
      // pixels[result * 4 + 2] = dry[current * 4 + 2];

      pixels[current * 4] -= dry[current * 4];
      pixels[current * 4 + 1] -= dry[current * 4 + 1];
      pixels[current * 4 + 2] -= dry[current * 4 + 2];

      kernel(pixels, current, rx, ry, kernels[0][current], 0);
      kernel(pixels, current, gx, gy, kernels[1][current], 1);
      kernel(pixels, current, bx, by, kernels[2][current], 2);
    }
  }
  console.log("done!");
  updatePixels();
}

function kernel(arr, current, x, y, ksize, channel) {
  const kw = ksize * 2 + 1;

  for (let i = 0; i < kw; i ++) {
    for (let j = 0; j < kw; j++) {
      let kx = x + i - ksize;
      let ky = y + j - ksize;
      let result = kx + w * ky;

      arr[result * 4 + channel] = dry[current * 4 + channel];
      // arr[result * 4 + channel] += dry[current * 4 + channel] / (ksize * ksize);

      // arr[result * 4 + channel] = (arr[result * 4 + channel] + dry[current * 4 + channel] / (ksize * ksize)) % 255;
      // arr[result * 4 + 1] = arr[result * 4 + 1] + dry[current * 4 + 1] / (ksize * ksize) % 255
      // arr[result * 4 + 2] = arr[result * 4 + 2] + dry[current * 4 + 2] / (ksize * ksize) % 255
    }
  }
}
