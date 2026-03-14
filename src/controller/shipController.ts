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
        
        // The view needs a reference to the model (for reading data) 
        // and this controller (for sending commands)
        this.#shipView = new ShipView(this.#ship, this)
    }
    
    engageThrusters() {
        this.#ship.engageThrusters()
    }

    installUpgrade(upgrade: PropulsionSystem) {
        this.#ship.installUpgrade(upgrade)
    }

}
