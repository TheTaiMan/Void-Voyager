import assert from "../util/assertions"
import db from "./connection"

export default class Propulsion{
    readonly #name: string
    #bost: number
    #cost: number
    #id?: number

    constructor(name: string, bost: number, cost: number, id: number | undefined = undefined) {
        this.#name = name
        this.#bost = bost
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

    get boost(): number {
        return this.#bost
    }

    get cost(): number {
        return this.#cost
    }

    static async getPropulsionInventory(): Promise<Array<Propulsion>> {
        const allPropulsions = new Array<Propulsion>()

        let results = await db()
        .query<{
            name: string,
            boost: number,
            cost: number
        }>("SELECT * FROM propulsion_inventory");

        results.rows.forEach(row => {
            let propulsion= new Propulsion(row.name, row.boost, row.cost);
            allPropulsions.push(propulsion);
        });

        return allPropulsions
    }

    static async getPropulsion(name: string): Promise<Propulsion | null> {
        let results = await db()
        .query<{
            name: string,
            boost: number,
            cost: number
        }>("SELECT * FROM propulsion_inventory WHERE name = $1", [name]);

        if (results.rows.length === 0) {
            return null; 
        }

        const row = results.rows[0]
        const propulsion = new Propulsion(row.name, row.boost, row.cost);

        return propulsion 
    }

    static async installedPropulsions(pilotName: string) {
        const propulsions = new Array<Propulsion>()

        let results = await db()
            .query<{
                id: number
                name: string,
                boost: number,
                cost: number
            }>(
                `SELECT id, name, boost, cost
                FROM propulsion WHERE ship_id = $1`, 
                [pilotName]
            );

        results.rows.forEach( (row) => {
            let propulsion = new Propulsion(row.name, row.boost, row.cost, row.id)
            propulsions.push(propulsion)
        })

        return propulsions
    }

    static async save(propulsion: Propulsion, pilot_name: string) {
        let result = await db()
            .query<{id: number}>
                (
                `INSERT INTO propulsion(name, boost, cost, ship_id)
                    VALUES($1, $2, $3, $4) 
                    RETURNING id`,
                    [propulsion.name, propulsion.boost, propulsion.cost, pilot_name]
                )

        propulsion.id = result.rows[0].id
    }

    #checkInvariant() {
        assert(this.#bost > 0, "bost must be greater than zero.")
        assert(this.#cost > 0, "cost must be greater than zero.")
    }
}

