import type BuildingController from "../controller/buildingController"
import type Autopilot from "../model/autopilot"; 
import { InsufficientDistanceException } from "../model/ship";

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
            button.innerText = `${autopilot.name()} [x${autopilot.passiveThrust()}] (Cost: ${autopilot.cost()})`;

            button.addEventListener("click", () => {
                this.#handleClick(autopilot.name())
            });

            buildingEle.appendChild(button);
        });
    }

    #showErrorMessage(message: string) {
        const app = document.querySelector("#app")!;

        // Create an error container
        const errorBox = document.createElement("div");
        errorBox.innerText = message;

        // Apply styling to make it look like an error
        errorBox.style.color = "white";
        errorBox.style.backgroundColor = "red";
        errorBox.style.fontWeight = "bold";

        app.appendChild(errorBox);

        // Automatically remove the error message after 3 seconds
        setTimeout(() => {
            if (app.contains(errorBox)) {
                app.removeChild(errorBox);
            }
        }, 3000);
    }

    async #handleClick(name: string) {
        try {
            await this.#buildingController.handleClick(name);
        } catch (e: any) {
            if (e instanceof InsufficientDistanceException) {
                this.#showErrorMessage("Insufficient distance to purchase this autopilot!");
            } else {
                console.error(`Unexpected error: ${e}`);
            }
        }
    }
}
