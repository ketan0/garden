import neo4j from 'neo4j-driver'
import { Parameters } from "neo4j-driver/types/query-runner"
import Result from "neo4j-driver/types/result"

// put these in a .env file at the project root
const uri = process.env.NEO4J_DB_URI
const user = process.env.NEO4J_DB_USER
const password = process.env.NEO4J_DB_PASS

const Neo4jDriver = {
  run: async (cmd: string, params?: Parameters): Promise<Result> => {
    if (!uri || !user || !password) {
      throw Error("Neo4j URI, DB, and/or password not set correctly.")
    }
    const _driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
    const session = _driver.session()
    let result;
    try {
      result = await session.run(cmd, params)
    } catch (error) {
      throw Error(`unable to execute query. ${error}`)
    } finally {
      await session.close()
    }

    await _driver.close()
    return result
  }

}

// ... on application exit:

export default Neo4jDriver
