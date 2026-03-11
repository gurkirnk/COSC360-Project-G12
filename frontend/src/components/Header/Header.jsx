import Breadcrumbs from "./Breadcrumbs/Breadcrumbs";
import HeaderNav from "./HeaderNav/HeaderNav";
import "./Header.css";

export default function Header() {
  return (
    <header>
        <Breadcrumbs />
        <HeaderNav />
        <hr />
    </header>
  );
}