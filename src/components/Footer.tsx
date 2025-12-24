import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-footerbackground text-primary-foreground">
      <div className="max-w-[120rem] mx-auto px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          <div>
            <h3 className="font-heading text-xl font-semibold mb-4">Global Market</h3>
            <p className="font-paragraph text-base opacity-90">
              Your gateway to discovering exceptional online retailers from around the world.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="font-paragraph text-base hover:opacity-80 transition-opacity">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/#stores" className="font-paragraph text-base hover:opacity-80 transition-opacity">
                  Browse Stores
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Contact</h4>
            <p className="font-paragraph text-base opacity-90">
              Explore the finest online shopping destinations worldwide.
            </p>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-8">
          <p className="font-paragraph text-sm text-center opacity-80">
            © {new Date().getFullYear()} Global Market. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
