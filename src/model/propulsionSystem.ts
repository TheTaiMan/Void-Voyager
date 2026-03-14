/**
 * Interface for all ship upgrades that provide propulsion.
 */

export default interface PropulsionSystem {
    modelName(): string
    boost(): number
}
