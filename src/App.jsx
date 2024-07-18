import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './App.css';

export default function App() {


  const [customers, setCustomers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState();
  const [search, setSearch] = useState('');


  function getData() {
    axios.get('https://m-khairy-b.github.io/api/data-customers.json')
      .then((response) => {
        setCustomers(response.data.customers)
        setTransactions(response.data.transactions)
        setFilter(response.data.transactions)
      })
      .catch((err) => err)
  };

  function handleSearch(e) {
    let value = e.target.value;
    setSearch(value);
    let filtered = transactions.filter((transaction) => transaction.amount.toString().includes(value) ||
      customers.find((customer) => customer.id == transaction.customer_id)?.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilter(filtered);
  };

  function handleCustomerChange(e) {
    let value = e.target.value;
    setSelectedCustomer(value ? parseInt(value) : null);
  };

  let dataToDisplay = selectedCustomer ? filter.filter((tx) => tx.customer_id == selectedCustomer) : filter;

  let chartData = dataToDisplay.reduce((acc, tx) => {
    let date = tx.date;
    let existing = acc.find((item) => item.date == date);
    if (existing == true) {
      existing.amount += tx.amount;
    } else {
      acc.push({ date, amount: tx.amount });
    }
    return acc;
  }, []);

  useEffect(() => {
    getData();
  }, []);

  return (<>
    <div className="p-4">
      <input
        type="text"
        placeholder="Search by customer name or amount"
        value={search}
        onChange={handleSearch}
        className="mb-4 mr-5 p-2 border rounded w-64"
      />
      <select onChange={handleCustomerChange} className="mb-4 p-2 border rounded w-64">
        <option value="">Select a customer</option>
        {customers.map(customer => (
          <option key={customer.id} value={customer.id}>{customer.name}</option>
        ))}
      </select>
      <table className="w-full border-collapse mb-8">
        <thead>
          <tr>
            <th className="border p-2">Customer</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          {dataToDisplay.map(ele => (
            <tr key={ele.id}>
              <td className="border p-2">{customers.find(customer => customer.id == ele.customer_id)?.name}</td>
              <td className="border p-2">{ele.date}</td>
              <td className="border p-2">{ele.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className='m-auto'>
        <LineChart
          width={1150}
          height={300}
          data={chartData}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="amount" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </div>
    </div>
  </>);
};