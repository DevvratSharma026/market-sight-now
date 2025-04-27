
import { useState, useEffect } from 'react';
import MainDashboard from '../components/MainDashboard';
import Navbar from '../components/Navbar';
import { StockDataProvider } from '../context/StockDataContext';
import '../App.css';

const Index = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <StockDataProvider>
        <Navbar />
        <MainDashboard />
      </StockDataProvider>
    </div>
  );
};

export default Index;
