import Breadcrumbs from "./Breadcrumbs/Breadcrumbs";
import HeaderNav from "./HeaderNav/HeaderNav";
import SearchBar from "./SearchBar/SearchBar";
import "./Header.css";

export default function Header() {
  return (
    <header>
        <Breadcrumbs />
        <HeaderNav />
        <SearchBar />
        <hr />
    </header>
  );
}