import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary text-white border-t border-primary/20">
      <div className="max-w-[100rem] mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          <div>
            <h3 className="font-heading text-lg font-bold mb-3">Global Directory</h3>
            <p className="font-paragraph text-sm opacity-90">
              Your gateway to discovering exceptional online retailers from around the world.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-lg font-bold mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="font-paragraph text-sm hover:opacity-80 transition-opacity">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/#collection" className="font-paragraph text-sm hover:opacity-80 transition-opacity">
                  Browse Stores
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-lg font-bold mb-3">About</h4>
            <p className="font-paragraph text-sm opacity-90">
              Explore the finest online shopping destinations worldwide with our curated directory.
            </p>
          </div>
        </div>
        <div className="border-t border-white/20 pt-8">
          <p className="font-paragraph text-sm text-center opacity-80">
            © {new Date().getFullYear()} Global Directory. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
