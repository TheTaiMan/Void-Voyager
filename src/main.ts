/**
 * This file is responsible for instantiating the main controllers, which in turn
 * initialize the models and views required to run the game.
 */

import ShipController from "./controller/shipController"
import UpgradeController from "./controller/upgradeController"

// This triggers the creation of the Ship model and the ShipView.
const shipController = new ShipController()

// We pass the shipController dependency so upgrades can be applied to the ship.
const upgradeController = new UpgradeController(shipController)

