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

##### Propulsion (Click Upgrades)
- Added `cost()` and persisted `cost` field.
- Added `cost > 0` invariant.
- Added synthetic `id` to implementations.

##### Autopilot (Auto-Clickers)
- New `Autopilot` interface (`modelName`, `passiveThrust`, `cost`).
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
        -number thrustPower
        -number thrustsPerSecond
        
        %% Owned upgrades and autopilots
        -Array~Propulsion~ installedUpgrades
        -Array~Autopilot~ activeAutopilots
        
        %% Main actions
        +engageThrusters() void
        +installUpgrade(Propulsion p) void
        +installAutopilot(Autopilot a) void
    }

    note for Ship "Invariants:
    * distanceTraveled >= 0
    * thrustPower > 0
    * thrustsPerSecond >= 0"

    class Propulsion {
        -string name
        -number boost
        -number cost

        %% No natural key exists, so a synthetic id is required
        -~number id
        %% ship is a DB only
        -Ship ship_id
    }

    note for Propulsion "Invariants:
    * boost > 0
    * cost > 0"

    class Autopilot {
        -string name
        %% Clicks Per Second
        -number passiveThrust
        -number cost

        %% No natural key exists, so a synthetic id is required
        -~number id
        %% ship is a DB only
        -Ship ship_id
    }

    note for Autopilot "Invariants:
    * passiveThrust > 0
    * cost > 0"

    Ship "1" o--* "*" Propulsion
    Ship "1" o--* "*" Autopilot
```

