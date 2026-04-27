---
title: Void Voyager
author: Miah Tayen (tayenm@myumanitoba.ca)
date: Winter 2026
---

# Overview
Void Voyager is an implementation of Cookie Clicker (in both gameplay and alliteration) for COMP 2452 in Winter 2026. You are the captain of an experimental spacecraft sitting on the launchpad. Your goal is to travel as far from Earth as possible (Physics may not apply). With the new Phase 3 updates, get ready for an explosion of brand new upgrades. 

### Gameplay Loop
* Engage Thrusters: Every interaction (click) propels your ship forward, increasing your Distance Traveled (measured in Light Years).
* The Shipyard: As you travel further, you use your accumulated distance to purchase better components from the database inventory.
* Propulsion Upgrades: Installing better active engines increases your Thrust Power (Light Years gained per click), allowing you to reach deep space faster.
* Autopilot Systems: You can now install passive systems (like AI Captains and NavComputers) that automatically increase your distance traveled every second.
* Pilot Roster (Accounts): You can create an account, log in, and switch between different captains.

# Running
1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the development server:
    ```bash
    npx vite
    ```

# Testing
1.  Run the standard test suite:
    ```bash
    npx vitest
    ```

2.  Run the test suite and generate a coverage report:
    ```bash
    npx vitest run --coverage
    ```

# Domain model and flow diagrams
* You can find my domain model in `domain.md`.
* You can find my flow diagrams in `flows.md`.
* You can find my ui assessment in `ui-assessment.md`.
