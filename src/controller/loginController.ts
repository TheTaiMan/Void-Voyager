/**
 * Orchestrates the login/registration flow. Creates the LoginView,
 * validates credentials against the DB, and bootstraps the full
 * application once authenticated.
 */

import Ship from "../model/ship"
import LoginView from "../view/loginView"
import ShipController from "./shipController"
import UpgradeController from "./upgradeController"
import BuildingController from "./buildingController"

export default class LoginController {
    #loginView: LoginView

    constructor() {
        this.#loginView = new LoginView((pilotName, password, isNewAccount) => {
            this.#handleSubmit(pilotName, password, isNewAccount)
        })
    }

    async #handleSubmit(pilotName: string, password: string, isNewAccount: boolean) {
        if (!pilotName || !password) {
            this.#loginView.showError('Pilot name and password are required.')
            return
        }

        this.#loginView.setLoading()

        if (isNewAccount) {
            await this.#register(pilotName, password)
        } else {
            await this.#login(pilotName, password)
        }
    }

    async #register(pilotName: string, password: string) {
        const registered = await Ship.register(pilotName, password)

        if (!registered) {
            this.#loginView.showError('Pilot name already taken.')
            return
        }

        await this.#startApp(pilotName, 0)
    }

    async #login(pilotName: string, password: string) {
        const credentials = await Ship.authenticate(pilotName, password)

        if (!credentials) {
            this.#loginView.showError('Invalid pilot name or password.')
            return
        }

        await this.#startApp(credentials.pilotName, credentials.distanceTraveled)
    }

    async #startApp(pilotName: string, distanceTraveled: number) {
        this.#loginView.destroy()

        const shipController = new ShipController(pilotName, distanceTraveled)
        await shipController.initialize()

        const upgradeController = new UpgradeController(shipController)
        const buildingController = new BuildingController(shipController)
    }
}
