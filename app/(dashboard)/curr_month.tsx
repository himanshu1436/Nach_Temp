'use client';

import React, { useState, useEffect } from 'react';

interface CustomerData {
  provider_type: string;
  current_status: string;
  person_name: string;
  ifsc_code: string;
  loan_initiated: number;
  customer_id: string;
  account_number: string;
  email: string;
  auth_type: string;
  bank_name: number;
  method: string;
  proposed_payment_date: string;
  emi_amount: number;
  mobile_num: string;
  receipt: string;
  start_date: Record<string, never>;
  debit_type: number;
  year: string;
  amount: number;
  payment_capture: string;
  account_type: number;
  description: string;
  nach_provider: string;
  loan_id: number;
}

const CurrentMonth: React.FC = () => {
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [failCount, setFailCount] = useState<number>(0);

  const [sucessfullAmount, setSucessfullAmount] = useState<number>(0);
  const [sucessfullCount, setSucessfullCount] = useState<number>(0);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        'https://borrow-uat.wizr.in/nach/fetch-current-month-data'
      );

      const data: CustomerData[] = await res.json();
      setCustomerData(data);
      console.log(data);

      let currentMonth: number = new Date().getMonth() + 1;

      let total: number = 0;
      let sTotal: number = 0;
      let sCount: number = 0;

      data.forEach((ele, index) => {
        const eleMonth = new Date(ele.proposed_payment_date).getMonth() + 1;

        total += ele.emi_amount;
        if (ele.current_status == 'captured') {
          sTotal += ele.emi_amount;
          sCount++;
        }
      });
      setTotalAmount(total);
      setSucessfullAmount(sTotal);
      setSucessfullCount(sCount);
    }

    fetchData();
  }, []);

  return (
    <div className="w-full mx-auto px-4">
      <h1 className="text-lg font-bold mb-4">Current Month's NACH Details</h1>

      <div className="mt-4 flex flex-col space-y-4">
        <div>
          <p className="text-sm">Total Amount: ₹{totalAmount.toFixed(2)}</p>
        </div>
        <div className="flex space-x-4 justify-between">
          <p className="text-sm">
            Successful Amount: ₹{sucessfullAmount.toFixed(2)}
          </p>
          <p className="text-sm">Successful Count: {sucessfullCount}</p>
        </div>
      </div>
    </div>
  );
};

export { CurrentMonth };
