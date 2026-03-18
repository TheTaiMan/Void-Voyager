import Autopilot from "../model/autopilot";
import BuildingView from "../view/buildingView"
import ShipController from "./shipController";

// Manages the logic for purchasing and installing autopilots
export default class BuildingController {
    #shipController: ShipController
    #buildingView: BuildingView

    constructor(shipController: ShipController) {
        this.#shipController = shipController
        
        this.#buildingView = new BuildingView(this, Autopilot.getAutopilotsInventory())
    }

    // Handle user click to purchase an autopilot
    async handleClick(name: string) {
        const autopilot= await Autopilot.getAutopilot(name);

        if (autopilot !== null) {
            this.#shipController.installAutopilot(autopilot);
        }
    }
}
