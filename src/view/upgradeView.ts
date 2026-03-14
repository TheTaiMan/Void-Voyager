/**
 * Displays available upgrades and handles click events to purchase them.
 */

import type UpgradeController from "../controller/upgradeController"
import type Hyperdrive from "../model/hyperdrive"
import type JumpDrive from "../model/jumpDrive"

export default class UpgradeView {
    #upgradeController: UpgradeController

    constructor(upgradeController: UpgradeController, jumpDrive: JumpDrive, hyperdrive: Hyperdrive) {
        this.#upgradeController = upgradeController
        this.#renderButtons(jumpDrive, hyperdrive) // Hardcoded for now
    }

    /**
     * Creates and appends the upgrade buttons to the DOM.
     * (Currently hardcoded for specific upgrade types)
     */
    #renderButtons(jumpDrive: JumpDrive, hyperdrive: Hyperdrive) {
        const app = document.querySelector("#app")!;
        const upgradeEle = document.createElement("div")
        upgradeEle.id = "upgrades"
        
        app.appendChild(upgradeEle);
        
        // 1. Create Jump Drive Button
        const jumpDriveEle = document.createElement("button")
        jumpDriveEle.innerText = `${jumpDrive.modelName()} (+${jumpDrive.boost()})`
        jumpDriveEle.id = "jumpdrive-btn"
        jumpDriveEle.addEventListener("click", 
                     () => this.#upgradeController.handleJumpdriveClick())

        upgradeEle.append(jumpDriveEle)

        // 2. Create Hyperdrive Button
        const hyperdriveEle = document.createElement("button")
        hyperdriveEle.innerText = `${hyperdrive.modelName()} (+${hyperdrive.boost()})`
        hyperdriveEle.id = "hyperdrive-btn"
        hyperdriveEle.addEventListener("click",
                      () => this.#upgradeController.handleHyperdriveClick())

        upgradeEle.append(hyperdriveEle)
    }
}
