require('dotenv').config()
import { NextApiRequest, NextApiResponse } from 'next'
import Neo4jDriver from '../../utils/neo4j-driver'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const query = req.query.query as string
    const { records } = await Neo4jDriver.run(
      'MATCH (n:Atom) WHERE toLower(n.title) CONTAINS toLower($query) OR toLower(n.contents) CONTAINS toLower($query) RETURN n.id as id, n.title as title, n.contents as contents',
      { query }
    )
    const recordsClean = records.map((record: Map<string, string>) => ({
      id: record.get('id'),
      title: record.get('title'),
      contents: record.get('contents')
    }))
    res.status(200).json(recordsClean)
  } catch (err) {
    console.log(err.message)
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
