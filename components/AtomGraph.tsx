import React, { forwardRef } from "react";
import { ForceGraphProps, PositionedLink, PositionedNode, SimLink, SimNode } from "../types";
import AtomLink from "./AtomLink";
import AtomNode from "./AtomNode";
import Spinner from "./Spinner";
import ZoomableSVGGroup from "./ZoomableSVGGroup";

const AtomGraph = forwardRef<HTMLDivElement, ForceGraphProps<PositionedNode<SimNode>, PositionedLink<SimLink>>>(({ nodes, links, width, height }, ref) => {
  if (!nodes || !links) return <Spinner />
  return (
    <div className="h-5/6" ref={ref}>
      <svg className="border-4 border-light-blue-500" width={width} height={height}>
        <ZoomableSVGGroup width="100%" height="100%">
          {links.map(link => <AtomLink key={link.source.id + ' ' + link.target.id} {...link} />)}
          {nodes.map(node => <AtomNode key={node.id} {...node} />)}
        </ZoomableSVGGroup>
      </svg >
    </div>
  )
})

// {nodes.map(({ x, y, id, title, contents }) =>
//   (<g key={id}>
//     <circle cx={x} cy={y} r={80} stroke="black" fill="white" />
//     <text x={x} y={y} textAnchor="middle">{title + '\n\n' + contents}</text>
//   </g>))}

export default AtomGraph;
