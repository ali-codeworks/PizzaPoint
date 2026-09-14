# PizzaPoint

A scroll-driven animated pizza website built with React, TypeScript, and GSAP ScrollTrigger. A 120-frame canvas sequence plays in sync with scroll position, creating a smooth cinematic effect without using a video file.

## Live Demo

[pizzapoint-client.vercel.app](https://pizzapoint-client.vercel.app)

## Tech Stack

- React + TypeScript
- GSAP (ScrollTrigger)
- Canvas API for frame rendering
- Vercel (deployment)

## How It Works

As the user scrolls, the page progress is mapped to a frame index (1–120), which is drawn onto an HTML canvas. Text sections fade in/out at specific scroll ranges, synced with the visual sequence via GSAP.

## Getting Started

\`\`\`bash
cd client
npm install
npm run dev
\`\`\`

## Folder Structure

\`\`\`
client/ # React app
frames/ # Sequence of JPG frames used for canvas animation
\`\`\`
