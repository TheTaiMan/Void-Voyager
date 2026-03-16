import db from "./model/connection"
import ddl from "../create-table.sql?raw"

import ShipController from "./controller/shipController"
import UpgradeController from "./controller/upgradeController"
import BuildingController from "./controller/buildingController";


const main = async () => {
    db().exec(ddl);
    // This triggers the creation of the Ship model and the ShipView.
    const shipController = new ShipController("jeff", "ffej", 0)
    await shipController.initialize()

    // We pass the shipController dependency so upgrades can be applied to the ship.
    const upgradeController = new UpgradeController(shipController)
    const buildingController = new BuildingController(shipController)
}

main()

