/**
 * Maintains the state of the ship, including distance traveled, current speed,
 * and installed upgrades. Notifies listeners (Observers) when state changes.
 */

import assert from "../util/assertions"

import type Listener from "./listener"
import type PropulsionSystem from "./propulsionSystem"

export default class Ship {
    #distanceTraveled: number
    #currentSpeed: number
    #installedUpgrades: Array<PropulsionSystem>

    #listeners: Array<Listener>

    constructor() {
        this.#distanceTraveled = 0
        this.#currentSpeed = 1
        this.#installedUpgrades = new Array<PropulsionSystem>()

        this.#listeners = new Array<Listener>()
        this.#checkInvairant()
    }

    get distanceTraveled() {
        return this.#distanceTraveled
    }

    set distanceTraveled(amount: number) {
        this.#distanceTraveled = amount
    }

    get currentSpeed() {
        return this.#currentSpeed
    }

    get flightLog() {
        return this.#installedUpgrades
    }


    #checkInvairant() {
        assert(this.distanceTraveled >= 0,
               "Distance traveled must be greater than or equal to zero.")
        assert(this.currentSpeed > 0,
               "Current speed must be greater than zero.")
    }

    #updateSpeed() {
        // Updates how much each click is worth
        this.#currentSpeed = 1
        this.#installedUpgrades.forEach(e => {
            this.#currentSpeed += e.boost()
        })

        // Checks whether currentSpeed is proper
        this.#checkInvairant()
    }

    engageThrusters() {
        this.#distanceTraveled += this.currentSpeed
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

    installUpgrade(upgrade: PropulsionSystem) {
        if (this.#deductDistanceTravelled(upgrade.cost())) {
            this.#installedUpgrades.push(upgrade)
            this.#updateSpeed()
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
