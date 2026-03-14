import { expect, test } from 'vitest';

import Hyperdrive from '../src/model/hyperdrive';
import JumpDrive from '../src/model/jumpDrive';

test("Hyperdrive initializes with correct model name", () => {
    const drive = new Hyperdrive();
    expect(drive.modelName()).equals("Hyperdrive");
});

test("Hyperdrive provides correct boost", () => {
    const drive = new Hyperdrive();
    expect(drive.boost()).equals(10);
});

test("JumpDrive initializes with correct model name", () => {
    const drive = new JumpDrive();
    expect(drive.modelName()).equals("Jump Drive");
});

test("JumpDrive provides correct boost", () => {
    const drive = new JumpDrive();
    // Verifies the boost is 20
    expect(drive.boost()).equals(20);
});

