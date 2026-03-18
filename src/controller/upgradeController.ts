import Propulsion from "../model/propulsion"
import UpgradeView from "../view/upgradeView"
import ShipController from "./shipController"

// Manages the logic for purchasing and installing propulsion upgrades
export default class UpgradeController {
    #shipController: ShipController
    #upgradeView: UpgradeView

    constructor(shipController: ShipController) {
        // Instantiate sample upgrades so the view can display their stats/names
        this.#shipController = shipController
        this.#upgradeView = new UpgradeView(this, Propulsion.getPropulsionInventory())
    }


    // Handle user click to purchase an upgrade
    async handleClick(name: string) {
        const propulsion = await Propulsion.getPropulsion(name);

        if (propulsion !== null) {
            this.#shipController.installUpgrade(propulsion);
        }
    }

}

