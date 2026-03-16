-- title: Void Voyager
-- author: Miah Tayen (tayenm@myumanitoba.ca)
-- date: Winter 2026

-- Ship (Account) Table
CREATE TABLE IF NOT EXISTS ship (
    pilot_name VARCHAR(255) PRIMARY KEY, -- Same as NOT NULL UNIQUE
    password VARCHAR(255) NOT NULL,
    distance_traveled INT NOT NULL,
    thrust_power INT NOT NULL,
    thrusts_per_second INT NOT NULL
);

-- Instance Tables
CREATE TABLE IF NOT EXISTS propulsion_system (
    id SERIAL PRIMARY KEY, -- Same as NOT NULL UNIQUE
    name VARCHAR(255) NOT NULL,
    boost INT NOT NULL,
    cost INT NOT NULL,

    ship_id VARCHAR(255),
    FOREIGN KEY (ship_id) REFERENCES ship(pilot_name)
        ON DELETE CASCADE
        
);

CREATE TABLE IF NOT EXISTS autopilot (
    id SERIAL PRIMARY KEY, -- Same as NOT NULL UNIQUE
    name VARCHAR(255) NOT NULL,
    passive_velocity INT NOT NULL,
    cost INT NOT NULL,

    ship_id VARCHAR(255),
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
    passive_velocity INT NOT NULL,
    cost INT NOT NULL
);

INSERT INTO propulsion_inventory (name, boost, cost)
    VALUES ('Jump Drive', 10, 50)
    ON CONFLICT (name) DO NOTHING;

INSERT INTO propulsion_inventory (name, boost, cost)
    VALUES ('Hyperdrive', 50, 500)
    ON CONFLICT (name) DO NOTHING;

INSERT INTO autopilot_inventory (name, passive_velocity, cost) 
    VALUES ('NavComputer', 5, 100) 
    ON CONFLICT (name) DO NOTHING;

INSERT INTO autopilot_inventory (name, passive_velocity, cost) 
    VALUES ('AI Captain', 25, 1000) 
    ON CONFLICT (name) DO NOTHING;
