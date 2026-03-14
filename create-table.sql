-- title: Void Voyager
-- author: Miah Tayen (tayenm@myumanitoba.ca)
-- date: Winter 2026

-- Ship Table
CREATE TABLE IF NOT EXISTS ship(
    pilotName VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    distanceTraveled int NOT NULL,
    currentSpeed int NOT NULL 
);

-- PropulsionSystem Table (Flattened hierarchy)
CREATE TABLE IF NOT EXISTS propulsionSystem(
    id SERIAL NOT NULL UNIQUE,
    classType VARCHAR(255) NOT NULL,

    name VARCHAR(255) NOT NULL,
    boost int NOT NULL,
    cost int NOT NULL,

    ship VARCHAR(255) NOT NULL,
    FOREIGN KEY (ship) references ship(pilotName)
        ON DELETE CASCADE
);

-- Autopilot Table (Flattened hierarchy)
CREATE TABLE IF NOT EXISTS autopilot(
    id SERIAL NOT NULL UNIQUE,
    classType VARCHAR(255) NOT NULL,

    name VARCHAR(255) NOT NULL,
    passiveVelocity int NOT NULL,
    cost int NOT NULL,

    ship VARCHAR(255) NOT NULL,
    FOREIGN KEY (ship) references ship(pilotName)
        ON DELETE CASCADE
);
