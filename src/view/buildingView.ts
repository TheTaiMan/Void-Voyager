import type BuildingController from "../controller/buildingController"
import type Autopilot from "../model/autopilot";
import { InsufficientDistanceException } from "../model/ship";

export default class BuildingView {
    #buildingController: BuildingController
    #buildingEle: HTMLDivElement

    constructor(buildingController: BuildingController, inventoryPromise: Promise<Array<Autopilot>>) {
        this.#buildingController = buildingController
        this.#buildingEle = document.createElement("div")

        inventoryPromise.then((autopilots) => {
            this.#renderButtons(autopilots)
        })
    }

    #renderButtons(autopilots: Array<Autopilot>) {
        const app = document.querySelector("#app")!

        this.#buildingEle.id = "buildings"

        const heading = document.createElement("h4")
        heading.textContent = "🤖 Autopilots"
        this.#buildingEle.appendChild(heading)

        autopilots.forEach(autopilot => {
            const button = document.createElement("button")
            button.innerText = `${autopilot.name} [x${autopilot.passiveThrust}] (Cost: ${autopilot.cost})`
            button.addEventListener("click", () => this.#handleClick(autopilot.name))
            this.#buildingEle.appendChild(button)
        })

        app.appendChild(this.#buildingEle)
    }

    #showErrorMessage(message: string) {
        const errorBox = document.createElement("div")
        errorBox.innerText = message
        errorBox.style.color = "white"
        errorBox.style.backgroundColor = "red"
        errorBox.style.fontWeight = "bold"

        this.#buildingEle.appendChild(errorBox)

        setTimeout(() => {
            if (this.#buildingEle.contains(errorBox))
                this.#buildingEle.removeChild(errorBox)
        }, 3000)
    }

    async #handleClick(name: string) {
        try {
            await this.#buildingController.handleClick(name)
        } catch (e) {
            if (e instanceof InsufficientDistanceException) {
                this.#showErrorMessage("Insufficient distance to purchase this autopilot!")
            } else {
                console.error(`Unexpected error: ${e}`)
            }
        }
    }
}
