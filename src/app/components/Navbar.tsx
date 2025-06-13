import Link from "next/link";
import { Button } from "@/app/components/ui/button";

const Navbar = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-50">
      <div className="flex items-center space-x-8">
        <Link 
          href="/" 
          className="text-2xl font-bold campus-gradient-text hover:opacity-90 transition-opacity"
          aria-label="CampusNet Home"
        >
          CampusNet
        </Link>
        <div className="hidden md:flex space-x-6">
          {[
            { href: "/", label: "Home" },
            { href: "/about", label: "About" },
            { href: "/communities", label: "Communities" },
            { href: "/events", label: "Events" },
            { href: "/contact", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-md text-sm font-medium"
              aria-label={`Navigate to ${item.label}`}
              legacyBehavior>
              {item.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <Link href="/login" passHref legacyBehavior>
          <Button 
            variant="ghost" 
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            aria-label="Login"
          >
            Login
          </Button>
        </Link>
        <Link href="/signup" passHref legacyBehavior>
          <Button 
            className="bg-campus-gradient hover:opacity-90 text-white px-6"
            aria-label="Sign Up"
          >
            Sign Up
          </Button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;