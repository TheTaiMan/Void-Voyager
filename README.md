---
title: Void Voyager
author: Miah Tayen (tayenm@myumanitoba.ca)
date: Winter 2026
---

# Overview
Void Voyager is an implementation of Cookie Clicker (in both gameplay and alliteration) for COMP 2452 in Winter 2026. You are the captain of an experimental spacecraft sitting on the launchpad. Your goal is to travel as far from Earth as possible (Physics may not apply). 

### Gameplay Loop
* Engage Thrusters: Every interaction (click) propels your ship forward, increasing your Distance Traveled (measured in Light Years).
* The Shipyard: As you travel further, you gather flight data (your score) which allows you to install better propulsion systems.
* The Upgrade: Installing better engines increases your Speed (Light Years gained per click), allowing you to reach deep space faster.

# Running
1.  Install dependencies:
    ``bash
    npm install
    ```

2.  Start the development server:
    ```bash
    npx vite
    ```

# Domain model and flow diagrams
* You can find my domain model in `domain.md`.
* You can find my flow diagrams in `flows.md`.
