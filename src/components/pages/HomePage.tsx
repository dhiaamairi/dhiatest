import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { OnlineStores } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, MapPin, ExternalLink, ArrowRight, Filter, X, Check } from 'lucide-react';

// --- Main Page Component ---

export default function HomePage() {
  // --- Data Fidelity Protocol: Canonization ---
  const [stores, setStores] = useState<OnlineStores[]>([]);
  const [filteredStores, setFilteredStores] = useState<OnlineStores[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const [selectedStore, setSelectedStore] = useState<OnlineStores | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- Data Fidelity Protocol: Preservation ---
  useEffect(() => {
    loadStores();
  }, []);

  useEffect(() => {
    filterStores();
  }, [stores, searchQuery, selectedCategory, selectedCountry]);

  const loadStores = async () => {
    setIsLoading(true);
    try {
      const { items } = await BaseCrudService.getAll<OnlineStores>('onlinestores');
      setStores(items);
    } catch (error) {
      console.error("Failed to load stores", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterStores = () => {
    let filtered = [...stores];

    if (searchQuery) {
      filtered = filtered.filter(store =>
        store.storeName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        store.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(store => store.category === selectedCategory);
    }

    if (selectedCountry !== 'all') {
      filtered = filtered.filter(store => store.countryOfOrigin === selectedCountry);
    }

    setFilteredStores(filtered);
  };

  // Derived Data for UI
  const categories = useMemo(() => Array.from(new Set(stores.map(s => s.category).filter(Boolean))), [stores]);
  const countries = useMemo(() => Array.from(new Set(stores.map(s => s.countryOfOrigin).filter(Boolean))), [stores]);
  const featuredStores = useMemo(() => stores.slice(0, 3), [stores]); // Use first 3 as featured

  return (
    <div className="min-h-screen bg-background text-foreground font-paragraph selection:bg-primary selection:text-primary-foreground overflow-x-clip">
      <Header />

      {/* --- HERO SECTION: Simple Form & Title --- */}
      <section className="relative w-full py-20 px-6 lg:px-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="max-w-[100rem] mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-heading text-5xl lg:text-7xl text-primary mb-4 tracking-tight">
              Global Store Directory
            </h1>
            <p className="font-paragraph text-lg text-foreground/70 max-w-2xl mx-auto">
              Discover and explore exceptional online retailers from around the world. Filter by category, country, and search for exactly what you need.
            </p>
          </div>

          {/* Search & Filter Form */}
          <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-primary/10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
              {/* Search Input */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-semibold text-primary mb-2">Search Stores</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                  <Input 
                    placeholder="Search by name or keyword..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 rounded-lg border-primary/20 focus:border-primary focus:ring-primary/20 font-paragraph"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12 rounded-lg border-primary/20 focus:border-primary focus:ring-primary/20">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(c => <SelectItem key={c} value={c!}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Country Filter */}
              <div>
                <label className="block text-sm font-semibold text-primary mb-2">Country</label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="h-12 rounded-lg border-primary/20 focus:border-primary focus:ring-primary/20">
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map(c => <SelectItem key={c} value={c!}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Button */}
              <div className="flex gap-2">
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setSelectedCountry('all');
                  }}
                  variant="outline"
                  className="h-12 rounded-lg border-primary/20 hover:bg-primary/5 text-primary flex-1"
                >
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section className="py-16 px-6 lg:px-12 bg-white border-b border-primary/10">
        <div className="max-w-[100rem] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-heading text-primary mb-2">{stores.length}</div>
              <p className="text-sm uppercase tracking-widest text-foreground/60 font-semibold">Total Stores</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-heading text-secondary mb-2">{countries.length}</div>
              <p className="text-sm uppercase tracking-widest text-foreground/60 font-semibold">Countries</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-heading text-primary mb-2">{categories.length}</div>
              <p className="text-sm uppercase tracking-widest text-foreground/60 font-semibold">Categories</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-heading text-secondary mb-2">{filteredStores.length}</div>
              <p className="text-sm uppercase tracking-widest text-foreground/60 font-semibold">Results</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- STORES TABLE/GRID --- */}
      <section id="collection" className="py-24 px-6 lg:px-12 bg-background">
        <div className="max-w-[100rem] mx-auto">
          {/* Results Table */}
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-20 bg-primary/5 animate-pulse rounded-lg" />
              ))}
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="text-center py-20 bg-primary/5 rounded-xl border border-dashed border-primary/20">
              <Globe className="w-16 h-16 text-primary/20 mx-auto mb-4" />
              <h3 className="font-heading text-2xl text-primary mb-2">No stores found</h3>
              <p className="text-foreground/60">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-primary/20">
                    <th className="text-left py-4 px-4 font-heading text-primary">Store Name</th>
                    <th className="text-left py-4 px-4 font-heading text-primary">Category</th>
                    <th className="text-left py-4 px-4 font-heading text-primary">Country</th>
                    <th className="text-left py-4 px-4 font-heading text-primary">Shipping</th>
                    <th className="text-left py-4 px-4 font-heading text-primary">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStores.map((store) => (
                    <motion.tr 
                      key={store._id}
                      className="border-b border-primary/10 hover:bg-primary/5 transition-colors cursor-pointer"
                      onClick={() => setSelectedStore(store)}
                      whileHover={{ scale: 1.01 }}
                    >
                      <td className="py-4 px-4">
                        <div>
                          <p className="font-semibold text-primary">{store.storeName}</p>
                          <p className="text-sm text-foreground/60 line-clamp-1">{store.description}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                          {store.category || 'General'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-foreground/70">
                          <MapPin className="w-4 h-4 text-secondary" />
                          {store.countryOfOrigin || 'N/A'}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        {store.internationalShipping ? (
                          <div className="flex items-center gap-2 text-secondary font-semibold">
                            <Check className="w-5 h-5" />
                            Global
                          </div>
                        ) : (
                          <span className="text-foreground/40">Local</span>
                        )}
                      </td>
                      <td className="py-4 px-4">
                        <Button 
                          size="sm"
                          className="bg-primary text-white hover:bg-primary/90 rounded-lg"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedStore(store);
                          }}
                        >
                          View
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* --- MODAL: Detailed View --- */}
      <AnimatePresence>
        {selectedStore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm"
            onClick={() => setSelectedStore(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <div className="flex justify-between items-start mb-6">
                <h2 className="font-heading text-4xl text-primary">
                  {selectedStore.storeName}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-primary/10 rounded-full"
                  onClick={() => setSelectedStore(null)}
                >
                  <X className="w-6 h-6 text-primary" />
                </Button>
              </div>

              {/* Store Details */}
              <div className="space-y-6">
                {/* Category & Shipping */}
                <div className="flex flex-wrap gap-3">
                  <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5">
                    {selectedStore.category || 'Retailer'}
                  </Badge>
                  {selectedStore.internationalShipping && (
                    <Badge className="bg-secondary text-white border-none">
                      Global Shipping Available
                    </Badge>
                  )}
                </div>

                {/* Location */}
                <div className="flex items-center gap-3 text-lg">
                  <MapPin className="w-5 h-5 text-secondary" />
                  <span className="text-foreground/80">{selectedStore.countryOfOrigin || 'Worldwide'}</span>
                </div>

                {/* Description */}
                <div>
                  <h3 className="font-heading text-lg text-primary mb-2">About</h3>
                  <p className="text-foreground/70 leading-relaxed">
                    {selectedStore.description}
                  </p>
                </div>

                {/* Store Info Grid */}
                <div className="grid grid-cols-2 gap-6 py-6 border-y border-primary/10">
                  <div>
                    <p className="text-sm uppercase tracking-widest text-foreground/60 font-semibold mb-1">Category</p>
                    <p className="text-lg text-primary font-semibold">{selectedStore.category || 'General'}</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-widest text-foreground/60 font-semibold mb-1">Shipping</p>
                    <p className="text-lg text-primary font-semibold">
                      {selectedStore.internationalShipping ? 'International' : 'Local'}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  {selectedStore.websiteUrl && (
                    <Button 
                      className="flex-1 h-12 bg-primary text-white hover:bg-primary/90 rounded-lg font-semibold"
                      onClick={() => window.open(selectedStore.websiteUrl, '_blank')}
                    >
                      Visit Store
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </Button>
                  )}
                  <Button 
                    variant="outline"
                    className="flex-1 h-12 border-primary/20 text-primary hover:bg-primary/5 rounded-lg font-semibold"
                    onClick={() => setSelectedStore(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- VISUAL BREAKER: Full Bleed Section --- */}
      <section className="relative w-full py-20 px-6 lg:px-12 bg-gradient-to-r from-primary/10 to-secondary/10 border-y border-primary/10">
        <div className="max-w-[100rem] mx-auto text-center">
          <h2 className="font-heading text-4xl lg:text-5xl text-primary mb-4">
            Discover Global Retailers
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Browse our curated collection of exceptional online stores from around the world. Find exactly what you're looking for with our advanced filtering system.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}