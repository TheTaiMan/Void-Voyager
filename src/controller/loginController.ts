import Ship from "../model/ship"
import LoginView from "../view/loginView"
import ShipController from "./shipController"
import UpgradeController from "./upgradeController"
import BuildingController from "./buildingController"

// Handles login and registration, creates the LoginView and checks credentials against the database
export default class LoginController {
    #loginView: LoginView

    constructor() {
        this.#loginView = new LoginView((pilotName, password, isNewAccount) => {
            this.#handleSubmit(pilotName, password, isNewAccount)
        })
    }

    // Process login or registration attempt
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

    // Register a new pilot
    async #register(pilotName: string, password: string) {
        const registered = await Ship.register(pilotName, password)

        if (!registered) {
            this.#loginView.showError('Pilot name already taken.')
            return
        }

        await this.#startApp(pilotName, 0)
    }

    // Authenticate an existing pilot
    async #login(pilotName: string, password: string) {
        const credentials = await Ship.authenticate(pilotName, password)

        if (!credentials) {
            this.#loginView.showError('Invalid pilot name or password.')
            return
        }

        await this.#startApp(credentials.pilotName, credentials.distanceTraveled)
    }

    // Launch main application after successful login
    async #startApp(pilotName: string, distanceTraveled: number) {
        this.#loginView.destroy()

        const shipController = new ShipController(pilotName, distanceTraveled)
        await shipController.initialize()

        const upgradeController = new UpgradeController(shipController)
        const buildingController = new BuildingController(shipController)
    }
}
