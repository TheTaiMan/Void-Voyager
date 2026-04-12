import type AIController from "../controller/aiController"
import type Listener from "../model/listener"

// Renders the auto-buy toggle button
export default class AIView implements Listener {
    #aiController: AIController
    #aiEle: HTMLDivElement
    #button: HTMLButtonElement

    constructor(aiController: AIController) {
        this.#aiController = aiController
        this.#aiEle = document.createElement("div")
        this.#button = document.createElement("button")
        this.#renderButton()
    }

    #renderButton() {
        const app = document.querySelector("#app")!
        
        this.#aiEle.id = "ai-controls"
        
        const heading = document.createElement("h4")
        heading.textContent = "AI Auto Buy"
        this.#aiEle.appendChild(heading)

        // AI defaults to Off when instantiated
        this.#button.innerText = "Enable Auto Buy"
        this.#button.addEventListener("click", () => {
            this.#aiController.toggle()
        })
        
        this.#aiEle.appendChild(this.#button)
        app.appendChild(this.#aiEle)
    }

    notify() {
        const isNowOn = this.#aiController.isOn
        this.#button.innerText = isNowOn ? "Disable Auto Buy" : "Enable Auto Buy"
    }
}
