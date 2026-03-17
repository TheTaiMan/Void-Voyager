import Autopilot from "../model/autopilot";
import Propulsion from "../model/propulsion"
import Ship from "../model/ship";
import ShipView from "../view/shipView";

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

    engageThrusters() {
        this.#ship.engageThrusters()
    }

    installUpgrade(upgrade: Propulsion) {
        this.#ship.installUpgrade(upgrade)
    }

    installAutopilot(autopilot: Autopilot) {
        this.#ship.installAutopilot(autopilot)
    }

    #engageAutopilots() {
        return setInterval(() => {
            this.#ship.applyPassiveThrust();
        }, 1000);
    }
}
