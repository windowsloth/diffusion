let w;
let h;

const turb = 0.05;

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
  // noiseSeed(13);
  pixelDensity(1);
  w = img.width;
  h = img.height;
  createCanvas(w * 2, h);
  background(220);
  image(img, 0, 0);
}

function draw() {
  // flowField(field);
  diffuseImage(img);
}

function flowField() {
  noiseSeed(random(255));
  const arr = [];
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
  return arr;
}

function diffuseImage(source) {
  let rfield = flowField();
  let gfield = flowField();
  let bfield = flowField();
  let imgw = source.width;
  let imgh = source.height;
  let dry = [];
  source.loadPixels();
  // for (let item of source.pixels) {
  //   dry.push(item);
  // }
  for (let l=0; l < source.pixels.length; l++) {
    dry.push(source.pixels[l]);
    source.pixels[l] = 0;
  }
  console.log(dry);
  for (let j = 0; j < imgh; j++) {
    for (let i = 0; i < imgw; i++) {
      let pos = (j * imgw + i) * 4;
      let rmod = rfield[j * imgw + i];
      let bmod = gfield[j * imgw + i];
      let gmod = gfield[j * imgw + i];
      let rpos = ((round(j + rmod.y)) * imgw + round((i + rmod.x)));
      let gpos = ((round(j + gmod.y)) * imgw + round((i + gmod.x)));
      let bpos = ((round(j + bmod.y)) * imgw + round((i + bmod.x)));
      if (
          round(i + rmod.x > 0) && round(j + rmod.y) > 0 &&
          round(i + gmod.x > 0) && round(j + gmod.y) > 0 &&
          round(i + bmod.x > 0) && round(j + bmod.y) > 0
        ) {
        source.pixels[pos    ] += dry[rpos    ];
        source.pixels[pos + 1] += dry[gpos];
        source.pixels[pos + 2] += dry[bpos];
        source.pixels[pos + 3] = 255;

        source.pixels[rpos    ] += dry[pos    ];
        source.pixels[gpos] += dry[pos + 1];
        source.pixels[bpos] += dry[pos + 2];
        source.pixels[rpos + 3] = 255;
      } else {
        source.pixels[pos] = 255;
        source.pixels[pos + 1] = 255;
        source.pixels[pos + 2] = 255;
        source.pixels[rpos] = 255;
        source.pixels[gpos + 1] = 255;
        source.pixels[bpos + 2] = 255;
      }
    }
  }
  source.updatePixels();
  image(source, imgw, 0);
}
