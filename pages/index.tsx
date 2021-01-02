import AtomCard from '../components/AtomCard'
import Nav from '../components/Nav'
import axios from 'axios'
import { useState, useEffect, ChangeEvent } from 'react';
import { AtomInfo } from '../types';

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
    <>
      <Nav />
      <div className="bg-gray-50">
        <input
          className="py-3 px-4 bg-white rounded-lg placeholder-gray-400 text-gray-900 appearance-none w-1/2 shadow-md focus:outline-none focus:ring-2 focus:ring-blue-600 m-2"
          placeholder="Pick my brain"
          value={query}
          onChange={handleQueryChange}
        />
        {searchResults && searchResults.map(({ id, title, contents }) => (
          <AtomCard
            id={id}
            title={title}
            contents={contents}
            key={id}
          />
        ))}
      </div>
    </>
  )
}

export default IndexPage
