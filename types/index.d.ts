import { SimulationLinkDatum, SimulationNodeDatum } from 'd3';

interface AtomInfo {
  id: string
  title: string
  contents: string
}

interface AtomCardInfo extends AtomInfo {
  isActive?: boolean
}

interface SimNode extends SimulationNodeDatum, AtomInfo { }

interface SimLink extends SimulationLinkDatum<SimNode> {
  source: SimNode;
  target: SimNode;
}

interface ForceGraphProps<NodeDatum extends SimulationNodeDatum, LinkDatum extends SimulationLinkDatum> {
  nodes?: NodeDatum[];
  links?: LinkDatum[];
  ref: RefObject
  width: number;
  height: number
}

interface UseForceGraphOptions<NodeDatum extends SimulationNodeDatum, LinkDatum extends SimulationLinkDatum> {
  nodesData: NodeDatum[]
  linksData: LinkDatum[]
  idAccessor: (node: NodeDatum, i: number, nodesData: NodeDatum[]) => string
  linkDistance?: number
  chargeStrength?: number
}

interface UseForceGraphOptionsStrict<NodeDatum extends SimulationNodeDatum, LinkDatum extends SimulationLinkDatum> extends UseForceGraphOptions<NodeDatum, LinkDatum> {
  linkDistance: number
  chargeStrength: number
}

interface PositionedNode<NodeDatum extends SimulationNodeDatum> extends NodeDatum {
  x: number;
  y: number;
}

interface PositionedLink<LinkDatum extends SimulationLinkDatum> extends LinkDatum {
  source: PositionedNode;
  target: PositionedNode;
}
