import neo4j from 'neo4j-driver'
import { Parameter } from 'neo4j-driver';
import { NEO4J_DB_URI } from './constants';

const uri = NEO4J_DB_URI
const user = process.env.NEO4J_DB_USER
const password = process.env.NEO4J_DB_PASS
console.log(user)
console.log(password)

const Neo4jDriver = {
  run: async (cmd: string, params?: Parameter): Promise<neo4j.Result> => {
    const _driver = neo4j.driver(uri, neo4j.auth.basic(user, password))
    const session = _driver.session()
    let result;
    try {
      console.log(`Running ${cmd}`)
      console.log(`With params: ${JSON.stringify(params)}`)
      result = await session.run(cmd, params)
      console.log(`got result: ${JSON.stringify(result, undefined, 2)}`)
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
