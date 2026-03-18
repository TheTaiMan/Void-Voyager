/**
 * Maintains the state of the ship, including distance traveled, current speed,
 * and installed upgrades. Notifies listeners (Observers) when state changes.
 */

import assert from "../util/assertions"
import { hashPassword, verifyPassword } from "../util/passwordHash"
import Autopilot from "./autopilot"
import db from "./connection"

import type Listener from "./listener"
import Propulsion from "./propulsion"

export default class Ship {
    #pilotName: string
    #distanceTraveled: number
    #thrustPower: number
    #installedUpgrades: Array<Propulsion>
    #thrustsPerSecond: number
    #activeAutopilots: Array<Autopilot>
    #listeners: Array<Listener>

    constructor(
        pilotName: string,
        distanceTraveled: number,
        installedUpgrades: Array<Propulsion>,
        activeAutopilots: Array<Autopilot>
    ) {
        this.#pilotName = pilotName
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

    // Save traveled distance to the database
    static async saveTravelledDistance(ship: Ship) {
        await db().query(
            `UPDATE ship SET distance_traveled = $1 WHERE pilot_name = $2`,
            [ship.distanceTraveled, ship.pilotName]
        )
    }

    // Save ships inventory (upgrades and autopilots) to database
    static async saveInventory(ship: Ship) {
        ship.installUpgrades.forEach((propulsion: Propulsion) => {
            if (!propulsion.id) {
                Propulsion.save(propulsion, ship.pilotName)
            }
        })

        ship.activeAutopilots.forEach((autopilot: Autopilot) => {
            if (!autopilot.id) {
                Autopilot.save(autopilot, ship.pilotName)
            }
        })
    }


    /**
     * Looks up the pilot by name, rederives the PBKDF2 hash using the stored salt,
     * compares it, and returns the pilot's data if successful or null if not
     */
    static async authenticate( pilotName: string, password: string):
        Promise<{ pilotName: string, distanceTraveled: number } | null> {

        const result = await db()
            .query<{ pilot_name: string, password: string, distance_traveled: number }>(
                `SELECT pilot_name, password, distance_traveled
                 FROM ship
                 WHERE pilot_name = $1`,
                [pilotName]
            )

        if (result.rows.length === 0) return null

        const row = result.rows[0]
        const match = await verifyPassword(password, row.password)

        if (!match) return null

        return {
            pilotName: row.pilot_name,
            distanceTraveled: row.distance_traveled
        }
    }

    /**
     * Hashes the password before storing. Returns false if the pilot
     * name is already taken.
     */
    static async register(pilotName: string, password: string): Promise<boolean> {
        try {
            const hashed = await hashPassword(password)
            await db().query(
                `INSERT INTO ship(pilot_name, password, distance_traveled)
                 VALUES($1, $2, $3)`,
                [pilotName, hashed, 0]
            )
            return true
        } catch {
            return false
        }
    }

    #checkInvairant() {
        assert(this.distanceTraveled >= 0,
               "Distance traveled must be greater than or equal to zero.")
        assert(this.thrustPower > 0,
               "Thrust power must be greater than zero.")
        assert(this.thrustsPerSecond >= 0,
               "Thrust per second must greater than or equal to zero.")
    }

    // Increase distance by thrust power and notify listeners
    engageThrusters() {
        this.#distanceTraveled += this.thrustPower
        Ship.saveTravelledDistance(this)
        this.#checkInvairant()
        this.#notifyAll()
    }

    // Apply passive thrust from active autopilots
    applyPassiveThrust() {
        const passiveDistance = this.thrustPower * this.thrustsPerSecond

        if (passiveDistance > 0) {
            this.distanceTraveled += passiveDistance
            Ship.saveTravelledDistance(this)
            this.#checkInvairant()
            this.#notifyAll()
        }
    }

    // Deduct distance and return true on success, false on failure
    #deductDistanceTravelled(amount: number): boolean {
        const newDistance = this.distanceTraveled - amount
        if (newDistance < 0) {
            return false
        }

        this.distanceTraveled = newDistance
        Ship.saveTravelledDistance(this)
        this.#checkInvairant()
        return true
    }

    // Recalculate total thrust power from installed upgrades
    #updateThrustPower() {
        this.#thrustPower = 1
        this.#installedUpgrades.forEach(e => {
            this.#thrustPower += e.boost
        })
        this.#checkInvairant()
    }

    // Purchase and install upgrade if distance allows
    installUpgrade(upgrade: Propulsion) {
        if (this.#deductDistanceTravelled(upgrade.cost)) {
            this.#installedUpgrades.push(upgrade)
            this.#updateThrustPower()
            Ship.saveInventory(this)
            this.#notifyAll()
        } else {
            throw new InsufficientDistanceException()
        }
    }

    // Recalculate total thrusts per second from active autopilots
    #updateThrustsPerSecond() {
        this.#thrustsPerSecond = 0
        this.#activeAutopilots.forEach((e) => {
            this.#thrustsPerSecond += e.passiveThrust
        })
        this.#checkInvairant()
    }

    // Purchase and install autopilot if distance allows
    installAutopilot(autopilot: Autopilot) {
        if (this.#deductDistanceTravelled(autopilot.cost)) {
            this.#activeAutopilots.push(autopilot)
            this.#updateThrustsPerSecond()
            Ship.saveInventory(this)
            this.#notifyAll()
        } else {
            throw new InsufficientDistanceException()
        }
    }

    // Notify all registered listeners
    #notifyAll() {
        this.#listeners.forEach(e => {
            e.notify()
        })
    }

    // Register a new listener
    registerListener(listner: Listener) {
        this.#listeners.push(listner)
    }
}

// Exception thrown when ship doesn't have enough distance for purchase
export class InsufficientDistanceException extends Error { }
