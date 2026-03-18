import assert from "../util/assertions"
import db from "./connection"

// Represents an autopilot that generates passive thrust
export default class Autopilot {
    readonly #name: string
    #passiveThrust: number
    #cost: number
    #id?: number

    constructor(name: string, passiveThrust: number, cost: number, id: number | undefined = undefined) {
        this.#name = name
        this.#passiveThrust = passiveThrust
        this.#cost = cost
        this.#checkInvariant()
        this.#id = id
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

    // Fetch all available autopilots from database
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

    // Fetch a single autopilot by name from database
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

    // Fetch active autopilots installed on a specific ship
    static async activeAutopilots(pilotName: string) {
        const autopilots = new Array<Autopilot>()

        let results = await db()
            .query<{
                id: number
                name: string,
                passive_thrust: number,
                cost: number
            }>(
                `SELECT id, name, passive_thrust, cost
                FROM autopilot WHERE ship_id = $1`, 
                [pilotName]
            );

        results.rows.forEach( (row) => {
            let propulsion = new Autopilot(row.name, row.passive_thrust, row.cost, row.id)
            autopilots.push(propulsion)
        })

        return autopilots
    }

    // Save an installed autopilot to the database
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

    // Ensure autopilot properties are valid
    #checkInvariant() {
        assert(this.#passiveThrust > 0, "passiveThrust must be greater than zero.")
        assert(this.#cost > 0, "cost must be greater than zero.")
    }
}
