import { expect, test, beforeEach } from 'vitest';
import Autopilot from '../src/model/autopilot';
import Ship from '../src/model/ship';
import db from '../src/model/connection';
import ddl from '../create-table.sql?raw';

beforeEach(async () => {
    await db().exec(`
        TRUNCATE TABLE ship, propulsion, autopilot CASCADE;
    `);
    await db().exec(ddl);
});

test("getAutopilotsInventory returns all autopilots from inventory", async () => {
    const inventory = await Autopilot.getAutopilotsInventory();
    expect(inventory.length).toBeGreaterThan(0);
    expect(inventory.find(a => a.name === 'NavComputer')).toBeDefined();
    expect(inventory.find(a => a.name === 'AI Captain')).toBeDefined();
});

test("getAutopilot returns a specific autopilot", async () => {
    const a = await Autopilot.getAutopilot('NavComputer');
    expect(a).not.toBeNull();
    expect(a?.passiveThrust).equals(5);
});

test("getAutopilot returns null for non-existent autopilot", async () => {
    const a = await Autopilot.getAutopilot('NonExistent');
    expect(a).toBeNull();
});

test("save inserts an autopilot and gets an id", async () => {
    await db().query('INSERT INTO ship(pilot_name, password, distance_traveled) VALUES ($1, $2, $3)', ["TestPilot", "password", 0]);
    const a = new Autopilot("Custom AI", 15, 500);
    await Autopilot.save(a, "TestPilot");
    
    expect(a.id).toBeDefined();
    expect(typeof a.id).equals('number');
});

test("activeAutopilots returns saved autopilots for a ship", async () => {
    await db().query('INSERT INTO ship(pilot_name, password, distance_traveled) VALUES ($1, $2, $3)', ["TestPilot", "password", 0]);
    const a1 = new Autopilot("AI1", 10, 100);
    const a2 = new Autopilot("AI2", 20, 200);
    
    await Autopilot.save(a1, "TestPilot");
    await Autopilot.save(a2, "TestPilot");
    
    const active = await Autopilot.activeAutopilots("TestPilot");
    expect(active.length).equals(2);
    expect(active.map(a => a.name)).contains("AI1");
    expect(active.map(a => a.name)).contains("AI2");
});
