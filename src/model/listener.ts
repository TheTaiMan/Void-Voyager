/**
 * Defines the contract for objects that wish to be notified of changes
 * in the model (Observer pattern).
 */

export default interface Listener {
    notify(): void;
}
