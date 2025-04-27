
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800 text-white p-4">
      <div className="text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
          Real-Time Stock Market Predictions
        </h1>
        <p className="text-lg md:text-xl text-slate-300">
          Get instant insights and predictions for your stock market investments using advanced analytics
        </p>
        <Button 
          onClick={() => navigate('/dashboard')} 
          size="lg" 
          className="mt-8 text-lg bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Stock Analysis <ArrowRight className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Landing;
