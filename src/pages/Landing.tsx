
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, ChartLine, Shield } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1460925895917-afdab827c52f')] bg-cover bg-center opacity-10" />
        <div className="relative container mx-auto px-4 py-24 sm:py-32">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-violet-400 pb-2">
              Real-Time Stock Market Predictions
            </h1>
            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
              Make informed investment decisions with our advanced AI-powered analytics platform. Get real-time insights and accurate market predictions.
            </p>
            <Button 
              onClick={() => navigate('/dashboard')} 
              size="lg" 
              className="text-lg bg-blue-600 hover:bg-blue-700 transition-colors animate-fade-in"
            >
              Start Trading Now <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-slate-50 dark:bg-slate-900 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg transition-transform hover:scale-105">
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Analytics</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Get instant access to market trends and real-time stock performance data.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg transition-transform hover:scale-105">
              <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4">
                <ChartLine className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Predictions</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Advanced machine learning algorithms predict market movements with high accuracy.
              </p>
            </div>

            <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-lg transition-transform hover:scale-105">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Portfolio</h3>
              <p className="text-slate-600 dark:text-slate-300">
                Track and manage your investments with personalized watchlists and alerts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
