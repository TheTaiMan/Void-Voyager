import assert from "../util/assertions"
import db from "./connection"

export default class Propulsion{
    readonly #name: string
    #bost: number
    #cost: number

    constructor(name: string, bost: number, cost: number) {
        this.#name = name
        this.#bost = bost
        this.#cost = cost
        this.#checkInvariant()
    }

    name(): string {
        return this.#name
    }

    boost(): number {
        return this.#bost
    }

    cost(): number {
        return this.#cost
    }

    static async getPropulsionInventory(): Promise<Array<Propulsion>> {
        const allPropulsions = new Array<Propulsion>()

        let results = await db()
        .query<{
            name: string,
            boost: number,
            cost: number
        }>("select * from propulsion_inventory");

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
        }>("select * from propulsion_inventory where name = $1", [name]);

        if (results.rows.length === 0) {
            return null; 
        }

        const row = results.rows[0]
        const propulsion = new Propulsion(row.name, row.boost, row.cost);

        return propulsion 
    }

    #checkInvariant() {
        assert(this.#bost > 0, "bost must be greater than zero.")
        assert(this.#cost > 0, "cost must be greater than zero.")
    }
}

