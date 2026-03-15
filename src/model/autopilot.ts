import assert from "../util/assertions"
import db from "./connection"

export default class Autopilot {
    readonly #name: string
    #passiveVelocity: number
    #cost: number

    constructor(name: string, passiveVelocity: number, cost: number) {
        this.#name = name
        this.#passiveVelocity = passiveVelocity
        this.#cost = cost
        this.#checkInvariant()
    }

    name(): string {
        return this.#name
    }

    passiveVelocity(): number {
        return this.#passiveVelocity
    }

    cost(): number {
        return this.#cost
    }

    static async getAutopilotsInventory(): Promise<Array<Autopilot>> {
        const allAutopilots = new Array<Autopilot>()

        let results = await db()
        .query<{
            name: string,
            passive_velocity: number,
            cost: number
        }>("select * from autopilot_inventory");

        results.rows.forEach(row => {
            let autopilot = new Autopilot(row.name, row.passive_velocity, row.cost);
            allAutopilots.push(autopilot);
        });

        return allAutopilots
    }

    static async getAutopilot(name: string): Promise<Autopilot | null> {
        let results = await db()
        .query<{
            name: string,
            passive_velocity: number,
            cost: number
        }>("select * from autopilot_inventory where name = $1", [name]);

        if (results.rows.length === 0) {
            return null; 
        }

        const row = results.rows[0]
        const autopilot = new Autopilot(row.name, row.passive_velocity, row.cost);

        return autopilot 
    }

    #checkInvariant() {
        assert(this.#passiveVelocity > 0, "passiveVelocity must be greater than zero.")
        assert(this.#cost > 0, "cost must be greater than zero.")
    }
}
