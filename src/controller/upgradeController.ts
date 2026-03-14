/**
 * Manages the Upgrade section of the application.
 */

import Hyperdrive from "../model/hyperdrive"
import JumpDrive from "../model/jumpDrive"

import UpgradeView from "../view/upgradeView"
import ShipController from "./shipController"

export default class UpgradeController {
    #hyperdrive: Hyperdrive
    #jumpDrive: JumpDrive
    #shipController: ShipController
    #upgradeView: UpgradeView

    constructor(shipController: ShipController) {
        // Instantiate sample upgrades so the view can display their stats/names
        this.#jumpDrive = new JumpDrive()
        this.#hyperdrive = new Hyperdrive()
        
        this.#shipController = shipController 
        this.#upgradeView = new UpgradeView(this, this.#jumpDrive, this.#hyperdrive)
    }

    handleHyperdriveClick() {
        const newUpgrade = new Hyperdrive()
        this.#shipController.installUpgrade(newUpgrade)
    }

    handleJumpdriveClick() {
        const newUpgrade = new JumpDrive()
        this.#shipController.installUpgrade(newUpgrade)
    }
}

