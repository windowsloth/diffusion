let w;
let h;

const turb = 60;
const blur = 15;
const passes = 0;

const dry = [];
const order = [];
const field = [[], [], []];
const kernels = [[], [], []];
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
  img = loadImage('./kings.jpg');
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

function flowField(arr, channels) {
  const step = .015;
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
        arr[s].push(noisevec);

        kernels[s].push(floor(noiseval * blur));
        // stroke(255, 255, 255, 10);
        // push();
        // translate(i, j);
        // rotate(noisevec.heading());
        // line(0, 0, noisevec.mag(), 0);
        // pop();

        xoff += step;
      }
      yoff += step;
    }
  }
}

function diffuse() {
  loadPixels();
  for (let p = 0; p < w * h; p++) {
    // console.log('hi');
    order.push(p);
    dry.push(pixels[p * 4]);
    dry.push(pixels[p * 4 + 1]);
    dry.push(pixels[p * 4 + 2]);
    dry.push(pixels[p * 4 + 3]);
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
