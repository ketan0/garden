import NavItem from './NavItem';
import { useRouter } from "next/router";

const Nav: React.FC = () => {
  const router = useRouter();
  const routes = [{ href: "/", description: "Home" }]
  return (
    <nav className="p-4">
      <ul className="flex space-x-2">
        <p key="title" className="font-bold px-4 py-2 text-xl">{"Ketan's Digital Garden 🌱"}</p>
        {routes.map(({ href, description }) =>
          <NavItem href={href} isActive={router.pathname === href} key={href}>{description}</NavItem>)}
      </ul>
    </nav>
  )
}

export default Nav
