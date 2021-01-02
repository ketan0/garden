import Nav from '../../components/Nav'
import { useRouter } from 'next/router'
import Link from 'next/Link'
import axios from 'axios';
import { useState, useEffect } from 'react';
import AtomCard from '../../components/AtomCard'
import { AtomInfo } from '../../types';

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


  return (
    <div>
      <Nav />
      {id &&
        <Link href={`/graph/${id}`}>
          <a>Graph View</a>
        </Link>}
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
      {atom &&
        <div className="ml-10">
          <h1>Atom:</h1>

          <AtomCard id={atom.id} title={atom.title} contents={atom.contents} isActive />
        </div>
      }
      {atomChildren && atomChildren.length > 0 &&
        (<div className="ml-20">
          <h1>Children:</h1>
          {atomChildren.map(({ id, title, contents }) => (
            <AtomCard
              id={id}
              title={title}
              contents={contents}
              key={id}
            />
          ))}
        </div>)
      }
    </div>
  )
}

export default AtomPage
