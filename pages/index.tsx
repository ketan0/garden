import AtomCard, { AtomInfo } from '../components/AtomCard'
import axios from 'axios'
import { useState, useEffect, ChangeEvent } from 'react';

function IndexPage() {
  const [query, setQuery] = useState("")
  const [searchResults, setSearchResults] = useState<AtomInfo[]>()
  useEffect(() => {
    const getResults = async () => {
      const results = await axios.get('/api/search', {
        params: { query }
      })
      setSearchResults(results.data)
    }
    getResults()
  }, [query])

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  return (
    <div className="container">
      <input type="text" value={query} onChange={handleQueryChange} />
      {searchResults && searchResults.map(({ id, title, contents }) => (
        <AtomCard
          id={id}
          title={title}
          contents={contents}
          key={id}
        />
      ))}
    </div>
  )
}

export default IndexPage
