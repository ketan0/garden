import { NextApiRequest, NextApiResponse } from 'next'
import { sampleSearchData } from '../../utils/sample-search-data'

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!Array.isArray(sampleSearchData)) {
      throw new Error('Cannot find user data')
    }
    const query = req.query.query as string
    res.status(200).json(sampleSearchData.filter(item => item.includes(query)))
  } catch (err) {
    res.status(500).json({ statusCode: 500, message: err.message })
  }
}

export default handler
