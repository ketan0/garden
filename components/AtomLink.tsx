import { PositionedLink, SimLink } from "../types"

const AtomLink = ({ source: { x: xs, y: ys, id: ids }, target: { x: xt, y: yt, id: idt } }: PositionedLink<SimLink>) => {
  return <line x1={xs} y1={ys} x2={xt} y2={yt} key={ids + idt} stroke="black" />
}

export default AtomLink
