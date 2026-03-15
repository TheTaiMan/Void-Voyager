import Autopilot from "../model/autopilot";
import BuildingView from "../view/buildingView"
import ShipController from "./shipController";

export default class BuildingController {
    #shipController: ShipController
    #buildingView: BuildingView

    constructor(shipController: ShipController) {
        this.#shipController = shipController
        
        this.#buildingView = new BuildingView(this, Autopilot.getAutopilotsInventory())
    }

    // This method is triggered by the View when a dynamically generated button is clicked
    handleClick(name: string) {
        console.log("The user clicked the button to buy: " + name);
        
        // Here you will eventually query Autopilot.getAutopilot(name)
        // verify the player has enough currency, and deduct the cost
    }
}
