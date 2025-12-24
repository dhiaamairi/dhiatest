import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-footerbackground text-primary-foreground">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Globe className="w-8 h-8" />
            <div>
              <h1 className="font-heading text-2xl font-semibold tracking-wide">Global Market</h1>
              <p className="font-paragraph text-sm opacity-90">Discover Exceptional Online Retailers</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="font-paragraph text-base hover:opacity-80 transition-opacity">
              Home
            </Link>
            <Link to="/#stores" className="font-paragraph text-base hover:opacity-80 transition-opacity">
              Browse Stores
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
