import type UpgradeController from "../controller/upgradeController"
import type PropulsionSystem from "../model/propulsionSystem";

export default class UpgradeView {
    #upgradeController: UpgradeController

    constructor(upgradeController: UpgradeController, inventoryPromise: Promise<Array<PropulsionSystem>>) {
        this.#upgradeController = upgradeController

        inventoryPromise.then((propulsion) => {
            this.#renderButtons(propulsion)
        })
    }

    /**
     * Creates and appends the upgrade buttons to the DOM.
     * (Currently hardcoded for specific upgrade types)
     */
    #renderButtons(propulsions: Array<PropulsionSystem>) {
        const app = document.querySelector("#app")!;
        const upgradeEle = document.createElement("div")
        upgradeEle.id = "upgrades"
        app.appendChild(upgradeEle);
        
        // You would likely get a reference to an HTML div container here
        // const container = document.getElementById("shop-container");

        propulsions.forEach(propulsion => {
            const button = document.createElement("button");
            button.innerText = "Buy " + propulsion.name() + " (Cost: " + propulsion.cost() + ")";
            button.addEventListener("click", () => {
                this.#upgradeController.handleClick(propulsion.name());
            });

            upgradeEle.appendChild(button);
        });
    }
}
