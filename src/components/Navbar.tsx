
import { useState } from 'react';
import { Search, Menu, X, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useStockData } from '@/hooks/useStockData';
import { Link } from 'react-router-dom';
import GlobalStockSearch from './GlobalStockSearch';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { searchStock } = useStockData();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchStock(searchQuery);
      setSearchQuery('');
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b dark:bg-slate-950 dark:border-slate-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold text-primary mr-6">StockWatch</Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/dashboard" className="text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary">Dashboard</Link>
              <Link to="/watchlist" className="text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary">Watchlist</Link>
            </div>
          </div>

          <div className="hidden md:flex flex-1 mx-4 max-w-2xl">
            <GlobalStockSearch />
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 dark:text-slate-300"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-3 pb-3">
            <form onSubmit={handleSearch} className="mb-3">
              <div className="flex items-center">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search stock symbol..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" size="sm" className="ml-2">
                  Search
                </Button>
              </div>
            </form>
            <div className="space-y-2">
              <Link 
                to="/dashboard" 
                onClick={() => setIsOpen(false)}
                className="block py-2 px-3 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                Dashboard
              </Link>
              <Link 
                to="/watchlist" 
                onClick={() => setIsOpen(false)}
                className="block py-2 px-3 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
              >
                Watchlist
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
