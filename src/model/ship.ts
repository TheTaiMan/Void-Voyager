/**
 * Maintains the state of the ship, including distance traveled, current speed,
 * and installed upgrades. Notifies listeners (Observers) when state changes.
 */

import assert from "../util/assertions"
import Autopilot from "./autopilot"

import type Listener from "./listener"
import type PropulsionSystem from "./propulsionSystem"

export default class Ship {
    #distanceTraveled: number
    #thrustPower: number
    #installedUpgrades: Array<PropulsionSystem>
    #thrustsPerSecond: number
    #activeAutopilots: Array<Autopilot>
    #listeners: Array<Listener>

    constructor() {
        this.#distanceTraveled = 0
        this.#thrustPower = 1
        this.#installedUpgrades = new Array<PropulsionSystem>()
        this.#thrustsPerSecond = 0
        this.#activeAutopilots = new Array<Autopilot>()

        this.#listeners = new Array<Listener>()
        this.#checkInvairant()
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

    get thrustsPerSecond() {
        return this.#thrustsPerSecond
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
        this.#checkInvairant()
        this.#notifyAll()
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
            this.#thrustPower += e.boost()
        })

        // Checks whether thrustPower is proper
        this.#checkInvairant()
    }

    installUpgrade(upgrade: PropulsionSystem) {
        if (this.#deductDistanceTravelled(upgrade.cost())) {
            this.#installedUpgrades.push(upgrade)
            this.#updateThrustPower()
            this.#notifyAll()
        } else {
            throw new InsufficientDistanceException();
        }
    }

    #updateThrustsPerSecond() {
        this.#thrustsPerSecond = 0
        this.#activeAutopilots.forEach( (e) => {
            this.#thrustsPerSecond += e.passiveVelocity()
        })

        // Checks whether thrustPower is proper
        this.#checkInvairant()
    }

    installAutopilot(autopilot: Autopilot) {
        if (this.#deductDistanceTravelled(autopilot.cost())) {
            this.#activeAutopilots.push(autopilot)
            this.#updateThrustsPerSecond()
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
