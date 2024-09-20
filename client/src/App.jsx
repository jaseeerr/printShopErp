import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Invoice from './components/Invoices';
import Navbar from './components/Header'

function App() {
    const [data, setData] = useState([]);

    useEffect(() => {
      
        if (location.pathname !== '/newInvoice') {
          location.href = '/newInvoice'
        }
      }, []);
    return (
        <Router>
       <div className="App"> 
                <Navbar />
                <Routes>
                 
                    <Route path="/newInvoice" element={<Invoice />} />
                    
                </Routes>
            </div>
    </Router>
    );
}

export default App;
