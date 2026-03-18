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

        this.#ship.registerListener(this)
        this.#initializeUI()
    }

    #initializeUI() {
        const app = document.querySelector("#app")!

        const shipContainer = document.createElement("div")
        shipContainer.id = "ship"

        const initialSpeed = this.#ship.thrustPower * this.#ship.thrustsPerSecond

        shipContainer.innerHTML =
           `<h3>🚀 ${this.#ship.pilotName}</h3>
            <h1 id="distance">Distance: ${this.#ship.distanceTraveled}</h1>
            <p id="thrust">Per Thrust: ${this.#ship.thrustPower}</p>
            <p id="speed">Speed: ${initialSpeed}/s</p>
            <button id="engage">Engage Thrusters</button>`

        app.appendChild(shipContainer)

        document.querySelector("#engage")!
            .addEventListener("click", () => this.#shipController.engageThrusters())
    }

    notify() {
        const speed = this.#ship.thrustPower * this.#ship.thrustsPerSecond

        document.querySelector("#distance")!.innerHTML = `Distance: ${this.#ship.distanceTraveled}`
        document.querySelector("#thrust")!.innerHTML  = `Per Thrust: ${this.#ship.thrustPower}`
        document.querySelector("#speed")!.innerHTML   = `Speed: ${speed}/s`
    }
}
