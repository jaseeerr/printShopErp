import React, { useEffect, useRef, useState } from "react";
import ReactPrint from "react-to-print";

const Invoice = () => {
  const ref = useRef();

  const [formData, setFormData] = useState({
    date: "",
    item: "",
    quantity: 1,
    unitPrice: 0,
    total: 0,
  });

  // data variable
  const [data, setData] = useState([]);

  // main form variables
  const [date, setDate] = useState("");
  const [invoiceNo, setInvoiceNo] = useState("18082024M1");
  const [clientName, setClientName] = useState("MYLE INTERNATIONAL");
  const [refName, setRefName] = useState("Ranjana Rajan");
  const [refDesc, setRefDesc] = useState("");
  const [mainActivity, setMainActivity] = useState("");
  const [activityCode, setActivityCode] = useState("");

  // bank 1 variables
  const [bank, setBank] = useState("WIO BANK");
  const [accountName, setAccountName] = useState("Ranjana Rajan");
  const [accountNumber, setAccountNumber] = useState("6715210087");
  const [ibanNo, setIbanNo] = useState("AE310860000006715210087");
  const [swift, setSwift] = useState("WIOBAEADXXX");

  // bank 2 variables
  const [bank1, setBank1] = useState("ADCB Bank");
  const [accountName1, setAccountName1] = useState("Ranjana Rajan");
  const [accountNumber1, setAccountNumber1] = useState("10031339217001");
  const [ibanNo1, setIbanNo1] = useState("AE23003001003133921700");
  const [swift1, setSwift1] = useState("ADCBAEAA");

  // bill item variables
  const [item, setItem] = useState("");
  const [qty, setQty] = useState(1);
  const [unitPrice, setUnitPrice] = useState(0);
  const [amount, setAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [totalInWords, setTotalInWords] = useState("");

  const setTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    setDate(formattedDate);
  };

  // convert number to words
  function numberToWords(num) {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Million', 'Billion'];
  
    if (num === 0) return 'Zero';
  
    let word = '';
    let thousandCounter = 0;
  
    const getHundreds = (n) => {
      let str = '';
      if (n > 99) {
        str += ones[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      if (n >= 11 && n <= 19) {
        str += teens[n - 10] + ' ';
      } else {
        if (n >= 10 || n > 0) {
          str += tens[Math.floor(n / 10)] + ' ';
        }
        if (n % 10 > 0) {
          str += ones[n % 10] + ' ';
        }
      }
      return str.trim();
    };
  
    while (num > 0) {
      if (num % 1000 !== 0) {
        const currentPart = getHundreds(num % 1000);
        word = currentPart + (currentPart ? ' ' + thousands[thousandCounter] : '') + ' ' + word;
      }
      num = Math.floor(num / 1000);
      thousandCounter++;
    }
  
    return word.trim();
  }
  
  function convertAmountToWords(amount) {
    const validAmount = Number(String(amount).replace(/,/g, ''));
    
    if (isNaN(validAmount)) {
      throw new Error("Invalid amount provided to convertAmountToWords.");
    }
  
    const [integerPart, decimalPart] = validAmount.toFixed(2).split('.');
    const integerWords = numberToWords(parseInt(integerPart));
    const decimalWords = decimalPart === '00' ? '' : numberToWords(parseInt(decimalPart));
  
    if (decimalWords) {
      return `${integerWords} Dirhams And ${decimalWords} Fils Only`;
    } else {
      return `${integerWords} Dirhams Only`;
    }
  }

  // add item function
  const addItem = (e) => {
    e.preventDefault();
  
    // Convert unitPrice to string and ensure it has two decimal places
    let formattedUnitPrice = unitPrice.toString().includes('.')
      ? unitPrice.toFixed(2)
      : `${unitPrice}.00`;
  
      
    // Convert amount to string and ensure it has two decimal places
    let formattedAmount = amount.toString().includes('.')
      ? parseFloat(amount).toFixed(2)
      : `${amount}.00`;

      
  
    const newItem = { item, unitPrice: formattedUnitPrice, qty, amount: formattedAmount };
  
    setData((prevData) => {
      const updatedData = [...prevData, newItem];
      console.log(updatedData);
      return updatedData;
    });
  };

  // add amounts to get total
  const calculateTotal = (data) => {
    console.log("data in totFunc")
    console.log(data)
    const total = data.reduce((sum, item) => sum + Number(item?.amount), 0);
  
    // Format the total to include commas and two decimal places
    return new Intl.NumberFormat('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(total);
  };

  // delete item
  function deleteItemAtIndex(index,item) {
    if (index >= 0 && index < data.length) {
      const confirmDelete = window.confirm(`Are you sure you want to delete ${item}?`);
      if (confirmDelete) {
        setData(prevData => {
          const newData = [...prevData]; // Create a copy of the current state
          newData.splice(index, 1); // Remove the item at the specified index
          return newData; // Return the updated state
        });
      }
    } else {
      console.error("Invalid index provided");
    }
  }
  


  // useEffect to call the setTodayDate function when the component mounts
  useEffect(() => {
    setTodayDate();
  }, []);

  useEffect(() => {
    setAmount(unitPrice * qty);
  }, [unitPrice, qty]);

  useEffect(() => {
    console.log(data);
    
    const x = calculateTotal(data);
    setTotal(x);
  
    const y = Number(String(x).replace(/,/g, ''));
    console.log('x : ',x)
    console.log('y : ',y)
    if (!isNaN(y)) {
      const words = convertAmountToWords(y);
      setTotalInWords(words);
    } else {
      console.error('Total is not a valid number:', x);
    }
  }, [data]);

  return (
    <div className="p-8 bg-gray-100 min-h-screen ">
      {/* form section */}
      <div className="flex flex-col md:flex-row justify-center items-start w-full space-y-10 md:space-y-0 md:space-x-10 p-8">
        {/* invoice form mobile */}
        <div className="max-w-4xl w-full bg-white shadow-md rounded-md p-6 md:hidden">
  <h2 className="text-2xl font-bold mb-6">Invoice Form</h2>
  <form className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Date
      </label>
      <input
        value={date}
        onChange={(e) => setDate(e.target.value)}
        type="date"
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Invoice Number
      </label>
      <input
        type="text"
        value={invoiceNo}
        onChange={(e) => setInvoiceNo(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Client Name
      </label>
      <input
        type="text"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Reference Name
      </label>
      <input
        type="text"
        value={refName}
        onChange={(e) => setRefName(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Main Activity
      </label>
      <input
        type="text"
        value={mainActivity}
        onChange={(e) => setMainActivity(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Activity Code
      </label>
      <input
        type="text"
        value={activityCode}
        onChange={(e) => setActivityCode(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Bank Name
      </label>
      <input
        type="text"
        value={bank}
        onChange={(e) => setBank(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Bank Account Name
      </label>
      <input
        type="text"
        value={accountName}
        onChange={(e) => setAccountName(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Bank Account Number
      </label>
      <input
        type="text"
        value={accountNumber}
        onChange={(e) => setAccountNumber(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        IBAN Number
      </label>
      <input
        type="text"
        value={ibanNo}
        onChange={(e) => setIbanNo(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        SWIFT Code
      </label>
      <input
        type="text"
        value={swift}
        onChange={(e) => setSwift(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Bank Name 1
      </label>
      <input
        type="text"
        value={bank1}
        onChange={(e) => setBank1(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Bank Account Name 1
      </label>
      <input
        type="text"
        value={accountName1}
        onChange={(e) => setAccountName1(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Bank Account Number 1
      </label>
      <input
        type="text"
        value={accountNumber1}
        onChange={(e) => setAccountNumber1(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        IBAN Number 1
      </label>
      <input
        type="text"
        value={ibanNo1}
        onChange={(e) => setIbanNo1(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        SWIFT Code 1
      </label>
      <input
        type="text"
        value={swift1}
        onChange={(e) => setSwift1(e.target.value)}
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
    <div>
      {/* Add your submit button here if needed */}
      {/* <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-md"
      >
        Submit
      </button> */}
    </div>
  </form>
</div>

{/* invoice form other than mobile */}
<div className="max-w-4xl w-full bg-white shadow-md rounded-md p-6 hidden md:block">
          <h2 className="text-2xl font-bold mb-6">Invoice Form</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                type="date"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Invoice Number
              </label>
              <input
                type="text"
                value={invoiceNo}
                onChange={(e) => setInvoiceNo(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Client Name
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Reference Name
              </label>
              <input
                type="text"
                value={refName}
                onChange={(e) => setRefName(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Main Activity
              </label>
              <input
                type="text"
                value={mainActivity}
                onChange={(e) => setMainActivity(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Activity Code
              </label>
              <input
                type="text"
                value={activityCode}
                onChange={(e) => setActivityCode(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bank Name
              </label>
              <input
                type="text"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bank Account Name
              </label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bank Account Number
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                IBAN Number
              </label>
              <input
                type="text"
                value={ibanNo}
                onChange={(e) => setIbanNo(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SWIFT Code
              </label>
              <input
                type="text"
                value={swift}
                onChange={(e) => setSwift(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bank Name 1
              </label>
              <input
                type="text"
                value={bank1}
                onChange={(e) => setBank1(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bank Account Name 1
              </label>
              <input
                type="text"
                value={accountName1}
                onChange={(e) => setAccountName1(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Bank Account Number 1
              </label>
              <input
                type="text"
                value={accountNumber1}
                onChange={(e) => setAccountNumber1(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                IBAN Number 1
              </label>
              <input
                type="text"
                value={ibanNo1}
                onChange={(e) => setIbanNo1(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SWIFT Code 1
              </label>
              <input
                type="text"
                value={swift1}
                onChange={(e) => setSwift1(e.target.value)}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="col-span-2">
              {/* <button
                type="submit"
                className="w-full bg-blue-500 text-white p-2 rounded-md"
              >
                Submit
              </button> */}
            </div>
          </form>
        </div>
        <div className="max-w-md w-full">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Add Item</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Item</label>
              <input
                type="text"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                name="item"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Quantity</label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                name="quantity"
                className="w-full px-3 py-2 border rounded-lg"
                min="1"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Unit Price</label>
              <input
                type="number"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                name="unitPrice"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Total Amount</label>
              <input
                type="number"
                value={amount}
                name="total"
                className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                readOnly
              />
            </div>
            <button
              onClick={addItem}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Item
            </button>
          </form>
        </div>

        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md mt-5">
          <h2 className="text-xl font-bold mb-4">Total Amount</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700">Total</label>
              <input
                type="text"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                name="item"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Total in words</label>
              <textarea
                rows={3}
                value={totalInWords}
                onChange={(e) => setTotalInWords(e.target.value)}
                name="quantity"
                className="w-full px-3 py-2 border rounded-lg"
                min="1"
              />
            </div>
            
            {/* <button
              onClick={addItem}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Add Item
            </button> */}
          </form>
        </div>
        </div>
        
      </div>
      <div ref={ref} className="max-w-5xl mx-auto p-1 px-16 bg-white min-h-screen flex flex-col">
  <div className="flex justify-between items-center mb-4">
    <img
      src="https://res.cloudinary.com/dfethvtz3/image/upload/v1721295354/drops/logo_zzlazv.jpg"
      alt="Logo"
      className="w-32"
    />
    <img
      src="https://res.cloudinary.com/dfethvtz3/image/upload/v1721297282/drops/amer_DET_izfu6o.jpg"
      alt="Logo"
      className="w-32"
    />
    <div className="text-right">
      <h2 className="text-xl font-bold">DROPS JOURNEY</h2>
      <p className="text-gray-600">ACCOUNT & BOOKKEEPING</p>
      <p className="text-gray-600">GATE WAY OF ALL GOV SERVICES</p>
    </div>
  </div>

  <div className="flex justify-between mb-4">
    <div>
      <p className="font-bold">INVOICE#{invoiceNo}</p>
      <p>Name: {clientName}</p>
    </div>
    <div className="text-right">
      <p className="font-bold">Date: {date}</p>
    </div>
  </div>

  <div className="mb-4">
    <p className="font-bold">REFERENCE#</p>
    <p>Name: {refName}</p>
    <p>Main Activity Description: {mainActivity}</p>
    <p>Activity Code: {activityCode}</p>
  </div>

  <div className="flex-grow">
    <table className="w-full border-collapse border border-gray-300 mb-4">
      <thead>
        <tr className="bg-blue-100">
          <th className="border border-gray-300 p-2">PARTICULARS</th>
          <th className="border border-gray-300 p-2">QTY</th>
          <th className="border border-gray-300 p-2">UNIT PRICE</th>
          <th className="border border-gray-300 p-2">AMOUNT</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 &&
          data.map((x, index) => {
            const rowClass = index % 2 === 0 ? "" : "bg-gray-100"; // Apply bg-gray-100 to even rows

            return (
              <tr key={x.item+index} className={rowClass} onDoubleClick={()=>deleteItemAtIndex(index,x.item)}>
                <td className="border border-gray-300 p-2">{x.item}</td>
                <td className="border border-gray-300 p-2">{x.qty}</td>
                <td className="border border-gray-300 p-2">{x.unitPrice}</td>
                <td className="border border-gray-300 p-2">{x.amount}</td>
              </tr>
            );
          })}

        {data.length == 0 && (
          <tr className="">
            <td className="border border-gray-300 p-2">N/A</td>
            <td className="border border-gray-300 p-2">0</td>
            <td className="border border-gray-300 p-2">0</td>
            <td className="border border-gray-300 p-2">0</td>
          </tr>
        )}
      </tbody>
    </table>

    <div className="flex justify-between items-center mb-4">
      <div>
        <p className="font-bold">TOTAL</p>
      </div>
      <div className="text-right">
        <p className="text-xl font-bold">{total}</p>
        <p className="italic">({totalInWords})</p>
      </div>
    </div>
  </div>
<div className="flex justify-between">
<div className="mb-4">
    <p className="font-bold">Bank Detail</p>
    <p className="mb-2">Account Name: <span className="font-bold">{accountName}</span></p>
    <p>Bank Name: <span className="font-bold">{bank}</span></p>
    <p>A/c No: {accountNumber}</p>
    <p>Iban No: {ibanNo}</p>
    <p className="mb-2">BIC/SWIFT: {swift}</p>

    <p>Bank Name: <span className="font-bold">{bank1}</span></p>
    <p>A/c No: {accountNumber1}</p>
    <p>Iban No: {ibanNo1}</p>
    <p>SWIFT: {swift1}</p>
  </div>
  <img src="https://res.cloudinary.com/dfethvtz3/image/upload/v1725353936/drops/dropStampNoBg1_xlodrs.png" className="w-48 h-48 mr-28 mt-20 mb-10" alt="" />
</div>
 

  <div className="mt-auto text-center border-t border-gray-300 pt-4">
    <p className="text-gray-600">
      website: www.dropsjourney.com |
      email:
      info@dropsjourney.com , ranjanarajan@outlook.com
    </p>
  </div>
</div>



      <ReactPrint
        trigger={() => (
          <button
            className="my-3 px-5 py-1 border rounded-md bg-green-500 hover:bg-green-600 cursor-pointer text-white"
            id="btn"
          >
            Download PDF
          </button>
        )}
        content={() => ref.current}
        documentTitle={`FILE`}
      />
    </div>
  );
};

export default Invoice;
