import type UpgradeController from "../controller/upgradeController"
import type Propulsion from "../model/propulsion";
import { InsufficientDistanceException } from "../model/ship";

export default class UpgradeView {
    #upgradeController: UpgradeController

    constructor(upgradeController: UpgradeController, inventoryPromise: Promise<Array<Propulsion>>) {
        this.#upgradeController = upgradeController

        inventoryPromise.then((propulsion) => {
            this.#renderButtons(propulsion)
        })
    }

    /**
     * Creates and appends the upgrade buttons to the DOM.
     * (Currently hardcoded for specific upgrade types)
     */
    #renderButtons(propulsions: Array<Propulsion>) {
        const app = document.querySelector("#app")!;
        const upgradeEle = document.createElement("div")
        upgradeEle.id = "upgrades"
        app.appendChild(upgradeEle);

        // You would likely get a reference to an HTML div container here
        // const container = document.getElementById("shop-container");

        propulsions.forEach(propulsion => {
            const button = document.createElement("button");
            button.innerText = `${propulsion.name} [+${propulsion.boost}] (Cost: ${propulsion.cost})`;
            button.addEventListener("click", () => {
                this.#handleClick(propulsion.name)
            });

            upgradeEle.appendChild(button);
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

    // The view method must be async to wait for the controller's database query
    async #handleClick(name: string) {
        try {
            await this.#upgradeController.handleClick(name);
        } catch (e: any) {
            if (e instanceof InsufficientDistanceException) {
                this.#showErrorMessage("Insufficient distance to purchase this upgrade!");
            } else {
                console.error(`Unexpected error: ${e}`);
            }
        }
    }
}
