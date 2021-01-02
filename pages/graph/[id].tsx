import Nav from '../../components/Nav'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from "react"
import { SimLink, SimNode } from "../../types";
import axios from 'axios'
import useForceGraph from '../../hooks/useForceGraph';
import Link from 'next/Link';
import AtomGraph from '../../components/AtomGraph';

const GraphSearchPage = () => {
  const router = useRouter()
  const [atomNodes, setAtomNodes] = useState<SimNode[]>([])
  const [atomLinks, setAtomLinks] = useState<SimLink[]>([])
  const { id } = router.query
  // TODO: it seems to be re-rendering a ton (even once animation done)
  useEffect(() => {
    const getResults = async () => {
      const results = await axios.get('/api/getAtomAndChildren', {
        params: { atomId: id }
      })
      const { children, parent, atom }: { children: SimNode[], parent?: SimNode, atom: SimNode } = results.data
      const newAtomNodes = [...children, atom]
      parent && newAtomNodes.push(parent)
      setAtomNodes(newAtomNodes)
      const newAtomLinks: SimLink[] = children.map(child => ({ source: child, target: atom }))
      parent && newAtomLinks.push({ source: parent, target: atom })
      setAtomLinks(newAtomLinks)
    }
    if (id) {
      getResults()
    }
  }, [id])

  const { nodes, links, ref, width, height } = useForceGraph({
    nodesData: atomNodes,
    linksData: atomLinks,
    idAccessor: d => d.id
  });
  return (
    <div className="h-screen">
      <Nav />
      {id &&
        <Link href={`/atoms/${id}`}>
          <a>Atom View</a>
        </Link>}
      <AtomGraph nodes={nodes} links={links} ref={ref} width={width} height={height} />
    </div>
  )
}

export default GraphSearchPage;
