let doveImg;          // Our group chosen dove image.
let strokes = [];     // Keep all the tiny brush strokes that make up our dove.
let paintingLayer;    // A drawing area where users can paint.
let peaceLayer;       // Another drawing layer just for the "DREAM OF DOVE" text.
let isPainting = false; // Helps us to know if mouse button is pressed down for painting.
let bgColor = "grey"; // Sets the starting background color be grey.

function preload() {
  // Load the dove image. Make sure 'assets/dove.png' is in the right place
  doveImg = loadImage("assets/dove.png");
}

function setup() {
  // This function runs once when the program starts.
  createCanvas(windowWidth, windowHeight); // We make our drawing area as big as users' browser window.
  pixelDensity(1); // WHich makes sure our pixels are drawn one-to-one, for the clear graphics.

  setupPaintingLayer();
  setupPeaceLayer();
  // Make the dove image into lots of little dots strokes.
  setupDoveImage();
}

function setupPaintingLayer() {
  // Create that drawing area for user painting.
  paintingLayer = createGraphics(width, height); // A transparent sheet of paper.
  paintingLayer.pixelDensity(1);                 // Make all single pixels for clarity.
  paintingLayer.background(0, 0, 0, 0);          // Completely transparent.
  paintingLayer.noStroke();                      // No outlines for users' paint marks.
}

function setupPeaceLayer() {
  // Set up the texts
  peaceLayer = createGraphics(width, height); // The transparent sheet.
  peaceLayer.push();                          // We're about to change some drawing styles, so we save the old ones.
  peaceLayer.textFont("Courier New");      
  peaceLayer.textSize(200);                
  peaceLayer.textAlign(CENTER, CENTER);       // Center the text.
  peaceLayer.fill(20, 20, 20, 80);            // Dark, slightly see-through color.
  peaceLayer.text("DREAM OF DOVE", width / 2, height / 2);
  peaceLayer.pop();                           // Bring back any old drawing styles we saved.
}

function setupDoveImage() {
  // This function takes our dove image and prepares it.
  doveImg.resize(1000, 0); // The dove image 1000 pixels wide, and p5.js figures out the height.
  doveImg.loadPixels();    // This lets us look at each tiny pixel of the dove image.

  // Center image
  let xOffset = (width - doveImg.width) / 2;
  let yOffset = (height - doveImg.height) / 2;

  // Create brush strokes in 3 layers
  for (let layer = 0; layer < 3; layer++) {
    createBrushStrokesForLayer(layer, xOffset, yOffset);
  }
}

function createBrushStrokesForLayer(layer, xOffset, yOffset) {
  // This function goes through the dove image and turns parts of it into brush strokes.
  // We're skipping some pixels (y+=4, x+=4) so it looks a bit scattered, not solid.
  for (let y = 0; y < doveImg.height; y += 4) {
    for (let x = 0; x < doveImg.width; x += 4) {
      // This is a bit technical, but it helps us find the color of each pixel.
      let index = (x + y * doveImg.width) * 4;
      let r = doveImg.pixels[index];     // Red color
      let g = doveImg.pixels[index + 1]; // Green color
      let b = doveImg.pixels[index + 2]; // Blue color
      let brightness = (r + g + b) / 3;  // How bright is this pixel

     // Create brush stroke for bright pixels with 70% probability
      if (brightness > 50 && random() > 0.7) {
        strokes.push(new BrushStroke(
          x + xOffset + random(-2, 2),    // Position it, with a tiny wobble.
          y + yOffset + random(-2, 2),    // Same for the y position.
          color(r, g, b),                 // Use the original color of the pixel.
          layer                           // Remember which layer this stroke belongs to.
        ));
      }
    }
  }
}

function draw() {
  // This function runs over and over, drawing everything on the screen.
  background(bgColor);      // Fill the background with our chosen color.
  image(paintingLayer, 0, 0); // Show whatever user painted.
  image(peaceLayer, 0, 0);    // Show the text.
  updateAndDisplayStrokes(); // Make our dove strokes move and then draw them.
  displayInfoText();        // Show instructions at the bottom for user.
}

