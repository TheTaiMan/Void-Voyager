import type ShipController from "./shipController"
import type Listener from "../model/listener"

import type Ship from "../model/ship"
import AI from "../model/ai"
import Autopilot from "../model/autopilot"
import Propulsion from "../model/propulsion"
import AIView from "../view/aiView"

// Manages the logic for purchasing and installing propulsion upgrades
export default class AIController implements Listener{
    #ai!: AI
    #ship: Ship
    #shipController: ShipController
    #isPurchasing: boolean
    #aiView!: AIView

    constructor(ship: Ship, shipController: ShipController) {
        this.#ship = ship
        this.#shipController = shipController
        this.#isPurchasing = false
        this.#aiView = new AIView(this)
        this.#ship.registerListener(this)
    }

    updateCurrentState(state: Propulsion | Autopilot) {
        this.#ai.currentState = state 
        console.log(`[AI] Current State: ${state.name}, Next State: ${this.#ai.nextState?.name ?? "null"}`)
    }

    get isOn(): boolean {
        if (!this.#ai) return false
        return this.#ai.isOn
    }

    toggle(): void {
        if (!this.#ai) return
        this.#ai.toggle()
    }

    async initialize() {
        this.#ai = new AI()
        this.#ai.registerListener(this.#aiView)
        await this.#ai.getAllUpgrades()
    }

    // If ship funds allow and auto upgrade is on AND AI has a current state, menaing the current state is not empty, if so thorw and error
    #canUpgrade(): boolean {
        // If first item is not even set
        if (this.#ai.nextState == null) {
            return false
        }

        let sufficientCost =
            this.#ai.nextState.cost <= this.#ship.distanceTraveled
        return this.#ai.isOn && sufficientCost
    }

    notify() {
        if (this.#canUpgrade()) {
            try {
                // Hopefully no race condition here. since we varified that you can upgrade
                // and that number alwasy changes so idk
                if (this.#ai.nextState instanceof Autopilot) {
                    this.#shipController.installAutopilot(this.#ai.nextState)
                }

                if (this.#ai.nextState instanceof Propulsion) {
                    this.#shipController.installUpgrade(this.#ai.nextState)
                }
            } catch (e: unknown) {
                // Silently ignore — auto buy should not throw errors
            }
        }
    }
}


