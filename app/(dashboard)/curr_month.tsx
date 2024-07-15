'use client';

import React, { useState, useEffect } from 'react';

interface CustomerData {
  customer_id: string;
  method: string;
  payment_capture: string;
  auth_type: string;
  max_amount: string;
  expire_at: string;
  beneficiary_name: string;
  account_number: string;
  account_type: string;
  ifsc_code: string;
  receipt: string;
  date_of_presentation: string;
  status_after_presentation: string;
}

let totalAmnt_2 = 0;
let failCont_2 = 0;

const CurrentMonth: React.FC = () => {
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [totalAmount_2, setTotalAmount_2] = useState(0);
  const [failCount_2, setFailCount_2] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const currentMonth = today.getMonth();
        const response = await fetch('/api/fetch-data');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: CustomerData[] = await response.json();
        const currentMonthStart = new Date(
          today.getFullYear(),
          currentMonth,
          1
        );

        const filteredData = data.filter((customer) => {
          const presentationDate = new Date(customer.date_of_presentation);
          return (
            presentationDate >= currentMonthStart &&
            presentationDate.getMonth() === currentMonth
          );
        });

        const total_2 = filteredData.reduce((acc, curr) => {
          const amount = parseFloat(curr.max_amount);
          return !isNaN(amount) ? acc + amount : acc;
        }, 0);

        const failCount_2 = filteredData.filter(
          (customer) => customer.status_after_presentation === 'fail'
        ).length;

        setCustomerData(filteredData);
        setTotalAmount_2(total_2);
        setFailCount_2(failCount_2);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  totalAmnt_2 = totalAmount_2;
  failCont_2 = failCount_2;

  return (
    <div className="w-full mx-auto px-4 py-8">
      <h1 className="text-lg font-bold mb-4">This Month's NACH Details</h1>
      {customerData.length > 0 ? (
        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Customer ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Method
                </th>
                <th scope="col" className="px-6 py-3">
                  Payment Capture
                </th>
                <th scope="col" className="px-6 py-3">
                  Auth Type
                </th>
                <th scope="col" className="px-6 py-3">
                  Max Amount
                </th>
                <th scope="col" className="px-6 py-3">
                  Expire At
                </th>
                <th scope="col" className="px-6 py-3">
                  Beneficiary Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Account Number
                </th>
                <th scope="col" className="px-6 py-3">
                  Account Type
                </th>
                <th scope="col" className="px-6 py-3">
                  IFSC Code
                </th>
                <th scope="col" className="px-6 py-3">
                  Receipt
                </th>
                <th scope="col" className="px-6 py-3">
                  Date of Presentation
                </th>
                <th scope="col" className="px-6 py-3">
                  Status After Presentation
                </th>
              </tr>
            </thead>
            <tbody>
              {customerData.map((customer, index) => (
                <tr
                  key={customer.customer_id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-6 py-4">{customer.customer_id}</td>
                  <td className="px-6 py-4">{customer.method}</td>
                  <td className="px-6 py-4">{customer.payment_capture}</td>
                  <td className="px-6 py-4">{customer.auth_type}</td>
                  <td className="px-6 py-4">{customer.max_amount}</td>
                  <td className="px-6 py-4">{customer.expire_at}</td>
                  <td className="px-6 py-4">{customer.beneficiary_name}</td>
                  <td className="px-6 py-4">{customer.account_number}</td>
                  <td className="px-6 py-4">{customer.account_type}</td>
                  <td className="px-6 py-4">{customer.ifsc_code}</td>
                  <td className="px-6 py-4">{customer.receipt}</td>
                  <td className="px-6 py-4">{customer.date_of_presentation}</td>
                  <td className="px-6 py-4">
                    {customer.status_after_presentation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-sm text-gray-600">
          No customers presented NACH this month yet.
        </p>
      )}
      <div className="mt-4 flex justify-between">
        <p className="text-sm">Total Amount: ₹{totalAmount_2.toFixed(2)}</p>
        <p className="text-sm">Failed Transactions: {failCount_2}</p>
      </div>
    </div>
  );
};

export { CurrentMonth, totalAmnt_2, failCont_2 };
