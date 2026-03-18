import Autopilot from "../model/autopilot";
import Propulsion from "../model/propulsion"
import Ship from "../model/ship";
import ShipView from "../view/shipView";

// Manages the core game state, including thrusters and autonomous actions
export default class ShipController {
    #ship!: Ship;
    #shipView!: ShipView;
    #automationId!: number;

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
    }

    // Fire thrusters to manually gain distance
    engageThrusters() {
        this.#ship.engageThrusters()
    }

    // Install a new propulsion upgrade
    installUpgrade(upgrade: Propulsion) {
        this.#ship.installUpgrade(upgrade)
    }

    // Install a new autopilot
    installAutopilot(autopilot: Autopilot) {
        this.#ship.installAutopilot(autopilot)
    }

    // Start the interval for passive thrust generation
    #engageAutopilots() {
        return setInterval(() => {
            this.#ship.applyPassiveThrust();
        }, 1000);
    }
}