function updateAndDisplayStrokes() {
  let t = millis() * 0.001; // Get the current time (in seconds).
  for (let stroke of strokes) { 
    stroke.update(t);  // Tell the stroke to update its position or color.
    stroke.display();  // Tell the stroke to draw itself.
  }
}

function displayInfoText() {
  fill("white");   
  textSize(14);      // Set the text size.
  text("R - retry; S - save; Q - change background", 20, height - 20);
}

function mousePressed() {
  isPainting = true;
  addPaintMark();    // Add a little splash of paint right away.
}

function mouseDragged() {
  addPaintMark(); // Keep adding paint as drag mouse around.
}

function mouseReleased() {
  isPainting = false; // Mouse is up, so no more painting for now.
}

function addPaintMark() {
  // Because of the inspration by cyberpunk, "cyberpunk" colors we can use for painting.
  const cyberpunkColors = [
    color(255, 0, 128, 150), // Pink
    color(0, 255, 255, 150), // Cyan
    color(255, 0, 255, 150), // Magenta
    color(0, 255, 128, 150), // Green-Cyan
    color(255, 128, 0, 150), // Orange
    color(128, 0, 255, 150)  // Purple
  ];

  // Use interesting characters to make our paint marks look cool and neo.
  const chars = ['0', '1', '*', '#', '@', '&', '>', '<', '|', '/'];
  let paintColor = random(cyberpunkColors); // Pick a random cyberpunk color for this set of marks.

  // For each mouse event, we'll draw several small marks.
  for (let i = 0; i < 8; i++) {
    let offsetX = random(-15, 15);  // Give it a small random wiggle horizontally.
    let offsetY = random(-15, 15);  // And vertically.
    let size = random(8, 12);       // Random size for the character.
    let angle = random(-PI / 4, PI / 4); // Random rotation, just a little bit.
    let char = random(chars);       // Pick a random character.

    paintingLayer.push();                         // Save our current drawing settings.
    paintingLayer.translate(mouseX + offsetX, mouseY + offsetY); // Move to where we want to draw this mark.
    paintingLayer.rotate(angle);                  // Spin it a bit.

    paintingLayer.fill(paintColor);               // Set the color for the character.
    paintingLayer.textSize(size);                 // Set its size.
    paintingLayer.textAlign(CENTER, CENTER);      // Make sure it rotates nicely around its center.
    paintingLayer.text(char, 0, 0);               // Draw the character!

    let glowColor = color(red(paintColor), green(paintColor), blue(paintColor), 30); // A very transparent version of our color.
    paintingLayer.fill(glowColor);                // Set the glow color.
    paintingLayer.textSize(size * 1.5);           // Make the glow character bigger.
    paintingLayer.text(char, 0, 0);               // Draw the glow!

    paintingLayer.pop();                          // Bring back our old drawing settings.
  }
}

// This is like a blueprint for each individual brush stroke that makes up the dove.
class BrushStroke {
  constructor(x, y, col, layer) {
    this.origin = createVector(x, y);      // This is where the stroke *wants* to be.
    this.pos = createVector(x, y);         // This is where the stroke *currently* is.
    this.color = col;                      // Its current color.
    this.originalColor = col;              // The color it started with from the dove image.
    this.layer = layer;                    // Which of the 3 dove layers it belongs to.
    this.seed = random(1000);              // A random number, just in case we want to use it for wobbly effects.
    this.length = random(3, 10 + layer * 2); // How long the stroke is, depends on its layer.
    this.width = random(3, 8 + layer);     // How wide, also depends on its layer.
    this.angle = random(PI);               // Starting angle (not used much right now).
    this.alpha = random(150, 220);         // How transparent it is.
    this.targetPos = createVector(x, y);   // The place it tries to return to (usually its origin).
    this.recoverySpeed = random(0.02, 0.05); // How fast it snaps back into place.
    this.isAffected = false;               // Is something messing with it? (Not really used yet).
    this.isExploding = false;              // Is it in a "cyberpunk explosion" state?
    this.velocity = createVector(0, 0);    // How fast it's moving when exploding.
    this.cyberpunkColor = null;            // This will hold a random cyberpunk color if it's exploding.
  }

