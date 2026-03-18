import { expect, test, beforeEach } from 'vitest';
import Propulsion from '../src/model/propulsion';
import db from '../src/model/connection';
import ddl from '../create-table.sql?raw';

beforeEach(async () => {
    await db().exec(`
        TRUNCATE TABLE ship, propulsion, autopilot CASCADE;
    `);
    await db().exec(ddl);
});

test("getPropulsionInventory returns all propulsions from inventory", async () => {
    const inventory = await Propulsion.getPropulsionInventory();
    expect(inventory.length).toBeGreaterThan(0);
    expect(inventory.find(p => p.name === 'Jump Drive')).toBeDefined();
    expect(inventory.find(p => p.name === 'Hyperdrive')).toBeDefined();
});

test("getPropulsion returns a specific propulsion", async () => {
    const p = await Propulsion.getPropulsion('Jump Drive');
    expect(p).not.toBeNull();
    expect(p?.boost).equals(10);
});

test("getPropulsion returns null for non-existent propulsion", async () => {
    const p = await Propulsion.getPropulsion('NonExistent');
    expect(p).toBeNull();
});

test("save inserts a propulsion and gets an id", async () => {
    await db().query('INSERT INTO ship(pilot_name, password, distance_traveled) VALUES ($1, $2, $3)', ["TestPilot", "password", 0]);
    const p = new Propulsion("Custom Drive", 20, 200);
    await Propulsion.save(p, "TestPilot");
    
    expect(p.id).toBeDefined();
    expect(typeof p.id).equals('number');
});

test("installedPropulsions returns saved propulsions for a ship", async () => {
    await db().query('INSERT INTO ship(pilot_name, password, distance_traveled) VALUES ($1, $2, $3)', ["TestPilot", "password", 0]);
    const p1 = new Propulsion("Drive1", 10, 100);
    const p2 = new Propulsion("Drive2", 20, 200);
    
    await Propulsion.save(p1, "TestPilot");
    await Propulsion.save(p2, "TestPilot");
    
    const installed = await Propulsion.installedPropulsions("TestPilot");
    expect(installed.length).equals(2);
    expect(installed.map(d => d.name)).contains("Drive1");
    expect(installed.map(d => d.name)).contains("Drive2");
});
