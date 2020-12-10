require('dotenv').config()
import { NextApiRequest, NextApiResponse } from 'next'
import Neo4jDriver from '../../utils/neo4j-driver'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const id = req.query.atomId as string
    console.log(`id in handler: ${id}`)
    const { records } = await Neo4jDriver.run(
      'MATCH (atom:Atom {id: $id}) RETURN atom.id, atom.title, atom.contents',
      { id }
    )
    if (records.length == 0) {
      res.status(400).send({ message: `Atom with id "${id}" not found"` })
      return
    }
    if (records.length > 1) {
      res.status(400).send({ message: `More than one atom with id ${id} found. Check integrity of neo4j db` })
      return
    }
    const atomRecord = records[0]
    const atomRecordClean = {
      id: atomRecord.get('atom.id'),
      title: atomRecord.get('atom.title'),
      contents: atomRecord.get('atom.contents')
    }

    const { records: childRecords } = await Neo4jDriver.run(
      'MATCH (atom:Atom {id: $id})<-[:CHILD_OF]-(child) RETURN child.id, child.title, child.contents',
      { id }
    )
    const childRecordsClean = childRecords.map((record: Map<string, string>) => ({
      id: record.get('child.id'),
      title: record.get('child.title'),
      contents: record.get('child.contents')
    }))

    const { records: parentRecords } = await Neo4jDriver.run(
      'MATCH (parent:Atom)<-[:CHILD_OF]-(atom {id: $id}) RETURN parent.id, parent.title, parent.contents',
      { id }
    )
    let parentRecordClean;
    if (parentRecords.length > 0) {
      const parentRecord = parentRecords[0]
      parentRecordClean = {
        id: parentRecord.get('parent.id'),
        title: parentRecord.get('parent.title'),
        contents: parentRecord.get('parent.contents')
      }
    }
    res.status(200).json({ atom: atomRecordClean, children: childRecordsClean, parent: parentRecordClean })
  } catch (err) {
    console.error(err.message)
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
