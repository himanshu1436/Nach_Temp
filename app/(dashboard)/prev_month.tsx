import React, { useState, useEffect } from 'react';

interface Customer {
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

let totalAmnt = 0;
let failCont = 0;

const PreviousMonth: React.FC = () => {
  const [customerData, setCustomerData] = useState<Customer[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [failCount, setFailCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date();
        const currentMonth = today.getMonth();

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/fetch-data`
        );
        const data: Customer[] = await response.json();

        const lastMonth = new Date(
          today.getFullYear(),
          today.getMonth() - 1,
          1
        );

        const filteredData = data.filter((customer) => {
          const presentationDate = new Date(customer.date_of_presentation);
          return (
            presentationDate >= lastMonth &&
            presentationDate.getMonth() === currentMonth - 1
          );
        });

        const total = filteredData.reduce((acc, curr) => {
          const amount = parseFloat(curr.max_amount);
          return !isNaN(amount) ? acc + amount : acc;
        }, 0);

        const failCount = filteredData.filter(
          (customer) => customer.status_after_presentation === 'fail'
        ).length;

        setCustomerData(filteredData);
        setTotalAmount(total);
        setFailCount(failCount);

        totalAmnt = total;
        failCont = failCount;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="customer-table-container">
      <h1>Previous Month&apos;s Customers (NACH Presented)</h1>
      {customerData.length > 0 ? (
        <>
          <table className="customer-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Method</th>
                <th>Payment Capture</th>
                <th>Auth Type</th>
                <th>Max Amount</th>
                <th>Expire At</th>
                <th>Beneficiary Name</th>
                <th>Account Number</th>
                <th>Account Type</th>
                <th>IFSC Code</th>
                <th>Receipt</th>
                <th>Date of Presentation</th>
                <th>Status After Presentation</th>
              </tr>
            </thead>
            <tbody>
              {customerData.map((customer) => (
                <tr key={customer.customer_id}>
                  <td>{customer.customer_id}</td>
                  <td>{customer.method}</td>
                  <td>{customer.payment_capture}</td>
                  <td>{customer.auth_type}</td>
                  <td>{customer.max_amount}</td>
                  <td>{customer.expire_at}</td>
                  <td>{customer.beneficiary_name}</td>
                  <td>{customer.account_number}</td>
                  <td>{customer.account_type}</td>
                  <td>{customer.ifsc_code}</td>
                  <td>{customer.receipt}</td>
                  <td>{customer.date_of_presentation}</td>
                  <td>{customer.status_after_presentation}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="total-amount">
            <p>Total Amount: {totalAmount.toFixed(2)}</p>
          </div>
          <div className="fail-count">
            <p>Number of Failed Entries: {failCount}</p>
          </div>
        </>
      ) : (
        <p>No customers presented NACH in the previous month.</p>
      )}
    </div>
  );
};

export { PreviousMonth, totalAmnt, failCont };
