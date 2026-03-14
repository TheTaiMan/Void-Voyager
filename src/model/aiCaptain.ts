/**
 * Represents a specific type of propulsion system upgrade for the ship.
 */

import assert from "../util/assertions"
import type Autopilot from "./autopilot"

export default class AI_Captain implements Autopilot {
    readonly #modelName: string
    #passiveVelocity: number
    #cost: number

    constructor() {
        this.#modelName = "AI Captain"
        this.#passiveVelocity = 10  // This is how many clicks second
        this.#cost = 10 // TODO: Pick something later
        this.#checkInvariant()
    }

    modelName() : string {
        return this.#modelName
    }

    passiveVelocity() : number {
        return this.#passiveVelocity
    }

    cost() : number {
        return this.#cost
    }

    #checkInvariant() {
        assert(this.#passiveVelocity > 0, "NavComputer passiveVelocity must be greater than zero.")
        assert(this.#cost> 0, "NavComputer cost must be greater than zero.")
    }
}
