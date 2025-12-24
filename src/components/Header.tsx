import { Link } from 'react-router-dom';
import { Globe } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-primary/10 sticky top-0 z-40">
      <div className="max-w-[100rem] mx-auto px-6 lg:px-12 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-xl font-bold text-primary">Global Directory</h1>
              <p className="font-paragraph text-xs text-foreground/60">Store Finder</p>
            </div>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="font-paragraph text-sm font-medium text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/#collection" className="font-paragraph text-sm font-medium text-foreground hover:text-primary transition-colors">
              Browse
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
