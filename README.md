# Dove in the Dream —— Meditation

### User Input
### Group D

| Name              | Unikey     |  
|-------------------|------------|  
| Su Lyu            | slyu0503   |


## Overview

This project is an individual extension of the group-coded dove dot-matrix. It transforms a static pixel image into an interactive drawing and visual experience. The work is inspired by cyberpunk aesthetics and graffiti art，designed to explore user interaction as a primary driver of animation.

## How to Interact

- **Click** the dove dot matrix explosion
- **Drag** the mouse to draw cyberpunk-style drawing
- **Press `R`** to reset the page
- **Press `S`** to save PNG image
- **Press `Q`** to switch cyberpunk-style dark background colors

## My Individual Animation Approach

While the original group code visualized a dove with elastic particle dots, my version expands it by:
- **Adding stylized drawing interactions** using p5.js `createGraphics()`. Used dual transparent `createGraphics()` layers to separate user-generated content from static elements
- Replacing basic grayscale visuals with **cyberpunk palettes** and stylized characters (`@`, `#`, `*`, `>`, etc.)  
- Centering the message “**DREAM OF DOVE**” using transparent `peaceLayer` typography  
- **Incorporating explosion physics** with damping and recovery for each particle
- Emphasizing **full user control** — the entire animation responds to input only

These changes result in a more **interactive, and aesthetic-focused experience**, highlighting the visual pleasure of user creation.


## Technical Explanation

- `BrushStroke` class handles particle position, explosion velocity, and recovery logic
- `addPaintMark()` uses `createGraphics()` to place shining character layers on a transparent canvas
- Color palettes use RGBA values for Cybeypunk effects
- `mousePressed` and `mouseDragged` are the triggers
- `keyPressed` supports utility shortcuts (`R`, `S`, `Q`) for interactivity
- `peaceLayer` is a static text layer rendered once with "DREAM OF DOVE" in a large transparent font to evoke dreamlike stillness beneath the interaction

## Inspiration

- **Cyberpunk art**

![Blade Runner 2049 screenshot](<assets/blade runner.jpg>)

*The cyberpunk aesthetic contents such as the glowing symbols, neon colors, and a surreal digital space where the dove floats in quiet motion, it's very close to the fuzzy, colourful look of the dream.*

- **Graffiti art**

![Graffiti art](assets/graffiti.jpg)

*The expressive nature of graffiti evokes a sense of meditation, where each stroke becomes part of a calming feeling. The user interact through free graffiti, the experience becomes playful, personal, and immersive，make user action into a meditative canvas.*

- **Inspiration Animation**  
  [http://xhslink.com/a/DHQSJR6V48Leb](http://xhslink.com/a/DHQSJR6V48Leb)

  
  *This animation was a reference that I found interesting and referenced while working on my creation, and was the first step in deciding how I would base my user interaction.*

## Tools & External Techniques  

- **p5.js** – Creative the coding framework for interaction and animation
- **Pixel Sampling & Brightness Filtering** – Only bright pixels (>50) are sampled to generate dot matrix  
- **Explosion Physics** – Vector-based explosion with tangent velocity, damping, and elastic return  
- **Cyberpunk Color Palette** – Referenced from [Color-Hex Palette #61235](https://www.color-hex.com/color-palette/61235) 


## Code Reference

- [https://p5js.org/](https://p5js.org/)
- Image: dove.png (group base)
- Cyberpunk Neon Color Palette [https://www.color-hex.com/color-palette/61235](https://www.color-hex.com/color-palette/61235)
- Inspiration animation [http://xhslink.com/a/DHQSJR6V48Leb](http://xhslink.com/a/DHQSJR6V48Leb)
- Developed with VS Code