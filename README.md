# diffusion

## background

My day job involves working with what is esssentially a specialized inkjet printer. One of the features of this printer that sets it apart from most other large-format inkjet/pigment printers is that it allows the user to print on rigid materials that can be up to approximately 2" thick. Most printers do allow the platten gap (the distance between the carriage that carries the ink nozzles and the print media) to be adjusted, but the amount of adjustment that this particular printer allows for is significantly greater than your average machine.

One of the difficulties of working with taller materials is that if the platten gap/head distance is outside of a certain tolerance, the quality of the print quickly decreases. Even slight adjustments to the head distance can result in blurrier images, and if the distance is large enough the image will break down entirely. Instead of the ink almost immediately hitting the substrate, it is free to drift through the air, and the result is a chaotic rainbow pattern of ink droplets. In practice, I usually see these patterns show up as overspray on images that have been given a bleed (sized to be slightly larger than the actual print media to ensure edge-to-edge coverage), or when the material being used is not a uniform height (a piece with dramatic wrinkles or voids in its surface, for example). I personally think that the rainbow effect is really beautiful, it feels like a physicalization of a digital glitch in a way that's very appealing to me. It has the same frenetic, colorful look that something like a datamoshed video does, but also much softer and more organic.

Of course, the printer isn't really intended to be used with the print head suspended high above the media; it can dry out the nozzles or cause cross-contimation of the inks. Since I'm not interested in damaging the printer that I get paid to operate and maintain, I wanted to see if I could find a way to recreate the effect digitally.

## v1.3.1

This current version of the project uses Perlin noise to generate an array of vectors. This size of this array is determined by the number of pixels in the image being modified. Each pixel of the image is then re-positioned based on its corresponding vector, and the result is displayed.

Currently allows a user to select an image to modify. The turbulence (roughly equivalent to the printer's head distance), the blur size (the area the "ink" or color data winds up being spread across), and the noise level (Perlin noise detail) can all be set via sliders. The program can be run repeatedly, stacking the effect as many times as the user wants.

## to-do list

- [x] Shift pixels in image based on vector field
- [x] Shift individual color channels separately based on their own respective fields
- [ ] Use custom depth map to scale the amount pixels are shifted
- [x] Add controls to affect turbulence of vector fields/other parameters
- [ ] Build out GUI for customizing depth map/vector field's further
- [ ] Add multiple "passes" to possibly further mimic the action of an actual printer
- [ ] Port this all to something other than p5.js?
