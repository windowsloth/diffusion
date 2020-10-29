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
  createCanvas(w * 2, h);
  background(220);
  image(img, 0, 0);
}

function draw() {
  flowField(field);
  diffuseImage(img, field);
}

function flowField(arr) {
  let yoff = 0;
  for (let y = 0; y < h; y++) {
    let xoff = 0;
    for (let x = 0; x < w; x++) {
      let a = noise(xoff, yoff) * TWO_PI;
      let vec = p5.Vector.fromAngle(a);
      vec.mult(10);
      arr.push(vec);
      xoff += turb;
    }
    yoff += turb;
  }
}

function diffuseImage(source, arr) {
  let imgw = source.width;
  let imgh = source.height;
  let dry = [];
  source.loadPixels();
  for (let item of source.pixels) {
    dry.push(item);
  }
  for (let j = 0; j < imgh; j++) {
    for (let i = 0; i < imgw; i++) {
      let pos = (j * imgw + i) * 4;
      let mod = arr[j * imgw + i];
      let newpos = ((round(j + mod.y)) * imgw + round((i + mod.x))) * 4;
      if (round(i + mod.x > 0) && round(j + mod.y) > 0) {
        source.pixels[pos    ] = dry[newpos    ];
        source.pixels[pos + 1] = dry[newpos + 1];
        source.pixels[pos + 2] = dry[newpos + 2];

        source.pixels[newpos    ] = dry[pos    ];
        source.pixels[newpos + 1] = dry[pos + 1];
        source.pixels[newpos + 2] = dry[pos + 2];
      } else {
        source.pixels[pos] = 255;
        source.pixels[pos + 1] = 255;
        source.pixels[pos + 2] = 255;
        source.pixels[newpos] = 255;
        source.pixels[newpos + 1] = 255;
        source.pixels[newpos + 2] = 255;
      }
    }
  }
  source.updatePixels();
  image(source, imgw, 0);
}
