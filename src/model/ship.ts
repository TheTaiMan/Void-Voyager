/**
 * Maintains the state of the ship, including distance traveled, current speed,
 * and installed upgrades. Notifies listeners (Observers) when state changes.
 */

import assert from "../util/assertions"
import Autopilot from "./autopilot"
import db from "./connection"

import type Listener from "./listener"
import Propulsion from "./propulsion"

export default class Ship {
    #pilotName: string
    #password: string
    #distanceTraveled: number
    #thrustPower: number
    #installedUpgrades: Array<Propulsion>
    #thrustsPerSecond: number
    #activeAutopilots: Array<Autopilot>
    #listeners: Array<Listener>

    constructor(
        pilotName: string,
        password: string,
        distanceTraveled: number,
        installedUpgrades: Array<Propulsion>,
        activeAutopilots: Array<Autopilot>
    ) {
        this.#pilotName = pilotName 
        this.#password =  password 
        this.#distanceTraveled = distanceTraveled
        this.#installedUpgrades = installedUpgrades
        this.#thrustPower = 1
        this.#thrustsPerSecond = 0
        this.#activeAutopilots = activeAutopilots
        this.#listeners = new Array<Listener>()

        this.#updateThrustPower() 
        this.#updateThrustsPerSecond() 
        this.#checkInvairant()
    }

    get pilotName() {
        return this.#pilotName
    }

    // TODO: DON"T leave this as public, as anyone can access it, just for TESTING
    get password() {
        return this.#password
    }

    get distanceTraveled() {
        return this.#distanceTraveled
    }

    set distanceTraveled(amount: number) {
        this.#distanceTraveled = amount
    }

    get thrustPower() {
        return this.#thrustPower
    }

    get installUpgrades() {
        return this.#installedUpgrades
    }

    get thrustsPerSecond() {
        return this.#thrustsPerSecond
    }

    get activeAutopilots() {
        return this.#activeAutopilots
    }

    static async saveTravelledDistance(ship: Ship) {
        await db().query<{ pilot_name: string, password: string, distance_traveled: number }>(
                `UPDATE ship set distance_traveled = $1 WHERE pilot_name = $2`,
                    [ship.distanceTraveled, ship.pilotName]
        )
    }

    static async save(ship: Ship) {
        // TODO: This has to be a has that matches with my password 
        let results = await db()
            .query<{ pilot_name: string, password: string, distance_traveled: number}>
                ( 
                 `INSERT INTO ship(pilot_name, password, distance_traveled)
                     VALUES($1, $2, $3)
                     ON CONFLICT (pilot_name)
                     DO UPDATE SET distance_traveled = $3`,
                    [ship.pilotName, ship.password, ship.distanceTraveled]
                );

        ship.installUpgrades.forEach( (propulsion: Propulsion) => {
            if (!propulsion.id) {
                Propulsion.save(propulsion, ship.pilotName)
            }

        })

        ship.activeAutopilots.forEach( (autopilot: Autopilot) => {
            if (!autopilot.id) {
                Autopilot.save(autopilot, ship.pilotName)
            }
        })
    }

    #checkInvairant() {
        assert(this.distanceTraveled >= 0,
               "Distance traveled must be greater than or equal to zero.")
        assert(this.thrustPower > 0,
               "Thrust power must be greater than zero.")
        assert(this.thrustsPerSecond >= 0,
               "Thrust per second must greater than or equal to zero.")
    }

    engageThrusters() {
        this.#distanceTraveled += this.thrustPower
        // Checks whether distanceTraveled is proper
        Ship.saveTravelledDistance(this)
        this.#checkInvairant()
        this.#notifyAll()
    }

    applyPassiveThrust() {
        const passiveDistance = this.thrustPower * this.thrustsPerSecond;

        // Only update and notify if there is actual movement
        if (passiveDistance > 0) {
            this.distanceTraveled += passiveDistance;
            Ship.saveTravelledDistance(this)
            this.#checkInvairant();
            this.#notifyAll();
        }
    }

    #deductDistanceTravelled(amount: number) : boolean {
        const newDistance = this.distanceTraveled - amount
        if (newDistance < 0) {
            return false
        }

        this.distanceTraveled = newDistance
        this.#checkInvairant()
        return true
    }

    #updateThrustPower() {
        // Updates how much each click is worth
        this.#thrustPower = 1
        this.#installedUpgrades.forEach(e => {
            this.#thrustPower += e.boost
        })

        // Checks whether thrustPower is proper
        this.#checkInvairant()
    }

    installUpgrade(upgrade: Propulsion) {
        if (this.#deductDistanceTravelled(upgrade.cost)) {
            this.#installedUpgrades.push(upgrade)
            this.#updateThrustPower()
            Ship.save(this)
            this.#notifyAll()
        } else {
            throw new InsufficientDistanceException();
        }
    }

    #updateThrustsPerSecond() {
        this.#thrustsPerSecond = 0
        this.#activeAutopilots.forEach( (e) => {
            this.#thrustsPerSecond += e.passiveThrust
        })

        // Checks whether thrustPower is proper
        this.#checkInvairant()
    }

    installAutopilot(autopilot: Autopilot) {
        if (this.#deductDistanceTravelled(autopilot.cost)) {
            this.#activeAutopilots.push(autopilot)
            this.#updateThrustsPerSecond()
            Ship.save(this)
            this.#notifyAll()
        } else {
            throw new InsufficientDistanceException();
        }
    }

    #notifyAll() {
        this.#listeners.forEach(e => {
            e.notify()
        })
    }

    registerListener(listner: Listener) {
        this.#listeners.push(listner)
    }
}

export class InsufficientDistanceException extends Error { }
