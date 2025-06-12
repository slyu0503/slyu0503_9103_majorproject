
let doveImg;
let strokes = [];     // Array to store brush strokes
let paintingLayer;    // Graphics layer for user painting
let peaceLayer;       // Graphics layer for "PEACE" text
let isPainting = false; // Flag to track painting state
let bgColor = "black"; // Background color

function preload() {
  doveImg = loadImage("assets/dovefinal.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  setupPaintingLayer()
  setupPeaceLayer();
  setupDoveImage();
}

function setupPaintingLayer() {
  paintingLayer = createGraphics(width, height);
  paintingLayer.pixelDensity(1);
  paintingLayer.background(0, 0, 0, 0);
  paintingLayer.noStroke();
}

function setupPeaceLayer() {
  peaceLayer = createGraphics(width, height);
  peaceLayer.push();
  peaceLayer.textFont("Courier New");
  peaceLayer.textSize(200);
  peaceLayer.textAlign(CENTER, CENTER);
  peaceLayer.fill(20, 20, 20, 80);
  peaceLayer.text("PEACE", width/2, height/2);
  peaceLayer.pop();
}

function setupDoveImage() {
  doveImg.resize(1000, 0);
  doveImg.loadPixels();

  // Center image
  let xOffset = (width - doveImg.width) / 2;
  let yOffset = (height - doveImg.height) / 2;

  // Create brush strokes in 3 layers
  for (let layer = 0; layer < 3; layer++) {
    createBrushStrokesForLayer(layer, xOffset, yOffset);
  }
}

// Create brush strokes for a specific layer
function createBrushStrokesForLayer(layer, xOffset, yOffset) {
  // PPixels with 4px spacing
  for (let y = 0; y < doveImg.height; y += 4) {
    for (let x = 0; x < doveImg.width; x += 4) {
      let index = (x + y * doveImg.width) * 4;
      let r = doveImg.pixels[index];
      let g = doveImg.pixels[index + 1];
      let b = doveImg.pixels[index + 2];
      let brightness = (r + g + b) / 3;

      // Create brush stroke for bright pixels with 70% probability
      if (brightness > 50 && random() > 0.7) {
        strokes.push(new BrushStroke(
          x + xOffset + random(-2, 2),
          y + yOffset + random(-2, 2),
          color(r, g, b), 
          layer
        ));
      }
    }
  }
}


function draw() {
  background(bgColor);

  // Render layers
  image(paintingLayer, 0, 0);
  image(peaceLayer, 0, 0);
  
  updateAndDisplayStrokes(); // Update and render all brush strokes
  displayInfoText();         // Show info text
}


function updateAndDisplayStrokes() {
  let t = millis() * 0.001;
  for (let stroke of strokes) {
    stroke.update(t);
    stroke.display();
  }
}


function displayInfoText() {
  fill("white");
  textSize(14);
  text("R - retry; S - save; Q - change background", 20, height - 20);
}

// Mouse interaction handlers
function mousePressed() {
  isPainting = true;
  addPaintMark();
}

function mouseDragged() {
  addPaintMark();
}

function mouseReleased() {
  isPainting = false;
}

// Add paint mark at mouse position
function addPaintMark() {
  // Generate cyberpunk color
  const cyberpunkColors = [
    color(255, 0, 128, 150),    // Hot pink
    color(0, 255, 255, 150),    // Cyan
    color(255, 0, 255, 150),    // Magenta
    color(0, 255, 128, 150),    // Neon green
    color(255, 128, 0, 150),    // Orange
    color(128, 0, 255, 150)     // Purple
  ];
  
  // Cyberpunk characters
  const chars = ['0', '1', '*', '#', '@', '&', '>', '<', '|', '/'];
  
  // Randomly select a color
  let paintColor = random(cyberpunkColors);
  
  // Add dynamic variations
  for (let i = 0; i < 8; i++) {
    let offsetX = random(-15, 15);
    let offsetY = random(-15, 15);
    let size = random(8, 12);
    let angle = random(-PI/4, PI/4);
    let char = random(chars);
    
    // Create character mark
    paintingLayer.push();
    paintingLayer.translate(mouseX + offsetX, mouseY + offsetY);
    paintingLayer.rotate(angle);
    
    // Main character
    paintingLayer.fill(paintColor);
    paintingLayer.textSize(size);
    paintingLayer.textAlign(CENTER, CENTER);
    paintingLayer.text(char, 0, 0);
    
    // Add subtle glow
    let glowColor = color(
      red(paintColor),
      green(paintColor),
      blue(paintColor),
      30
    );
    paintingLayer.fill(glowColor);
    paintingLayer.textSize(size * 1.5);
    paintingLayer.text(char, 0, 0);
    
    paintingLayer.pop();
  }
}

// BrushStroke class representing individual paint strokes
class BrushStroke {
  constructor(x, y, col, layer) {
    this.origin = createVector(x, y);     // Original position
    this.pos = createVector(x, y);        // Current position
    this.color = col;                     // Stroke color
    this.originalColor = col;             // Store original color
    this.layer = layer;                   // Layer depth
    this.seed = random(1000);             // Random seed for unique behavior
    this.length = random(3, 10 + layer * 2); // Stroke length
    this.width = random(3, 8 + layer);    // Stroke width
    this.angle = random(PI);              // Initial rotation
    this.alpha = random(150, 220);        // Transparency
    this.targetPos = createVector(x, y);  // Target position for recovery
    this.recoverySpeed = random(0.02, 0.05); // Speed to return to origin
    this.isAffected = false;              // Mouse interaction flag
    this.isExploding = false;             // New flag for explosion state
    this.velocity = createVector(0, 0);   // New velocity vector
    this.cyberpunkColor = null;           // New cyberpunk color
  }

  generateCyberpunkColor() {
    const colors = [
      color(255, 0, 128),    // Hot pink
      color(0, 255, 255),    // Cyan
      color(255, 0, 255),    // Magenta
      color(0, 255, 128),    // Neon green
      color(255, 128, 0),    // Orange
      color(128, 0, 255)     // Purple
    ];
    return random(colors);
  }

    update(time) {
    let mouseDist = dist(mouseX, mouseY, this.origin.x, this.origin.y);
    let influenceRadius = 25; // Mouse influence radius restored to 25

    if (mouseDist < influenceRadius) {
      // Mouse influence behavior
      this.isAffected = true;
      let toMouse = createVector(mouseX - this.origin.x, mouseY - this.origin.y);
      let rotateAngle = map(mouseDist, 0, influenceRadius, PI, 0.1);
      
      // Circular motion around mouse
      this.pos.x = mouseX + cos(time * 3 + this.seed) * toMouse.mag();
      this.pos.y = mouseY + sin(time * 3 + this.seed) * toMouse.mag();
      this.angle = atan2(mouseY - this.pos.y, mouseX - this.pos.x) + PI/2;

      // If mouse is pressed, trigger explosion
      if (mouseIsPressed && !this.isExploding) {
        this.isExploding = true;
        this.cyberpunkColor = this.generateCyberpunkColor();
        
        // Calculate tangential velocity with reduced speed
        let tangent = createVector(-toMouse.y, toMouse.x).normalize();
        this.velocity = tangent.mult(random(3, 8)); // Reduced from random(5, 15)
      }
    }

    // Handle explosion state
    if (this.isExploding) {
      this.pos.add(this.velocity);
      this.velocity.mult(0.95); // Add drag

      // Start recovery when velocity is small enough
      if (this.velocity.mag() < 0.1) {
        this.pos.lerp(this.targetPos, this.recoverySpeed);
        
        if (p5.Vector.dist(this.pos, this.targetPos) < 1) {
          this.isExploding = false;
          this.isAffected = false;
          this.cyberpunkColor = null;
        }
      }
    } else if (this.isAffected) {
      // Return to original position
      this.pos.lerp(this.targetPos, this.recoverySpeed);
      
      if (p5.Vector.dist(this.pos, this.targetPos) < 1) {
        this.isAffected = false;
      }
      
      // Smooth angle transition
      this.angle = lerp(this.angle, noise(time*0.3 + this.seed)*TWO_PI, 0.05);
    }
  }
  
  display() {

    noStroke();

    if (this.isExploding && this.cyberpunkColor) {
      // Use cyberpunk color during explosion
      fill(this.cyberpunkColor);
    } else {
      fill(255, 255, 255, this.alpha);
    }
    
    push();
    translate(this.pos.x, this.pos.y);
    ellipse(0, 0, this.length, this.width); // Draw elliptical stroke
    pop();
  }
}


function keyPressed() {
  if (key === 'r' || key === 'R') {
    clearPaintingLayer();
    bgColor = "black";
  }

  if (key === 's' || key === 'S') {
    saveCanvas('peace_artwork', 'png'); // Save canvas as PNG
    return false;
  }

  if (key === 'q' || key === 'Q') {
    // Generate random cyberpunk-style background color
    const colors = [
      color(20, 20, 40),    // Dark blue
      color(40, 20, 40),    // Dark purple
      color(20, 40, 40),    // Dark cyan
      color(40, 20, 20),    // Dark red
      color(20, 40, 20),    // Dark green
      color(30, 30, 30)     // Dark gray
    ];
    bgColor = random(colors);
  }
}

function clearPaintingLayer() {
  paintingLayer.clear();
  paintingLayer.background(0, 0, 0, 0);
}