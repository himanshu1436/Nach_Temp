'use client';

import React, { useState, useEffect } from 'react';

interface CustomerData {
  customer_id: string;
  method: string;
  payment_capture: string;
  auth_type: string;
  max_amount: number;
  expire_at: string;
  beneficiary_name: string;
  account_number: string;
  account_type: string;
  ifsc_code: string;
  receipt: string;
  date_of_presentation: string;
  status_after_presentation: string;
  isChecked: boolean;
}

const TodaysNach: React.FC = () => {
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [selectAll, setSelectAll] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/fetch-data`);
      const data: CustomerData[] = await response.json();

      const filteredData = data.filter((customer) => {
        const presentationDate = customer.date_of_presentation.split('T')[0];
        return presentationDate === today;
      });

      setCustomerData(
        filteredData.map((customer) => ({ ...customer, isChecked: false }))
      );
    };

    fetchData();
  }, []);

  const handleCheckboxChange = (index: number) => {
    const updatedData = [...customerData];
    updatedData[index].isChecked = !updatedData[index].isChecked;

    const allChecked = updatedData.every((customer) => customer.isChecked);
    setSelectAll(allChecked);

    setCustomerData(updatedData);
  };

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setCustomerData(
      customerData.map((customer) => ({ ...customer, isChecked: newSelectAll }))
    );
  };

  const handleDeselectAll = () => {
    setSelectAll(false);
    setCustomerData(
      customerData.map((customer) => ({ ...customer, isChecked: false }))
    );
  };

  const handlePresentNach = () => {
    const selectedCustomers = customerData.filter(
      (customer) => customer.isChecked
    );
    console.log('Present NACH for selected customers:', selectedCustomers);
  };

  const isPresentNachDisabled = customerData.every(
    (customer) => !customer.isChecked
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Today's NACH Details</h1>
      <div className="flex space-x-2 mb-4">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={customerData.length === 0}
          onClick={handleSelectAll}
        >
          Select All
        </button>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
          disabled={customerData.length === 0}
          onClick={handleDeselectAll}
        >
          Deselect All
        </button>
        <button
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
          disabled={isPresentNachDisabled}
          onClick={handlePresentNach}
        >
          Present NACH
        </button>
      </div>
      {customerData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-2">Customer ID</th>
                <th className="px-4 py-2">Method</th>
                <th className="px-4 py-2">Payment Capture</th>
                <th className="px-4 py-2">Auth Type</th>
                <th className="px-4 py-2">Max Amount</th>
                <th className="px-4 py-2">Expire At</th>
                <th className="px-4 py-2">Beneficiary Name</th>
                <th className="px-4 py-2">Account Number</th>
                <th className="px-4 py-2">Account Type</th>
                <th className="px-4 py-2">IFSC Code</th>
                <th className="px-4 py-2">Receipt</th>
                <th className="px-4 py-2">Date of Presentation</th>
                <th className="px-4 py-2">Status After Presentation</th>
              </tr>
            </thead>
            <tbody>
              {customerData.map((customer, index) => (
                <tr key={customer.customer_id} className="border-b">
                  <td className="px-4 py-2">
                    <input
                      type="checkbox"
                      checked={customer.isChecked}
                      onChange={() => handleCheckboxChange(index)}
                    />
                  </td>
                  <td className="px-4 py-2">{customer.customer_id}</td>
                  <td className="px-4 py-2">{customer.method}</td>
                  <td className="px-4 py-2">{customer.payment_capture}</td>
                  <td className="px-4 py-2">{customer.auth_type}</td>
                  <td className="px-4 py-2">{customer.max_amount}</td>
                  <td className="px-4 py-2">{customer.expire_at}</td>
                  <td className="px-4 py-2">{customer.beneficiary_name}</td>
                  <td className="px-4 py-2">{customer.account_number}</td>
                  <td className="px-4 py-2">{customer.account_type}</td>
                  <td className="px-4 py-2">{customer.ifsc_code}</td>
                  <td className="px-4 py-2">{customer.receipt}</td>
                  <td className="px-4 py-2">{customer.date_of_presentation}</td>
                  <td className="px-4 py-2">
                    {customer.status_after_presentation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm">No customers presented NACH today.</p>
      )}
    </div>
  );
};

export default TodaysNach;
