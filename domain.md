---
title: Void Voyager
author: Miah Tayen (tayenm@myumanitoba.ca)
date: Winter 2026
---

# Domain Model 

The following is my domain model for phase 2 of the Clicker project. 

### Change Log
##### Global Architecture & Database Modeling
- Added uniqueness constraints (`-~`) for primary/natural keys.
- Added bidirectional relationships to reflect SQL tables and foreign keys.

##### Ship Class
- Added `pilotName` (unique) and `password` for authentication.
- Added `activeAutopilots` and `engageAutopilot()`.
- Removed simple getters to reduce clutter.

##### PropulsionSystem (Click Upgrades)
- Added `cost()` and persisted `cost` field.
- Added `cost > 0` invariant.
- Added synthetic `id` to implementations.

##### Autopilot (Auto-Clickers)
- New `Autopilot` interface (`modelName`, `passiveVelocity`, `cost`).
- Implementations: `NavComputer`, `AI_Captain`
- Added synthetic `id` and `Ship` reference for DB structure.

```mermaid
classDiagram
    %% Game State / Single Player Account
    class Ship {
        %% Account info
        %% pilotName is the natural key, no synthetic id needed
        -~string pilotName
        -string password
        
        %% Game progress
        -number distanceTraveled
        -number currentSpeed
        
        %% Owned upgrades and autopilots
        -Array~PropulsionSystem~ installedUpgrades
        -Array~Autopilot~ activeAutopilots
        
        %% Main actions
        +engageThrusters() void
        +installUpgrade(PropulsionSystem p) void
        +engageAutopilot(Autopilot a) void
    }

    note for Ship "Invariants:
    * distanceTraveled >= 0
    * currentSpeed > 0
    * pilotName is not empty
    * password is not empty"

    class PropulsionSystem {
        <<interface>>
        +modelName() string
        +boost() number
        +cost() number
    }

    note for PropulsionSystem "Invariants:
    * boost > 0
    * cost > 0"

    class JumpDrive {
        -string name
        -number boost
        -number cost

        %% ship is a DB only
        -Ship ship
        %% No natural key exists, so a synthetic id is required
        -~number id
    }

    note for JumpDrive "Invariants:
    * boost > 0
    * cost > 0"

    class Hyperdrive {
        -string name
        -number boost
        -number cost

        %% ship is a DB only
        -Ship ship
        %% No natural key exists, so a synthetic id is required
        -~number id
    }

    note for Hyperdrive "Invariants:
    * boost > 0
    * cost > 0"

    class Autopilot {
        <<interface>>
        +modelName() string
        %% Clicks Per Second
        +passiveVelocity() number
        +cost() number
    }

    note for Autopilot "Invariants:
    * passiveVelocity > 0
    * cost > 0"

    class NavComputer {
        -string name
        %% Clicks Per Second
        -number passiveVelocity 
        -number cost

        %% No natural key exists, so a synthetic id is required
        -~number id
        %% ship is a DB only
        -Ship ship
    }

    note for NavComputer "Invariants:
    * passiveVelocity > 0
    * cost > 0"

    class AI_Captain {
        -string name
        %% Clicks Per Second
        -number passiveVelocity
        -number cost

        %% ship is a DB only
        -~number id
        %% No natural key exists, so a synthetic id is required
        -Ship ship
    }


    note for AI_Captain "Invariants:
    * passiveVelocity > 0
    * cost > 0"

    Ship "1" o--* "*" PropulsionSystem
    Ship "1" o--* "*" Autopilot

    JumpDrive ..|> PropulsionSystem
    Hyperdrive ..|> PropulsionSystem

    NavComputer ..|> Autopilot
    AI_Captain ..|> Autopilot
```

