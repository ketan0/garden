import Link from 'next/Link'

interface NavItemProps {
  href: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, isActive, children }) => {
  return (
    <Link href={href}>
      <a>
        <li className={`block px-4 py-2 rounded-md hover:bg-yellow-200 ${isActive ? 'bg-yellow-100 text-yellow-700' : ''}`}>
          {children}
        </li>
      </a>

    </Link>
  )
}

export default NavItem
