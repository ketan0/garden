import Link from 'next/link'
import Layout from '../components/Layout'
import axios from 'axios'
import { useState, useEffect } from 'react';

function IndexPage () {
    const [query, setQuery] = useState("")
    const [searchResults, setSearchResults] = useState()
    useEffect(() => {
        const getResults = async () => {
            const results = await axios.get('/api/search', {
                params: { query }
            })
            console.log(JSON.stringify(results))
            setSearchResults(results.data)
        }
        getResults()
    }, [query])

    const handleQueryChange = (event) => {
        setQuery(event.target.value)
    }

    return (
        <div>
        <input type="text" value={query} onChange={handleQueryChange} />
        {searchResults && searchResults.map(result => (
            <div className="card" key={result}>
                <div className="container">
                    <h4><b>John Doe</b></h4>
                    <p>{result}</p>
                </div>
            </div>
        ))}
        </div>
    )
}

export default IndexPage
