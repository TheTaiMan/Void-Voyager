import type BuildingController from "../controller/buildingController"
import type Autopilot from "../model/autopilot"; 

export default class BuildingView {
    #buildingController: BuildingController

    constructor(buildingController: BuildingController, inventoryPromise: Promise<Array<Autopilot>>) {
        this.#buildingController = buildingController
        
        inventoryPromise.then((autopilots) => {
            this.#renderButtons(autopilots)
        })
    }

    #renderButtons(autopilots: Array<Autopilot>) {
        const app = document.querySelector("#app")!;
        const buildingEle = document.createElement("div")
        buildingEle.id = "buildings"
        app.appendChild(buildingEle);
        
        // You would likely get a reference to an HTML div container here
        // const container = document.getElementById("shop-container");

        autopilots.forEach(autopilot => {
            const button = document.createElement("button");
            button.innerText = `${autopilot.name()} [x${autopilot.passiveVelocity()}] (Cost: ${autopilot.cost()})`;

            button.addEventListener("click", () => {
                this.#buildingController.handleClick(autopilot.name());
            });

            buildingEle.appendChild(button);
        });
    }
}
