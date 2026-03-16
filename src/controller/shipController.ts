import type Autopilot from "../model/autopilot";
import type Propulsion from "../model/propulsion"
import Ship from "../model/ship";
import ShipView from "../view/shipView";

export default class ShipController {
    #ship: Ship
    #shipView: ShipView
    #automationId: number

    constructor() {
        this.#ship = new Ship()
        this.#shipView = new ShipView(this.#ship, this)

        this.#automationId = this.#engageAutopilots()
    }

    engageThrusters() {
        this.#ship.engageThrusters()
    }

    installUpgrade(upgrade: Propulsion) {
        this.#ship.installUpgrade(upgrade)
    }

    installAutopilot(autopilot: Autopilot) {
        this.#ship.installAutopilot(autopilot)
    }

    #engageAutopilots() {
        return setInterval(() => {
            this.#ship.applyPassiveThrust();
        }, 1000);
    }

}
