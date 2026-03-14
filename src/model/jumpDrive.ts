/**
 * Represents a high performance propulsion system upgrade.
 */

import assert from "../util/assertions"
import type PropulsionSystem from "./propulsionSystem"

export default class JumpDrive implements PropulsionSystem {
    readonly #modelName: string
    #boost: number

    constructor() {
        this.#modelName = "Jump Drive"
        this.#boost = 20
        this.#checkInvariant()
    }

    modelName() {
        return this.#modelName
    }

    boost() {
        return this.#boost
    }

    #checkInvariant() {
        assert(this.#boost > 0, "JumpDrive boost must be greater than zero.")
    }
}
