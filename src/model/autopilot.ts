/**
 * Interface for all ship upgrades that provide propulsion.
 */

export default interface Autopilot {
    modelName(): string
    passiveVelocity(): number
    cost(): number
}
