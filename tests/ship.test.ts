import { expect, test } from 'vitest';

import type PropulsionSystem from "../src/model/propulsionSystem"
import Ship from "../src/model/ship"
import Hyperdrive from "../src/model/hyperdrive"
import JumpDrive from "../src/model/jumpDrive"

test("Ship initializes with correct default values", () => {
    const ship = new Ship()

    expect(ship.distanceTraveled).equals(0)
    expect(ship.currentSpeed).equals(1)
    expect(ship.flightLog.length).equals(0)
})

test("Does distance increase with click", () => {
    const ship = new Ship()
    const currDistance = ship.distanceTraveled
    const currSpeed = ship.currentSpeed

    ship.engageThrusters()

    expect(ship.distanceTraveled).equals(currDistance + currSpeed)
})

test("Does engaging thrusters on Ship notify listeners", () => {
    const ship = new Ship()

    let notified = false;
    ship.registerListener({notify: () => notified = true})

    ship.engageThrusters()

    expect(notified).equals(true)
})

test("Can install upgrades", () => {
    const ship = new Ship()
    const upgrade: PropulsionSystem  = new Hyperdrive()
    const initialSpeed = ship.currentSpeed

    ship.installUpgrade(upgrade)

    expect(ship.flightLog).contains(upgrade)
    expect(ship.currentSpeed).equals(initialSpeed + upgrade.boost())
})

test("Does installing upgrades notify listeners", () => {
    const ship = new Ship()
    const upgrade: PropulsionSystem  = new Hyperdrive()

    let notified = false;
    ship.registerListener({notify: () => notified = true})

    ship.installUpgrade(upgrade)

    expect(notified).equals(true)
})

test("Do upgrades stack correctly", () => {
    const ship = new Ship()
    const hDrive = new Hyperdrive() // Boost 10
    const jDrive = new JumpDrive()  // Boost 20

    ship.installUpgrade(hDrive)
    ship.installUpgrade(jDrive)

    // Base (1) + 10 + 20 = 31
    expect(ship.currentSpeed).equals(31) 
})


