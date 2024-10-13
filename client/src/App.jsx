import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Header'
import GiftSetCalculator from './pages/businessCard/BusinessCardCalulator';
import BusinessCardCalculator from './pages/businessCard/BusinessCardCalulator';
import BusinessCardPriceForm from './pages/businessCard/PriceForm';
import AddPriceRanges from './pages/businessCard/PriceForm';
import UniformPriceCalculator from './pages/uniform/UniformCalculator';
import AddUniformPriceData from './pages/uniform/AddUniformPriceData';
import BillBookCalculator from './pages/billBook/BillBookCalculator';
import BillBookAddPriceForm from './pages/billBook/AddBillBookPriceData';
import KeychainPriceCalculator from './pages/keychain/keychainCalculator';
import AddKeychainPriceData from './pages/keychain/AddKeychainPriceData';
import FlyerPriceCalculator from './pages/flyer/FlyerCalculator';
import FlyerPriceDataForm from './pages/flyer/AddFlyerPriceData';
import WeddingCardCalculator from './pages/weddingCard/WeddingCardCalculator';
import WeddingCardPriceForm from './pages/weddingCard/AddWeddingCardPriceData';

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
                    <Route path="/billBook" element={<BillBookCalculator />} />
                    <Route path="/addBillBookPriceData" element={<BillBookAddPriceForm />} />
                    <Route path="/keychain" element={<KeychainPriceCalculator />} />
                    <Route path="/addKeychainPriceData" element={<AddKeychainPriceData />} />
                    <Route path="/flyer" element={<FlyerPriceCalculator />} />
                    <Route path="/addFlyerPriceData" element={<FlyerPriceDataForm />} />
                    <Route path="/weddingCard" element={<WeddingCardCalculator />} />
                    <Route path="/addWeddingCardPriceData" element={<WeddingCardPriceForm />} />



                    {/* <Route path="/businessCardPriceData" element={<BusinessCardPriceData  />} /> */}
                    
                </Routes>
            </div>
    </Router>
    );
}

export default App;
