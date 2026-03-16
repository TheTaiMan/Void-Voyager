import Propulsion from "../model/propulsion"
import UpgradeView from "../view/upgradeView"
import ShipController from "./shipController"

export default class UpgradeController {
    #shipController: ShipController
    #upgradeView: UpgradeView

    constructor(shipController: ShipController) {
        // Instantiate sample upgrades so the view can display their stats/names
        this.#shipController = shipController
        this.#upgradeView = new UpgradeView(this, Propulsion.getPropulsionInventory())
    }


    async handleClick(name: string) {
        const propulsion = await Propulsion.getPropulsion(name);

        if (propulsion !== null) {
            this.#shipController.installUpgrade(propulsion);
        }
    }

}

