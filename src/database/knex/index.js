import * as config from "../../../knexfile.js"
import knex from "knex"

const connection = knex(config.default.development)

export default connection