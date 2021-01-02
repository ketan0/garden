import { SimulationLinkDatum, SimulationNodeDatum, forceCenter, ForceLink, forceLink, forceManyBody, forceSimulation } from "d3-force"
import { useEffect, useRef, useState } from "react"
import useResizeObserver from "use-resize-observer";
import { ForceGraphProps, PositionedLink, PositionedNode, UseForceGraphOptions, UseForceGraphOptionsStrict } from "../types";

const applyDefaults = <
  NodeDatum extends SimulationNodeDatum,
  LinkDatum extends SimulationLinkDatum<NodeDatum>
>(props: UseForceGraphOptions<NodeDatum, LinkDatum>): UseForceGraphOptionsStrict<NodeDatum, LinkDatum> => {
  const {
    linkDistance = 300,
    chargeStrength = -800,
    ...rest
  } = props

  return {
    ...rest,
    linkDistance,
    chargeStrength
  }
}

const isPositioned = <T,>(obj: any): obj is PositionedNode<T> =>
  obj.x !== undefined && obj.y !== undefined


const arePositioned = <T,>(obj?: any[]): obj is PositionedNode<T>[] =>
  obj && obj.reduce((prev, curr) => prev && isPositioned(curr), true)

const arePositionedLinks = <T,>(obj?: any[]): obj is PositionedLink<T>[] =>
  obj && obj.reduce((prev, curr) => prev && isPositioned(curr.source) && isPositioned(curr.target), true)

const useForceGraph = <
  NodeDatum extends SimulationNodeDatum,
  LinkDatum extends SimulationLinkDatum<NodeDatum>
>
  (
    props: UseForceGraphOptions<NodeDatum, LinkDatum>
  ): ForceGraphProps<PositionedNode<NodeDatum>, PositionedLink<LinkDatum>> => {
  const [nodes, setNodes] = useState<NodeDatum[]>()
  const [links, setLinks] = useState<LinkDatum[]>()
  const frameRef = useRef<number>();
  const { ref, width = 200, height = 200 } = useResizeObserver<HTMLDivElement>()
  const fullyDefinedProps = applyDefaults(props)
  const { nodesData, linksData, idAccessor, linkDistance, chargeStrength } = fullyDefinedProps
  if (linksData.length) console.log('linksData is defined out here')
  useEffect(() => {
    if (linksData.length) console.log('linksData is defined in here')
    if (!nodesData.length || !linksData.length) return;
    const simulation = forceSimulation<NodeDatum, LinkDatum>(nodesData)
      .force("link", forceLink<NodeDatum, LinkDatum>(linksData)
        .id(idAccessor)
        .distance(linkDistance)
      )
      .force("charge", forceManyBody().strength(chargeStrength))
      .force("center", forceCenter(width / 2, height / 2));
    simulation.on('tick', () => {
      frameRef.current = requestAnimationFrame(() => {
        const newNodes = simulation.nodes()
        const newLinks = simulation.force<ForceLink<NodeDatum, LinkDatum>>('link')!.links()
        setNodes([...newNodes])
        setLinks([...newLinks])
      })
    })

    // on teardown, cancel animation frame
    return () => {
      simulation.on('tick', null)
      frameRef.current && cancelAnimationFrame(frameRef.current)
    }
  }, [nodesData, linksData, width, height])

  return {
    nodes: arePositioned<NodeDatum>(nodes) ? nodes : undefined,
    links: arePositionedLinks<LinkDatum>(links) ? links : undefined,
    ref,
    width,
    height
  }
}

export default useForceGraph
