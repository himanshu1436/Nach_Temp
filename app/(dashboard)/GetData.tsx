'use client';
import { useEffect, useState } from 'react';

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

const GetData = () => {
  const [customerData, setCustomerData] = useState<CustomerData[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://borrow-uat.wizr.in/nach/fetch-data');
        const data: CustomerData[] = await res.json();
        setCustomerData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return customerData;
};

export default GetData;
