import Autopilot from "../model/autopilot"
import Propulsion from "../model/propulsion"
import Ship from "../model/ship"
import ShipView from "../view/shipView"
import AIController from "./aiController"

// Manages the core game state, including thrusters and autonomous actions
export default class ShipController {
    #ship!: Ship;
    #shipView!: ShipView;
    #automationId!: number;
    #aiController!: AIController

    #pilotName: string;
    #distanceTravelled: number;

    constructor(pilotName: string, distanceTravelled: number) {
        this.#pilotName = pilotName;
        this.#distanceTravelled = distanceTravelled;
    }

    // Load ship data and start the game loop
    async initialize() {

        const [installedUpgrades, activeAutopilots] = await Promise.all([
            Propulsion.installedPropulsions(this.#pilotName),
            Autopilot.activeAutopilots(this.#pilotName)
        ]);

        this.#ship = new Ship(
            this.#pilotName, 
            this.#distanceTravelled, 
            installedUpgrades, 
            activeAutopilots
        );
        
        this.#shipView = new ShipView(this.#ship, this);
        this.#automationId = this.#engageAutopilots();
        this.#aiController = new AIController(this.#ship, this)
        await this.#aiController.initialize()
    }

    // Fire thrusters to manually gain distance
    engageThrusters() {
        this.#ship.engageThrusters()
    }

    // Install a new propulsion upgrade
    installUpgrade(upgrade: Propulsion) {
        this.#ship.installUpgrade(upgrade)
        // this block won't run if the above fails meanin the current state won't change
        this.#aiController.updateCurrentState(upgrade)
    }

    // Install a new autopilot
    installAutopilot(autopilot: Autopilot) {
        this.#ship.installAutopilot(autopilot)
        // this block won't run if the above fails meanin the current state won't change
        this.#aiController.updateCurrentState(autopilot)
    }

    // Start the interval for passive thrust generation
    #engageAutopilots() {
        return setInterval(() => {
            this.#ship.applyPassiveThrust();
        }, 1000);
    }
}
