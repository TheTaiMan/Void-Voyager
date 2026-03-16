/**
 * Responsible for creating the ships UI elements and updating them
 * when the ship model changes (Observer pattern).
 */

import type Ship from "../model/ship";
import type Listener from "../model/listener";

import ShipController from "../controller/shipController";

export default class ShipView implements Listener {
    #ship: Ship
    #shipController: ShipController

    constructor(ship: Ship, shipController: ShipController) {
        this.#ship = ship
        this.#shipController = shipController

        // Register as an observer to receive updates from the model
        this.#ship.registerListener(this)

        this.#initializeUI()
    }

    /**
     * Creates the initial DOM elements for the ship and attaches event listeners.
     */
    #initializeUI() {
        const app = document.querySelector("#app")!;
        const shipContainer = document.createElement("div");
        shipContainer.id = "ship";
        
        const initialSpeed = this.#ship.thrustPower * this.#ship.thrustsPerSecond;
        
        shipContainer.innerHTML = 
           `<h1 id="distance">${this.#ship.distanceTraveled}</h1>
            <p id="thrust">Distance per click: ${this.#ship.thrustPower}</p>
            <p id="speed">Speed: ${initialSpeed}</p>
            <button id="engage">Engage Thrusters</button>`

        app.appendChild(shipContainer);

        // Attach controller action to the button
        document.querySelector("#engage")!
            .addEventListener("click",
                () => this.#shipController.engageThrusters())
    }

    /**
     * Called by the Ship model when state changes.
     * Updates the displayed distance and speed.
     */
    notify() {
        document.querySelector("#distance")!
            .innerHTML = `${this.#ship.distanceTraveled}`

        document.querySelector("#thrust")!
            .innerHTML = `Distance per click: ${this.#ship.thrustPower}`

        const speed = this.#ship.thrustPower * this.#ship.thrustsPerSecond
        document.querySelector("#speed")!
            .innerHTML = `Speed: ${speed}`
    }
}
