---
title: Void Voyager
author: Miah Tayen (tayenm@myumanitoba.ca)
date: Winter 2026
---

# Domain Model 

The following is my domain model for phase 2 of the Clicker project. 

### Change Log
#### Structural Changes (Inventory Support)
* Removed `PropulsionSystem` and `Autopilot` interfaces and their implementations (`JumpDrive`, `Hyperdrive`, `NavComputer`, `AI_Captain`)
* Replaced them with generic `Propulsion` and `Autopilot` classes for database driven configuration

#### Ship Class Updates
* Removed `password` property (use secure authentication instead)
* Replaced `currentSpeed` with `thrustPower`
* Added `thrustsPerSecond` for passive generation
* Updated invariants: `thrustPower > 0`, `thrustsPerSecond >= 0`
* Renamed `engageAutopilot` to `installAutopilot`
* Added `applyPassiveThrust` method

#### Propulsion and Autopilot Updates
* Renamed `passiveVelocity` to `passiveThrust`
* Renamed `ship` to `ship_id` (foreign key)

```mermaid
classDiagram
    %% Game State / Single Player Account
    class Ship {
        %% Account info
        %% pilotName is the natural key, no synthetic id needed
        -~string pilotName
        
        %% Game progress
        -number distanceTraveled
        -number thrustPower
        -number thrustsPerSecond
        
        %% Owned upgrades and autopilots
        -Array~Propulsion~ installedUpgrades
        -Array~Autopilot~ activeAutopilots
        
        %% Main actions
        +engageThrusters() void
        +applyPassiveThrust() void
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
        -Ship ship_id
    }

    note for Autopilot "Invariants:
    * passiveThrust > 0
    * cost > 0"

    Ship "1" o--* "*" Propulsion
    Ship "1" o--* "*" Autopilot
```

