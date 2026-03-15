/**
 * It manages the Ship model and its corresponding view, acting as the bridge
 * between user input and game logic.
 */

import type PropulsionSystem from "../model/propulsionSystem";
import Ship from "../model/ship";
import ShipView from "../view/shipView";

export default class ShipController {
    #ship: Ship 
    #shipView: ShipView

    constructor() {
        this.#ship = new Ship()
        this.#shipView = new ShipView(this.#ship, this)
    }
    
    engageThrusters() {
        this.#ship.engageThrusters()
    }

    installUpgrade(upgrade: PropulsionSystem) {
        this.#ship.installUpgrade(upgrade)
    }

}
