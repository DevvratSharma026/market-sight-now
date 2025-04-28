
import { StockDataProvider } from '../context/StockDataContext';
import Navbar from '../components/Navbar';
import WatchlistCard from '../components/WatchlistCard';

const Watchlist = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <StockDataProvider>
        <Navbar />
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Your Watchlist</h1>
            <WatchlistCard />
          </div>
        </div>
      </StockDataProvider>
    </div>
  );
};

export default Watchlist;
