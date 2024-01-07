/* eslint-disable react/prop-types */
import { Logo } from "./Logo";

export const Navbar = ({ children }) => {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
};
