import assert from "../util/assertions"
import db from "./connection"

export default class Autopilot {
    readonly #name: string
    #passiveThrust: number
    #cost: number

    constructor(name: string, passiveThrust: number, cost: number) {
        this.#name = name
        this.#passiveThrust = passiveThrust
        this.#cost = cost
        this.#checkInvariant()
    }

    name(): string {
        return this.#name
    }

    passiveThrust(): number {
        return this.#passiveThrust
    }

    cost(): number {
        return this.#cost
    }

    static async getAutopilotsInventory(): Promise<Array<Autopilot>> {
        const allAutopilots = new Array<Autopilot>()

        let results = await db()
        .query<{
            name: string,
            passive_thrust: number,
            cost: number
        }>("select * from autopilot_inventory");

        results.rows.forEach(row => {
            let autopilot = new Autopilot(row.name, row.passive_thrust, row.cost);
            allAutopilots.push(autopilot);
        });

        return allAutopilots
    }

    static async getAutopilot(name: string): Promise<Autopilot | null> {
        let results = await db()
        .query<{
            name: string,
            passive_thrust: number,
            cost: number
        }>("select * from autopilot_inventory where name = $1", [name]);

        if (results.rows.length === 0) {
            return null; 
        }

        const row = results.rows[0]
        const autopilot = new Autopilot(row.name, row.passive_thrust, row.cost);

        return autopilot 
    }

    #checkInvariant() {
        assert(this.#passiveThrust > 0, "passiveThrust must be greater than zero.")
        assert(this.#cost > 0, "cost must be greater than zero.")
    }
}
