
import { useState } from 'react';
import { Search, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStockData } from '../context/StockDataContext';

const Navbar = () => {
  const { searchStock } = useStockData();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    searchStock(searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
      <div className="container flex h-16 items-center px-4 sm:px-6">
        <div className="mr-4 flex items-center">
          <a href="/" className="flex items-center">
            <span className="text-xl font-bold text-blue-600 dark:text-blue-400">MarketSight</span>
          </a>
        </div>
        
        <div className="hidden md:flex flex-1 items-center justify-center">
          <form onSubmit={handleSearch} className="w-full max-w-sm">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search for a stock symbol..."
                className="w-full bg-slate-50 pl-8 dark:bg-slate-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
        </div>
        
        <div className="flex items-center justify-end space-x-2">
          <Button variant="ghost" size="sm" className="hidden md:flex">
            Dashboard
          </Button>
          <Button variant="ghost" size="sm" className="hidden md:flex">
            Watchlist
          </Button>
          <Button variant="ghost" size="sm" className="hidden md:flex">
            Analytics
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <form onSubmit={handleSearch} className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Search for a stock symbol..."
                className="w-full bg-slate-50 pl-8 dark:bg-slate-800"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </form>
          <div className="flex flex-col space-y-2">
            <Button variant="ghost" size="sm">Dashboard</Button>
            <Button variant="ghost" size="sm">Watchlist</Button>
            <Button variant="ghost" size="sm">Analytics</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
