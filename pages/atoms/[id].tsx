import { useRouter } from 'next/router'
import axios from 'axios';
import { useState, useEffect } from 'react';
import AtomCard, { AtomInfo } from '../../components/AtomCard'

const AtomPage = () => {
  const router = useRouter()
  const [atom, setAtom] = useState<AtomInfo>()
  const [atomParent, setAtomParent] = useState<AtomInfo>()
  const [atomChildren, setAtomChildren] = useState<AtomInfo[]>()
  const { id } = router.query
  useEffect(() => {
    const getResults = async () => {
      try {
        const results = await axios.get('/api/getAtomAndChildren', {
          params: { atomId: id }
        })
        console.log('results:')
        console.log(JSON.stringify(results, undefined, 2))
        if (results.status != 200) {
          console.error(results.data.message)
        } else {
          setAtom(results.data.atom)
          setAtomChildren(results.data.children)
          setAtomParent(results.data.parent)
        }
      } catch (error) {
        console.log('Error', error.message);
      }
    }
    if (id) {
      getResults()
    }
  }, [id])

  console.log(`id in page: ${id}`)
  return (
    <div>
      <h1>Atom:</h1>
      {atom && <AtomCard id={atom.id} title={atom.title} contents={atom.contents} />}
      {atomParent &&
        <>
          <h1>Parent:</h1>
          <AtomCard
            id={atomParent.id}
            title={atomParent.title}
            contents={atomParent.contents}
            key={atomParent.id}
          />
        </>
      }
      {atomChildren && atomChildren.length > 0 &&
        <>
          <h1>Children:</h1>
          {atomChildren.map(({ id, title, contents }) => (
            <AtomCard
              id={id}
              title={title}
              contents={contents}
              key={id}
            />
          ))}
        </>

      }
    </div>
  )
}

export default AtomPage
