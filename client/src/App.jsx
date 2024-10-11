import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Header'
import GiftSetCalculator from './pages/businessCard/BusinessCardCalulator';
import BusinessCardCalculator from './pages/businessCard/BusinessCardCalulator';
import BusinessCardPriceForm from './pages/businessCard/PriceForm';
import AddPriceRanges from './pages/businessCard/PriceForm';
import UniformPriceCalculator from './pages/uniform/UniformCalculator';
import AddUniformPriceData from './pages/uniform/AddUniformPriceData';

function App() {
    const [data, setData] = useState([]);

    // useEffect(() => {
      
    //     if (location.pathname !== '/newInvoice') {
    //       location.href = '/newInvoice'
    //     }
    //   }, []);
    return (
        <Router>
       <div className="App"> 
                <Navbar />
                <Routes>
                 
                    <Route path="/" element={<BusinessCardCalculator />} />
                    <Route path="/businesscard" element={<BusinessCardCalculator />} />
                    <Route path="/businesscardForm" element={<AddPriceRanges />} />
                    <Route path="/uniform" element={<UniformPriceCalculator />} />
                    <Route path="/addUniformPriceData" element={<AddUniformPriceData />} />
                    {/* <Route path="/businessCardPriceData" element={<BusinessCardPriceData  />} /> */}
                    
                </Routes>
            </div>
    </Router>
    );
}

export default App;
