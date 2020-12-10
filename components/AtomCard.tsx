import Link from 'next/Link'

export interface AtomInfo {
  id: string
  title: string
  contents: string
}

const AtomCard = ({ id, title, contents }: AtomInfo) => {
  const linkString = `/atoms/${id}`;
  return (
    <Link href={linkString}>
      <a style={{ textDecoration: 'none' }}>
        <div className="card">
          <div className="container">
            <h4><b>{title}</b></h4>
            <p>{contents}</p>
          </div>
        </div>
      </a>
    </Link >
  )
}

export default AtomCard