  generateCyberpunkColor() {
    // Just a quick way to get one of those cool cyberpunk colors.
    const colors = [
      color(255, 0, 128),
      color(0, 255, 255),
      color(255, 0, 255),
      color(0, 255, 128),
      color(255, 128, 0),
      color(128, 0, 255)
    ];
    return random(colors);
  }

  update(time) {
    // This runs for each stroke every time the `draw` loop happens.
    // If you're pressing the mouse and this stroke isn't already flying away...
    if (mouseIsPressed && !this.isExploding) {
      // Let's see how close the mouse is to this stroke's original spot.
      let mouseDist = dist(mouseX, mouseY, this.origin.x, this.origin.y);
      // If it's super close (less than 25 pixels away)...
      if (mouseDist < 25) {
        this.isExploding = true; // BOOM! It's exploding!
        this.cyberpunkColor = this.generateCyberpunkColor(); // Give it a shiny new color.
        // This math makes it fly away from the mouse in a cool, swirly way.
        let toMouse = createVector(mouseX - this.origin.x, mouseY - this.origin.y);
        let tangent = createVector(-toMouse.y, toMouse.x).normalize();
        this.velocity = tangent.mult(random(3, 8)); // Give it a starting speed.
      }
    }

    // If it *is* exploding...
    if (this.isExploding) {
      this.pos.add(this.velocity); // Move it based on its speed.
      this.velocity.mult(0.95);    // Slow it down a bit each time, like friction.

      // If it's almost stopped moving...
      if (this.velocity.mag() < 0.1) {
        // Gently pull it back to its original spot. `lerp` is like smoothly easing it back.
        this.pos.lerp(this.targetPos, this.recoverySpeed);
        // If it's super close to its home spot, stop exploding.
        if (p5.Vector.dist(this.pos, this.targetPos) < 1) {
          this.isExploding = false;     // All calm now.
          this.isAffected = false;      // No longer being messed with.
          this.cyberpunkColor = null;   // No more special color.
        }
      }
    } else {
      // If it's not exploding, just gently pull it back to where it belongs.
      this.pos.lerp(this.targetPos, this.recoverySpeed);
    }
  }

  display() {
    noStroke(); // We don't want outlines for these strokes.
    // If it's exploding, use its cyberpunk color; otherwise, make it white and a bit transparent.
    if (this.isExploding && this.cyberpunkColor) {
      fill(this.cyberpunkColor);
    } else {
      fill(255, 255, 255, this.alpha);
    }
    push();                       // Save our drawing settings.
    translate(this.pos.x, this.pos.y); // Move to where this stroke currently is.
    ellipse(0, 0, this.length, this.width); // Draw it as a little oval.
    pop();                        // Bring back our old drawing settings.
  }
}

function keyPressed() {
  if (key === 'r' || key === 'R') {
    clearPaintingLayer(); // Clear all your paint marks.
    bgColor = "grey";    // Set the background back to grey.
  }
  if (key === 's' || key === 'S') {
    saveCanvas('dream of dove_artwork', 'png'); // Save your masterpiece as a PNG image!
    return false; // This stops the browser from doing its own 'save' thing.
  }
  if (key === 'q' || key === 'Q') {
    // Here are some cool dark colors for the background.
    const colors = [
      color(113,28,145),
      color(234,0,217),
      color(10,189,198),
      color(19,62,124),
      color(9,24,51)
    ];
    bgColor = random(colors); // Pick a random one for the background
  }
}

function clearPaintingLayer() {
  paintingLayer.clear();                // Erase everything on the painting layer.
  paintingLayer.background(0, 0, 0, 0);
}