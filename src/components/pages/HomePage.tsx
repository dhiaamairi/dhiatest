// HPI 1.6-V
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
import { BaseCrudService } from '@/integrations';
import { OnlineStores } from '@/entities';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Image } from '@/components/ui/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Globe, ShoppingBag, MapPin, ExternalLink, ArrowRight, Star, Filter, X } from 'lucide-react';

// --- Utility Components for Animation & Layout ---

// Intersection Observer Component for Scroll Reveals
const AnimatedReveal = ({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${className || ''}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

// Parallax Image Component
const ParallaxImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.1, 1.15]);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y, scale }} className="w-full h-full">
        <Image
          src={src}
          alt={alt}
          width={1600}
          className="w-full h-full object-cover"
        />
      </motion.div>
    </div>
  );
};

// Marquee Component
const Marquee = ({ text }: { text: string }) => {
  return (
    <div className="w-full overflow-hidden bg-primary py-4 border-y border-secondary/20">
      <motion.div
        className="whitespace-nowrap flex gap-8"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      >
        {[...Array(10)].map((_, i) => (
          <span key={i} className="text-primary-foreground font-heading text-2xl tracking-widest uppercase opacity-80">
            {text} <span className="mx-4 text-secondary">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
};

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

  // Scroll Progress for Hero
  const { scrollY } = useScroll();
  const heroTextY = useTransform(scrollY, [0, 500], [0, 200]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  return (
    <div className="min-h-screen bg-background text-foreground font-paragraph selection:bg-primary selection:text-primary-foreground overflow-x-clip">
      <Header />

      {/* --- HERO SECTION: Split Layout (Inspiration Image Replication) --- */}
      <section className="relative w-full min-h-screen flex flex-col">
        {/* Top Half: Typography & Brand */}
        <div className="relative w-full h-[45vh] bg-background flex flex-col items-center justify-center px-6 z-10">
          <motion.div 
            style={{ y: heroTextY, opacity: heroOpacity }}
            className="text-center max-w-[100rem]"
          >
            <span className="block font-paragraph text-primary/60 tracking-[0.3em] text-sm uppercase mb-4">
              Est. 2024 • Global Collection
            </span>
            <h1 className="font-heading text-[12vw] lg:text-[10rem] leading-[0.8] text-primary mb-2 tracking-tighter">
              CRAFTICO
            </h1>
            <p className="font-heading text-2xl lg:text-4xl text-primary/80 italic font-light mt-4">
              Artisanal Touches for Your Living Space
            </p>
          </motion.div>
        </div>

        {/* Bottom Half: Immersive Image */}
        <div className="relative w-full h-[55vh] overflow-hidden">
          <ParallaxImage 
            src="https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=hero-table-setting"
            alt="Artisanal table setting with pears and ceramics"
            className="w-full h-full"
          />
          
          {/* Floating CTA */}
          <div className="absolute bottom-12 right-6 lg:right-12 z-20">
             <Button 
                onClick={() => document.getElementById('collection')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-background/90 backdrop-blur-sm text-primary hover:bg-primary hover:text-primary-foreground border border-primary/20 rounded-full px-8 py-8 text-lg transition-all duration-500 shadow-2xl group"
              >
                Explore Collection
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
          </div>
        </div>
      </section>

      {/* --- NARRATIVE SECTION: Editorial Layout --- */}
      <section className="py-32 px-6 lg:px-12 max-w-[120rem] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <AnimatedReveal>
              <div className="w-full h-[1px] bg-primary/20 mb-8" />
              <h2 className="font-heading text-4xl lg:text-5xl text-primary leading-tight">
                Curating the <br/>
                <span className="italic text-secondary-foreground/70">Extraordinary</span>
              </h2>
            </AnimatedReveal>
          </div>
          <div className="lg:col-span-8 lg:pl-12">
            <AnimatedReveal delay={200}>
              <p className="text-2xl lg:text-3xl leading-relaxed text-primary/90 font-light">
                <span className="text-6xl float-left mr-4 mt-[-10px] font-heading text-primary">W</span>
                e believe that every object in your home should tell a story. Our platform connects you with the world's most exceptional independent retailers, bringing global craftsmanship directly to your doorstep. From Kyoto ceramics to Scandinavian textiles, discover the hands that shape our world.
              </p>
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-primary/10 pt-8">
                <div className="text-center lg:text-left">
                  <h3 className="font-heading text-4xl text-primary mb-1">{stores.length}+</h3>
                  <p className="text-sm uppercase tracking-widest text-primary/60">Curated Stores</p>
                </div>
                <div className="text-center lg:text-left">
                  <h3 className="font-heading text-4xl text-primary mb-1">{countries.length}</h3>
                  <p className="text-sm uppercase tracking-widest text-primary/60">Countries</p>
                </div>
                <div className="text-center lg:text-left">
                  <h3 className="font-heading text-4xl text-primary mb-1">{categories.length}</h3>
                  <p className="text-sm uppercase tracking-widest text-primary/60">Categories</p>
                </div>
                <div className="text-center lg:text-left">
                  <h3 className="font-heading text-4xl text-primary mb-1">∞</h3>
                  <p className="text-sm uppercase tracking-widest text-primary/60">Possibilities</p>
                </div>
              </div>
            </AnimatedReveal>
          </div>
        </div>
      </section>

      {/* --- FEATURED SHOWCASE: Horizontal Scroll / Highlight --- */}
      {featuredStores.length > 0 && (
        <section className="w-full bg-secondary/20 py-24 overflow-hidden">
          <div className="max-w-[120rem] mx-auto px-6 lg:px-12 mb-12 flex justify-between items-end">
            <AnimatedReveal>
              <h2 className="font-heading text-4xl text-primary">Editor's Selection</h2>
            </AnimatedReveal>
            <AnimatedReveal delay={100}>
              <div className="hidden md:flex gap-2">
                <div className="w-12 h-[1px] bg-primary self-center" />
                <span className="text-sm uppercase tracking-widest text-primary">Top Picks</span>
              </div>
            </AnimatedReveal>
          </div>
          
          <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredStores.map((store, idx) => (
                <AnimatedReveal key={store._id} delay={idx * 150}>
                  <div 
                    className="group cursor-pointer relative"
                    onClick={() => setSelectedStore(store)}
                  >
                    <div className="aspect-[4/5] overflow-hidden mb-6 relative">
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors z-10 duration-500" />
                      {store.storeLogo ? (
                        <Image
                          src={store.storeLogo}
                          alt={store.storeName || 'Store Image'}
                          width={600}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary flex items-center justify-center">
                          <ShoppingBag className="w-12 h-12 text-primary/20" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-background/90 backdrop-blur rounded-full p-3 shadow-lg">
                          <ArrowRight className="w-5 h-5 text-primary" />
                        </div>
                      </div>
                    </div>
                    <h3 className="font-heading text-2xl text-primary mb-2 group-hover:underline decoration-1 underline-offset-4">
                      {store.storeName}
                    </h3>
                    <p className="text-primary/60 line-clamp-2 text-sm leading-relaxed max-w-xs">
                      {store.description}
                    </p>
                  </div>
                </AnimatedReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <Marquee text="Global • Artisan • Curated • Quality • Timeless • Design" />

      {/* --- MAIN COLLECTION: Sticky Filter & Grid --- */}
      <section id="collection" className="relative min-h-screen bg-background py-24">
        <div className="max-w-[120rem] mx-auto px-6 lg:px-12">
          
          {/* Header */}
          <div className="text-center mb-20">
            <AnimatedReveal>
              <span className="text-sm uppercase tracking-[0.2em] text-primary/60 mb-4 block">The Collection</span>
              <h2 className="font-heading text-5xl lg:text-7xl text-primary mb-6">Global Directory</h2>
              <div className="w-24 h-1 bg-primary mx-auto" />
            </AnimatedReveal>
          </div>

          {/* Sticky Filter Bar */}
          <div className="sticky top-4 z-40 mb-16">
            <div className="bg-background/80 backdrop-blur-md border border-primary/10 shadow-xl rounded-2xl p-4 lg:p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                
                {/* Search */}
                <div className="relative w-full lg:w-1/3">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/40" />
                  <Input 
                    placeholder="Search by name or keyword..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 bg-secondary/10 border-transparent focus:bg-background focus:border-primary/20 h-12 rounded-xl font-paragraph transition-all"
                  />
                </div>

                {/* Filters */}
                <div className="flex gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px] h-12 rounded-xl border-primary/10 bg-secondary/10 hover:bg-secondary/20 transition-colors">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 opacity-50" />
                        <SelectValue placeholder="Category" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(c => <SelectItem key={c} value={c!}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>

                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="w-[180px] h-12 rounded-xl border-primary/10 bg-secondary/10 hover:bg-secondary/20 transition-colors">
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 opacity-50" />
                        <SelectValue placeholder="Country" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Countries</SelectItem>
                      {countries.map(c => <SelectItem key={c} value={c!}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                      setSelectedCountry('all');
                    }}
                    className="h-12 px-6 rounded-xl border-primary/10 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-colors"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[400px] bg-secondary/10 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : filteredStores.length === 0 ? (
            <div className="text-center py-32 bg-secondary/5 rounded-3xl border border-dashed border-primary/20">
              <ShoppingBag className="w-16 h-16 text-primary/20 mx-auto mb-4" />
              <h3 className="font-heading text-2xl text-primary mb-2">No stores found</h3>
              <p className="text-primary/60">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
              {filteredStores.map((store, index) => (
                <AnimatedReveal key={store._id} delay={index % 4 * 100}>
                  <div 
                    className="group flex flex-col h-full cursor-pointer"
                    onClick={() => setSelectedStore(store)}
                  >
                    {/* Card Image */}
                    <div className="relative aspect-square overflow-hidden rounded-2xl bg-secondary/20 mb-6 shadow-sm group-hover:shadow-xl transition-all duration-500">
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 z-10 transition-colors duration-500" />
                      {store.storeLogo ? (
                        <Image
                          src={store.storeLogo}
                          alt={store.storeName || 'Store'}
                          width={500}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="font-heading text-4xl text-primary/20">{store.storeName?.charAt(0)}</span>
                        </div>
                      )}
                      
                      {/* Quick Actions Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20">
                        <Button className="w-full bg-background/95 text-primary hover:bg-primary hover:text-primary-foreground shadow-lg rounded-xl">
                          View Details
                        </Button>
                      </div>

                      {/* Badges */}
                      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                        {store.internationalShipping && (
                          <Badge className="bg-background/90 text-primary hover:bg-background shadow-sm backdrop-blur-sm border-none">
                            Global Shipping
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-heading text-xl font-bold text-primary group-hover:text-linkcolor transition-colors">
                          {store.storeName}
                        </h3>
                        {store.countryOfOrigin && (
                          <span className="text-xs font-bold uppercase tracking-wider text-primary/40 border border-primary/10 px-2 py-1 rounded-md">
                            {store.countryOfOrigin}
                          </span>
                        )}
                      </div>
                      <p className="text-primary/70 text-sm leading-relaxed line-clamp-2 mb-4 flex-1">
                        {store.description}
                      </p>
                      <div className="pt-4 border-t border-primary/5 flex justify-between items-center">
                        <span className="text-xs uppercase tracking-widest text-primary/50 font-semibold">
                          {store.category || 'General'}
                        </span>
                        <ArrowRight className="w-4 h-4 text-primary/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </AnimatedReveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- VISUAL BREATHER: Full Bleed Image --- */}
      <section className="relative w-full h-[80vh] overflow-hidden">
        <ParallaxImage 
          src="https://static.wixstatic.com/media/12d367_71ebdd7141d041e4be3d91d80d4578dd~mv2.png?id=breather-texture"
          alt="Abstract texture of natural materials"
          className="w-full h-full"
        />
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-background/90 backdrop-blur-md p-12 lg:p-20 max-w-4xl text-center mx-6 shadow-2xl">
            <h2 className="font-heading text-4xl lg:text-6xl text-primary mb-6">
              "Quality is not an act, it is a habit."
            </h2>
            <p className="font-paragraph text-lg text-primary/60 italic">
              — Aristotle
            </p>
          </div>
        </div>
      </section>

      {/* --- MODAL: Detailed View --- */}
      <AnimatePresence>
        {selectedStore && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-8 bg-primary/60 backdrop-blur-sm"
            onClick={() => setSelectedStore(null)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-background w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col lg:flex-row overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Image Side */}
              <div className="w-full lg:w-1/2 h-[300px] lg:h-auto relative bg-secondary/20">
                {selectedStore.storeLogo ? (
                  <Image
                    src={selectedStore.storeLogo}
                    alt={selectedStore.storeName || 'Store Detail'}
                    width={800}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="w-32 h-32 text-primary/20" />
                  </div>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 left-4 bg-background/50 hover:bg-background rounded-full lg:hidden"
                  onClick={() => setSelectedStore(null)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Modal Content Side */}
              <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-6 right-6 hidden lg:flex hover:bg-secondary/20 rounded-full"
                  onClick={() => setSelectedStore(null)}
                >
                  <X className="w-6 h-6 text-primary" />
                </Button>

                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge variant="outline" className="rounded-full px-4 py-1 border-primary/20 text-primary/60 uppercase tracking-widest text-xs">
                      {selectedStore.category || 'Retailer'}
                    </Badge>
                    {selectedStore.internationalShipping && (
                      <Badge className="rounded-full px-4 py-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 border-none uppercase tracking-widest text-xs">
                        Global Shipping
                      </Badge>
                    )}
                  </div>
                  <h2 className="font-heading text-5xl lg:text-6xl text-primary mb-6 leading-tight">
                    {selectedStore.storeName}
                  </h2>
                  <div className="flex items-center gap-2 text-primary/60 mb-8">
                    <MapPin className="w-5 h-5" />
                    <span className="text-lg">{selectedStore.countryOfOrigin || 'Worldwide'}</span>
                  </div>
                  <p className="font-paragraph text-xl text-primary/80 leading-relaxed">
                    {selectedStore.description}
                  </p>
                </div>

                <div className="mt-auto pt-8 border-t border-primary/10">
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <h4 className="font-heading text-lg text-primary mb-1">Established</h4>
                      <p className="text-primary/60">2024</p>
                    </div>
                    <div>
                      <h4 className="font-heading text-lg text-primary mb-1">Rating</h4>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-primary text-primary" />)}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    {selectedStore.websiteUrl && (
                      <Button 
                        className="flex-1 h-14 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl"
                        onClick={() => window.open(selectedStore.websiteUrl, '_blank')}
                      >
                        Visit Official Store
                        <ExternalLink className="ml-2 w-5 h-5" />
                      </Button>
                    )}
                    <Button 
                      variant="outline"
                      className="h-14 px-8 text-lg border-primary/20 hover:bg-secondary/20 rounded-xl"
                      onClick={() => setSelectedStore(null)}
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}