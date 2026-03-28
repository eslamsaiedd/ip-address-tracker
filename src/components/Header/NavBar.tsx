import logo from "../../../public/images/Icon (1).svg";
import "../global.css";
import { ThemeToggle } from "../ThemeToggle";

function NavBar() {
  return (
    <nav
      className="w-full bg-[#F7F9FB] dark:bg-[var(--second-primary-color)] sticky top-0 z-50 border-b border-gray-100 dark:border-[#1e293b]"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-7">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={logo} alt="" className="w-6 h-6" aria-hidden="true" />
            <span className="text-2xl font-bold dark:text-white text-[var(--black-color)]">
              IPTracker
            </span>
          </div>

          {/* Theme toggle */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
