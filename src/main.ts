import db from "./model/connection"
import ddl from "../create-table.sql?raw"

import LoginController from "./controller/loginController"

// Start the application by instantiating the login controller
const startApp = () => {
    new LoginController()
}

// Main entry point to initialize database and start the app
const main = async () => {
    db().exec(ddl)
    startApp()
}

main()
