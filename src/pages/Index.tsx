
import MainDashboard from '../components/MainDashboard';
import Navbar from '../components/Navbar';
import { StockDataProvider } from '../context/StockDataContext';
import StockUpdater from '../components/StockUpdater';
import '../App.css';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <StockDataProvider>
        <Navbar />
        <MainDashboard />
        <StockUpdater />
      </StockDataProvider>
    </div>
  );
};

export default Index;
