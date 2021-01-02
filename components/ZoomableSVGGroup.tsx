// like, a much simpler version of
// https://github.com/uber/react-vis-force/blob/master/src/components/ZoomableSVGGroup.js

import { useState, MouseEvent } from "react"

//
interface ZoomableSVGGroupProps {
  // scale: number;
  // zoomSpeed: number;
  height: number | string;
  width: number | string;
}

const ZoomableSVGGroup: React.FC<ZoomableSVGGroupProps> = ({ height, width, children }) => {
  const [matrix, setMatrix] = useState([1, 0, 0, 1, 0, 0])
  const [dragging, setDragging] = useState(false)
  const [dragX, setDragX] = useState<number>();
  const [dragY, setDragY] = useState<number>();

  //set dragging to false on mouse up
  // pan on mouse move (if dragging)
  // zoom on mouse wheel
  // TODO: handle touch events too
  // const onWheel = (event: WheelEvent<SVGGElement>) => {
  // }
  const panBy = (deltaX: number, deltaY: number) => {
    //TODO: panLimit
    setMatrix([
      matrix[0],
      matrix[1],
      matrix[2],
      matrix[3],
      matrix[4] + deltaX,
      matrix[5] + deltaY,
    ])
  }

  const onMouseDown = (event: MouseEvent) => {
    if (event.button === 0) {
      setDragging(true);
      setDragX(event.clientX);
      setDragY(event.clientY)
    }
  }

  const stopDrag = (event: MouseEvent) => {
    if (dragX !== undefined && dragY !== undefined && (event.clientX - dragX || event.clientY - dragY)) {
      event.preventDefault(); //prevent link clicks on drag
    }
    setDragging(false);
    setDragX(undefined);
    setDragY(undefined)
  }

  const onMouseMove = (event: MouseEvent) => {
    if (dragging && dragX && dragY) {
      const dx = event.clientX - dragX, dy = event.clientY - dragY;
      if (dx || dy) {
        panBy(dx, dy)
      }
      setDragX(event.clientX);
      setDragY(event.clientY)
    }
  }

  const zoomProps = {
    onMouseDown,
    onMouseUp: stopDrag,
    onMouseLeave: stopDrag,
    onMouseMove,
    transform: `matrix(${matrix.join(' ')})`
  }

  const scale = 1

  return (
    <g {...zoomProps}>
      <rect
        x={-1 * matrix[4]}
        y={-1 * matrix[5]}
        transform={`scale(${1 / scale})`}
        fillOpacity={0}
        height={height}
        width={width}
      />
      {children}
    </g>
  )
}

export default ZoomableSVGGroup
