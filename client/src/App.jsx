import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Header'
import Home from './components/Home';
import BusinessCardPriceData from './components/BusinessCardPriceData';

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
                 
                    <Route path="/" element={<Home />} />
                    <Route path="/businessCardPriceData" element={<BusinessCardPriceData  />} />
                    
                </Routes>
            </div>
    </Router>
    );
}

export default App;
