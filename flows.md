---
title: Void Voyager
author: Miah Tayen (tayenm@myumanitoba.ca)
date: Winter 2026
---

# Flow of Interaction Diagrams
The following are the 2 tasks as instructed by phase 2 of the Clicker project.

### Change Log
- Added Task 3: Account creation and login flow with error paths.
- Added Task 4: Generalized shipyard purchase flow (see note below).

# Phase 1

### Task 1

```mermaid
flowchart
    subgraph TRAVEL
        start[[Cockpit View]]
        engagethrusters{Engage Thrusters}
        finish[[Cockpit View Updated]]
       
        %% Mouse Click
        start ==Engage==> engagethrusters
        engagethrusters -.Updated Distance.-> finish
    end
```
*Removed old Task 2 as Task 4 is the new generalized version*

# Phase 2

### Task 3 

```mermaid
flowchart TD

    subgraph HANGAR["HANGAR BAY"]
        start[[Hangar Bay in View]]
        choice[Log In or Create Account?]

        loginValidate{Verify Credentials}
        createValidate{Validate New Account}

        finish[[Cockpit in View]]

        start ==>choice
        choice == "Log In Button" ==> loginValidate
        choice == "Create Account Button" ==> createValidate

        loginValidate -. "Authenticated pilot" .-> finish
        loginValidate -. "Incorrect pilot name or password" .-> choice

        %% Create account outputs
        createValidate -. "New account created" .-> finish
        createValidate -. "Pilot name already taken" .-> choice
        createValidate -. "Empty password" .-> choice
    end
```

### Task 4

> [!note]
> Purchasing a propulsion upgrade (JumpDrive / Hyperdrive) and purchasing an autopilot (NavComputer / AI_Captain) follow identical logic from the user's perspective.

```mermaid
flowchart TD

    subgraph SHIPYARD
        start[[Shipyard in View]]
        checkFunds{Check Funds}
        finish[[Item Active]]
        start == "Item Button" ==> checkFunds
        checkFunds -. "Insufficient distance" .-> start
        checkFunds -. "Distance deducted, item installed" .-> finish
    end
```

