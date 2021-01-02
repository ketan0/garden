import Link from 'next/Link'
import { PositionedNode, SimNode } from '../types';

const AtomNode = ({ x, y, id, title, contents }: PositionedNode<SimNode>) => {
  const linkString = `/atoms/${id}`;
  const width = 200, height = 160;
  return (
    <foreignObject x={x - width / 2} y={y - height / 2} width={width} height={height}>
      <Link href={linkString}>
        <a style={{ color: 'inherit', textDecoration: 'none' }}>
          <div className={"bg-white hover:bg-yellow-100 border-2 border-yellow-300 rounded-xl p-4 h-full overflow-auto"} >
            <div>
              <p key="title" className={`text-lg font-semibold ${contents ? '' : 'align-middle'}`}>{title}</p>
              {contents && <p key="contents" className="font-sans overflow-ellipsis">{contents}</p>}
            </div>
          </div>
        </a>
      </Link >
    </foreignObject>

  )
}

export default AtomNode
