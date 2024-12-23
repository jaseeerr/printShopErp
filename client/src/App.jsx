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
import QRCodeScanner from './pages/scanner/Scanner';
import QrScanner from './pages/scanner/Scanner';
import QRCodeGenerator from './components/Qr';
import ProductForm from './pages/inventory/AddProduct';
import ProductPage from './pages/inventory/Products';
import ViewProduct from './pages/inventory/ViewProduct';

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
                 
                    <Route path="/" element={<ProductPage />} />
                    <Route path="/view/:id" element={<ViewProduct />} />
                    <Route path="/products" element={<ProductPage />} />
                    <Route path="/qr" element={<QRCodeGenerator />} />
                    <Route path="/addProduct" element={<ProductForm />} />
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
                    <Route path="/scanner" element={<QrScanner />} />



                    {/* <Route path="/businessCardPriceData" element={<BusinessCardPriceData  />} /> */}
                    
                </Routes>
            </div>
    </Router>
    );
}

export default App;
