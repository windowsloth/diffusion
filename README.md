#diffusion

##background

Some flatbed inkjet printers allow printing on material up to several inches
tall, which allows the user to print on pretty unconventional surfaces.
However, the print head does need to remain within a certain distance from the
substrate, otherwise the ink starts to diffuse and the resulting image becomes
soft very quickly. The colors also become distorted as the dot pattern gets
disrupted, resulting in some really interesting rainbow patterns as the image
falls apart.

I'm experimenting with ways of simulating a similar effect. The goal is to take
an image and a "depth map" and generate a distorted version of the image, as if
a printer was printing the image onto a substrate with the same contours as the
depth map.

##v0.0.1

This first very rough first attempt uses Perlin noise to build an array of
vectors which then shift around the pixels of an image. The actual effect is not
really on display yet, I'm just building a ground work for subsequent versions
where the actual ink diffusion effect will be on display.

##to-do list

*Shift pixels in image based on vector field
*Shift individual color channels separately based on their own respective fields
*Use custom depth map to scale the amount pixels are shifted
*Add controls to affect turbulence of vector fields/other parameters
*Add multiple "passes" to possibly further mimic the action of an actual printer
*Port this all to something other than p5.js?
