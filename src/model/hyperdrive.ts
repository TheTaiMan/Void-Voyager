/**
 * Represents a specific type of propulsion system upgrade for the ship.
 */

import assert from "../util/assertions"
import type PropulsionSystem from "./propulsionSystem"

export default class Hyperdrive implements PropulsionSystem {
    readonly #modelName: string
    #boost: number

    constructor() {
        this.#modelName = "Hyperdrive"
        this.#boost = 10
        this.#checkInvariant()
    }

    modelName() : string {
        return this.#modelName
    }

    boost() : number {
        return this.#boost
    }

    #checkInvariant() {
        assert(this.#boost > 0, "Hyperdrive boost must be greater than zero.")
    }
}
