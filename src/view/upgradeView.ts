import type UpgradeController from "../controller/upgradeController"
import type Propulsion from "../model/propulsion";
import { InsufficientDistanceException } from "../model/ship";

// Renders the list of available propulsion upgrades and handles purchase clicks
export default class UpgradeView {
    #upgradeController: UpgradeController
    #upgradeEle: HTMLDivElement

    constructor(upgradeController: UpgradeController, inventoryPromise: Promise<Array<Propulsion>>) {
        this.#upgradeController = upgradeController
        this.#upgradeEle = document.createElement("div")

        inventoryPromise.then((propulsions) => {
            this.#renderButtons(propulsions)
        })
    }

    // Create and display a button for each upgrade
    #renderButtons(propulsions: Array<Propulsion>) {
        const app = document.querySelector("#app")!

        this.#upgradeEle.id = "upgrades"

        const heading = document.createElement("h4")
        heading.textContent = "Propulsion Upgrades"
        this.#upgradeEle.appendChild(heading)

        propulsions.forEach((propulsion) => {
            const button = document.createElement("button")
            button.innerText = `${propulsion.name} [+${propulsion.boost}] (Cost: ${propulsion.cost})`
            button.addEventListener("click", () => this.#handleClick(propulsion.name))
            this.#upgradeEle.appendChild(button)
        })

        app.appendChild(this.#upgradeEle)
    }

    // Display a temporary error message
    #showErrorMessage(message: string) {
        const errorBox = document.createElement("div")
        errorBox.innerText = message
        errorBox.style.color = "white"
        errorBox.style.backgroundColor = "red"
        errorBox.style.fontWeight = "bold"

        this.#upgradeEle.appendChild(errorBox)

        setTimeout(() => {
            if (this.#upgradeEle.contains(errorBox))
                this.#upgradeEle.removeChild(errorBox)
        }, 3000)
    }

    // Handle upgrade purchase attempt and display errors if any
    async #handleClick(name: string) {
        try {
            await this.#upgradeController.handleClick(name)
        } catch (e) {
            if (e instanceof InsufficientDistanceException) {
                this.#showErrorMessage("Insufficient distance to purchase this upgrade!")
            } else {
                console.error(`Unexpected error: ${e}`)
            }
        }
    }
}
