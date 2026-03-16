import assert from "../util/assertions"
import db from "./connection"

export default class Autopilot {
    #id?: number
    readonly #name: string
    #passiveThrust: number
    #cost: number

    constructor(name: string, passiveThrust: number, cost: number) {
        this.#name = name
        this.#passiveThrust = passiveThrust
        this.#cost = cost
        this.#checkInvariant()
    }

    get id() {
        return this.#id
    }

    set id(newVal: number | undefined) {
        this.#id = newVal
    }

    get name(): string {
        return this.#name
    }

    get passiveThrust(): number {
        return this.#passiveThrust
    }

    get cost(): number {
        return this.#cost
    }

    static async getAutopilotsInventory(): Promise<Array<Autopilot>> {
        const allAutopilots = new Array<Autopilot>()

        let results = await db()
        .query<{
            name: string,
            passive_thrust: number,
            cost: number
        }>("SELECT * FROM autopilot_inventory");

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
        }>("SELECT * FROM autopilot_inventory WHERE name = $1", [name]);

        if (results.rows.length === 0) {
            return null; 
        }

        const row = results.rows[0]
        const autopilot = new Autopilot(row.name, row.passive_thrust, row.cost);

        return autopilot 
    }

    static async save(autopilot: Autopilot, pilot_name: string) {
        let result = await db()
            .query<{id: number}>
                (
                `INSERT INTO autopilot(name, passive_thrust, cost, ship_id)
                    VALUES($1, $2, $3, $4) 
                    RETURNING id`,
                    [autopilot.name, autopilot.passiveThrust, autopilot.cost, pilot_name]
                )

        autopilot.id = result.rows[0].id
    }

    #checkInvariant() {
        assert(this.#passiveThrust > 0, "passiveThrust must be greater than zero.")
        assert(this.#cost > 0, "cost must be greater than zero.")
    }
}
