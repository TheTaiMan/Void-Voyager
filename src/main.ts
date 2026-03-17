import db from "./model/connection"
import ddl from "../create-table.sql?raw"

import LoginController from "./controller/loginController"

const startApp = () => {
    new LoginController(startApp)
}

const main = async () => {
    db().exec(ddl)
    startApp()
}

main()
