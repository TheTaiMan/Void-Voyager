import PropulsionSystem from "../model/propulsionSystem"
import UpgradeView from "../view/upgradeView"
import ShipController from "./shipController"

export default class UpgradeController {
    #shipController: ShipController
    #upgradeView: UpgradeView

    constructor(shipController: ShipController) {
        // Instantiate sample upgrades so the view can display their stats/names
        this.#shipController = shipController 
        this.#upgradeView = new UpgradeView(this, PropulsionSystem.getPropulsionInventory())
    }


    handleClick(name: string) {
        PropulsionSystem.getPropulsion(name).then((propulsion)=> {
            if (propulsion !== null) {
                this.#shipController.installUpgrade(propulsion)
            }
        })
    }

}

