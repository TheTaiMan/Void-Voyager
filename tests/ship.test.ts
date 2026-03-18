import { expect, test, beforeEach } from 'vitest';

import Ship from "../src/model/ship"
import Propulsion from "../src/model/propulsion"
import Autopilot from "../src/model/autopilot"
import db from "../src/model/connection"
import ddl from '../create-table.sql?raw';

beforeEach(async () => {
    await db().exec(`
        TRUNCATE TABLE ship, propulsion, autopilot CASCADE;
    `);
    await db().exec(ddl);
});

// Wait a short time after tests to allow background Promise saves from Ship to finish
// so they don't crash when the database is truncated in the next test
import { afterEach } from 'vitest';
afterEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 50));
});

test("Ship initializes with correct default values", () => {
    const ship = new Ship("TestPilot", 0, [], [])

    expect(ship.pilotName).equals("TestPilot")
    expect(ship.distanceTraveled).equals(0)
    expect(ship.thrustPower).equals(1)
    expect(ship.thrustsPerSecond).equals(0)
    expect(ship.installUpgrades.length).equals(0)
})

test("Does distance increase with click", async () => {
    await db().query('INSERT INTO ship(pilot_name, password, distance_traveled) VALUES ($1, $2, $3)', ["TestPilot", "password", 0]);
    const ship = new Ship("TestPilot", 0, [], [])
    const currDistance = ship.distanceTraveled
    const thrust = ship.thrustPower

    ship.engageThrusters()

    expect(ship.distanceTraveled).equals(currDistance + thrust)
})

test("Does engaging thrusters on Ship notify listeners", async () => {
    await db().query('INSERT INTO ship(pilot_name, password, distance_traveled) VALUES ($1, $2, $3)', ["TestPilot", "password", 0]);
    const ship = new Ship("TestPilot", 0, [], [])

    let notified = false;
    ship.registerListener({notify: () => notified = true})

    ship.engageThrusters()

    expect(notified).equals(true)
})

test("Can install upgrades", async () => {
    await db().query('INSERT INTO ship(pilot_name, password, distance_traveled) VALUES ($1, $2, $3)', ["TestPilot", "password", 0]);
    const ship = new Ship("TestPilot", 1000, [], [])
    const upgrade = new Propulsion("Hyperdrive", 50, 500)
    const initialPower = ship.thrustPower

    ship.installUpgrade(upgrade)

    expect(ship.installUpgrades).contains(upgrade)
    expect(ship.thrustPower).equals(initialPower + upgrade.boost)
})

test("Does installing upgrades notify listeners", async () => {
    await db().query('INSERT INTO ship(pilot_name, password, distance_traveled) VALUES ($1, $2, $3)', ["TestPilot", "password", 0]);
    const ship = new Ship("TestPilot", 1000, [], [])
    const upgrade = new Propulsion("Hyperdrive", 50, 500)

    let notified = false;
    ship.registerListener({notify: () => notified = true})

    ship.installUpgrade(upgrade)

    expect(notified).equals(true)
})

test("Do upgrades stack correctly", async () => {
    await db().query('INSERT INTO ship(pilot_name, password, distance_traveled) VALUES ($1, $2, $3)', ["TestPilot", "password", 0]);
    const ship = new Ship("TestPilot", 2000, [], [])
    const hDrive = new Propulsion("Hyperdrive", 50, 500) // Boost 50
    const jDrive = new Propulsion("Jump Drive", 10, 50)  // Boost 10

    ship.installUpgrade(hDrive)
    ship.installUpgrade(jDrive)

    // Base (1) + 50 + 10 = 61
    expect(ship.thrustPower).equals(61) 
})

test("Can install autopilots and propulsion together", async () => {
    await db().query('INSERT INTO ship(pilot_name, password, distance_traveled) VALUES ($1, $2, $3)', ["TestPilot", "password", 0]);
    const ship = new Ship("TestPilot", 5000, [], [])
    
    const hDrive = new Propulsion("Hyperdrive", 50, 500)
    const aiPilot = new Autopilot("AI Captain", 25, 1000)

    ship.installUpgrade(hDrive)
    ship.installAutopilot(aiPilot)

    expect(ship.installUpgrades).contains(hDrive)
    expect(ship.activeAutopilots).contains(aiPilot)
    expect(ship.thrustPower).equals(51) // 1 + 50
    expect(ship.thrustsPerSecond).equals(25)
    
    // Testing apply passive thrust
    const currDistance = ship.distanceTraveled
    ship.applyPassiveThrust()
    expect(ship.distanceTraveled).equals(currDistance + (51 * 25))
})
