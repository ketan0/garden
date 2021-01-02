import Link from 'next/Link'
import { AtomCardInfo } from '../types';

const AtomCard = ({ id, title, contents, isActive }: AtomCardInfo) => {
  const linkString = `/atoms/${id}`;
  return (
    <div className={`${isActive ? 'border-2 border-yellow-300' : ''} bg-white hover:bg-yellow-100 shadow-md rounded-xl p-4 m-2`} >
      <Link href={linkString}>
        <a style={{ color: 'inherit', textDecoration: 'none' }}>
          <div>
            <div>
              <p className="text-lg font-semibold">{title}</p>
              <p className="font-sans">{contents}</p>
            </div>
          </div>
        </a>
      </Link >
    </div >
  )
}

export default AtomCard
