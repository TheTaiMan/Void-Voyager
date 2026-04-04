-- title: Void Voyager
-- author: Miah Tayen (tayenm@myumanitoba.ca)
-- date: Winter 2026

-- Ship (Account) Table
CREATE TABLE IF NOT EXISTS ship (
    pilot_name VARCHAR(255) PRIMARY KEY, -- Same as NOT NULL UNIQUE
    password VARCHAR(255) NOT NULL,
    distance_traveled INT NOT NULL
    -- thrust_power INT NOT NULL, -- I don't need these as they are always recalculated from the Arrays
    -- thrusts_per_second INT NOT NULL
);

-- Instance Tables
CREATE TABLE IF NOT EXISTS propulsion (
    id SERIAL PRIMARY KEY, -- Same as NOT NULL UNIQUE
    name VARCHAR(255) NOT NULL,
    boost INT NOT NULL,
    cost INT NOT NULL,

    ship_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (ship_id) REFERENCES ship(pilot_name)
        ON DELETE CASCADE
        
);

CREATE TABLE IF NOT EXISTS autopilot (
    id SERIAL PRIMARY KEY, -- Same as NOT NULL UNIQUE
    name VARCHAR(255) NOT NULL,
    passive_thrust INT NOT NULL,
    cost INT NOT NULL,

    ship_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (ship_id) REFERENCES ship(pilot_name)
        ON DELETE CASCADE
);

-- Inventory Tables
CREATE TABLE IF NOT EXISTS propulsion_inventory (
    name VARCHAR(255) PRIMARY KEY,
    boost INT NOT NULL,
    cost INT NOT NULL
);

CREATE TABLE IF NOT EXISTS autopilot_inventory (
    name VARCHAR(255) PRIMARY KEY,
    passive_thrust INT NOT NULL,
    cost INT NOT NULL
);

INSERT INTO propulsion_inventory (name, boost, cost)
    VALUES ('Jump Drive', 10, 50)
    ON CONFLICT (name) DO NOTHING;

INSERT INTO propulsion_inventory (name, boost, cost)
    VALUES ('Hyperdrive', 50, 500)
    ON CONFLICT (name) DO NOTHING;

INSERT INTO autopilot_inventory (name, passive_thrust, cost) 
    VALUES ('NavComputer', 5, 100) 
    ON CONFLICT (name) DO NOTHING;

INSERT INTO autopilot_inventory (name, passive_thrust, cost) 
    VALUES ('AI Captain', 25, 1000) 
    ON CONFLICT (name) DO NOTHING;

-- 10 new "purchasable" items:

-- Propulsion Upgrades (Click modifiers)
INSERT INTO propulsion_inventory (name, boost, cost)
    VALUES ('Warp Core', 100, 1500)
    ON CONFLICT (name) DO NOTHING;

INSERT INTO propulsion_inventory (name, boost, cost)
    VALUES ('Singularity Engine', 250, 4000)
    ON CONFLICT (name) DO NOTHING;

INSERT INTO propulsion_inventory (name, boost, cost)
    VALUES ('Quantum Thruster', 500, 10000)
    ON CONFLICT (name) DO NOTHING;

INSERT INTO propulsion_inventory (name, boost, cost)
    VALUES ('Tachyon Drive', 1000, 25000)
    ON CONFLICT (name) DO NOTHING;

INSERT INTO propulsion_inventory (name, boost, cost)
    VALUES ('Dark Matter Propulsor', 2500, 60000)
    ON CONFLICT (name) DO NOTHING;


-- Autopilot Buildings (Passive distance generation)
INSERT INTO autopilot_inventory (name, passive_thrust, cost) 
    VALUES ('Drone Swarm', 75, 3000) 
    ON CONFLICT (name) DO NOTHING;

INSERT INTO autopilot_inventory (name, passive_thrust, cost) 
    VALUES ('Automated Starport', 200, 8000) 
    ON CONFLICT (name) DO NOTHING;

INSERT INTO autopilot_inventory (name, passive_thrust, cost) 
    VALUES ('Cloning Facility', 500, 20000) 
    ON CONFLICT (name) DO NOTHING;

INSERT INTO autopilot_inventory (name, passive_thrust, cost) 
    VALUES ('Orbital Nexus', 1200, 50000) 
    ON CONFLICT (name) DO NOTHING;

INSERT INTO autopilot_inventory (name, passive_thrust, cost) 
    VALUES ('Dyson Sphere Array', 3000, 120000) 
    ON CONFLICT (name) DO NOTHING;
