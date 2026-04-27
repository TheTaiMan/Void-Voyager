import assert from "../util/assertions"
import type Listener from "./listener"
import Autopilot from "./autopilot"
import db from "./connection"
import Propulsion from "./propulsion"

export const Slot = {
    A: 0,
    B: 1,
    C: 2,
    D: 3,
    E: 4,
    F: 5,
    G: 6,
    H: 7,
    I: 8,
    J: 9
} as const;

export type Slot = typeof Slot[keyof typeof Slot];

// Represents an autopilot that generates passive thrust
export default class AI {
    #isOn: boolean
    #currentState!: Propulsion | Autopilot
    #nextState!: Propulsion | Autopilot

    #allUpgrades: Map<Slot, Propulsion | Autopilot>
    #data: Array<Array<number>>
    #listeners: Array<Listener>

    constructor() {
        this.#isOn = false
        this.#data = Array<Array<number>>()
        this.#allUpgrades = new Map<Slot, Propulsion | Autopilot>()
        this.#listeners = new Array<Listener>()
    }

    async getAllUpgrades() {
        let autopilot = await db()
        .query<{
            name: string,
            passive_thrust: number,
            cost: number
        }>("SELECT * FROM autopilot_inventory")

        let propulsion = await db()
        .query<{
            name: string,
            boost: number,
            cost: number
        }>("SELECT * FROM propulsion_inventory")

        assert(autopilot.rows.length >= 5, "Not enough autopilot items in DB");
        assert(propulsion.rows.length >= 5, "Not enough propulsion items in DB");

        for (let i = 0; i < 5; i++) {
            const autopilotSlot = (i * 2) as Slot;
            const propulsionSlot = (i * 2 + 1) as Slot;

            const currentAutopilot = new Autopilot(autopilot.rows[i].name, autopilot.rows[i].passive_thrust, autopilot.rows[i].cost)
            const currentPropulsion = new Propulsion(propulsion.rows[i].name, propulsion.rows[i].boost, propulsion.rows[i].cost);

            this.#allUpgrades.set(autopilotSlot, currentAutopilot);
            this.#allUpgrades.set(propulsionSlot, currentPropulsion);
        }

        // Load the transition matrix once items are fetched
        await this.loadModel();
    }

    // Load the transition matrix from the CSV
    async loadModel() {
        const response = await fetch("/model.csv");
        const csvContent = await response.text();

        const lines = csvContent.trim().split("\n");

        // Skip the header row and parse the rows
        for (let i = 1; i < lines.length; i++) {
            const columns = lines[i].split(",");

            // Grab just the 10 transition counts (index 1 through 10)
            const transitions = columns.slice(1, 11).map(Number);
            this.#data.push(transitions);
        }
    }

    get isOn() {
        return this.#isOn
    }

    set currentState(currentState: Propulsion | Autopilot) {
        this.#currentState = currentState
        this.calculateNextState()
    }

    get nextState(): Propulsion | Autopilot {
        return this.#nextState
    }

    toggle() {
        this.#isOn = !this.#isOn
        this.#notifyAll()
    }

    #notifyAll() {
        this.#listeners.forEach(e => {
            e.notify()
        })
    }

    registerListener(listener: Listener) {
        this.#listeners.push(listener)
    }

    calculateNextState() {
        if (!this.#currentState || this.#data.length === 0) return;

        // Find the Slot index of the current state
        let currentIndex = -1;
        for (const [key, value] of this.#allUpgrades.entries()) {
            if (value.name === this.#currentState.name) {
                currentIndex = key;
                break;
            }
        }

        if (currentIndex === -1) return;

        // Get the row of transitions for this state
        const transitions = this.#data[currentIndex];

        // Calculate the denominator (sum of all outgoing transitions)
        let denominator = 0;
        for (const count of transitions) {
            denominator += count;
        }

        if (denominator === 0) return;

        // Generate a random number between 1 and the denominator inclusive
        const randomNum = Math.floor(Math.random() * denominator) + 1;

        // Keep a running sum to find the next state
        let runningSum = 0;
        for (let nextIndex = 0; nextIndex < transitions.length; nextIndex++) {
            runningSum += transitions[nextIndex];

            if (runningSum >= randomNum) {
                // Assign the next state based on the matching Slot index
                this.#nextState = this.#allUpgrades.get(nextIndex as Slot)!;
                break;
            }
        }
    }
}
