'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
} from '@/components/ui/monthlyTable';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EntryData {
  current_status: string;
  person_name: string;
  ifsc_code: string;
  loan_initiated: number;
  customer_id: string;
  account_number: string;
  email: string;
  auth_type: string;
  method: string;
  proposed_payment_date: string;
  emi_amount: number;
  mobile_num: string;
  receipt: string;
  start_date: any;
  debit_type: number;
  amount: number;
  payment_capture: string;
  account_type: number;
  description: string;
  nach_provider: string;
  loan_id: number;
}

const ENTRIES_PER_PAGE = 100;

const MonthDetail: React.FC = () => {
  const [monthData, setMonthData] = useState<EntryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();
  const month = searchParams.get('month');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://borrow-uat.wizr.in/nach/fetch-data'
        );
        const data = await response.json();

        const filteredData = data.filter((item: EntryData) => {
          const itemDate = new Date(item.proposed_payment_date);
          const itemMonthYear = itemDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric'
          });
          return itemMonthYear === month;
        });

        setMonthData(filteredData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    if (month) {
      fetchData();
    }
  }, [month]);

  const totalPages = Math.ceil(monthData.length / ENTRIES_PER_PAGE);
  const startIndex = (currentPage - 1) * ENTRIES_PER_PAGE;
  const endIndex = Math.min(startIndex + ENTRIES_PER_PAGE, monthData.length);
  const currentEntries = monthData.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (monthData.length === 0) {
    return <div>No entries for this Month.</div>;
  }

  return (
    <div className="relative">
      <Card className="mb-16">
        <CardHeader>
          <CardTitle>Details for {month}</CardTitle>
          <CardDescription>
            Showing {startIndex + 1}-{endIndex} of {monthData.length} entries
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableCaption>Month Detail Data</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Current Status</TableHead>
                <TableHead className="font-bold">Person Name</TableHead>
                <TableHead className="font-bold">IFSC Code</TableHead>
                <TableHead className="font-bold">Loan Initiated</TableHead>
                <TableHead className="font-bold">Customer ID</TableHead>
                <TableHead className="font-bold">Account Number</TableHead>
                <TableHead className="font-bold">Email</TableHead>
                <TableHead className="font-bold">Auth Type</TableHead>
                <TableHead className="font-bold">Method</TableHead>
                <TableHead className="font-bold">
                  Proposed Payment Date
                </TableHead>
                <TableHead className="font-bold">EMI Amount</TableHead>
                <TableHead className="font-bold">Mobile Number</TableHead>
                <TableHead className="font-bold">Receipt</TableHead>
                <TableHead className="font-bold">Debit Type</TableHead>
                <TableHead className="font-bold">Amount</TableHead>
                <TableHead className="font-bold">Payment Capture</TableHead>
                <TableHead className="font-bold">Account Type</TableHead>
                <TableHead className="font-bold">Description</TableHead>
                <TableHead className="font-bold">NACH Provider</TableHead>
                <TableHead className="font-bold">Loan ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentEntries.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell>{entry.current_status}</TableCell>
                  <TableCell>{entry.person_name}</TableCell>
                  <TableCell>{entry.ifsc_code}</TableCell>
                  <TableCell>{entry.loan_initiated}</TableCell>
                  <TableCell>{entry.customer_id}</TableCell>
                  <TableCell>{entry.account_number}</TableCell>
                  <TableCell>{entry.email}</TableCell>
                  <TableCell>{entry.auth_type}</TableCell>
                  <TableCell>{entry.method}</TableCell>
                  <TableCell>{entry.proposed_payment_date}</TableCell>
                  <TableCell>{entry.emi_amount}</TableCell>
                  <TableCell>{entry.mobile_num}</TableCell>
                  <TableCell>{entry.receipt}</TableCell>
                  <TableCell>{entry.debit_type}</TableCell>
                  <TableCell>{entry.amount}</TableCell>
                  <TableCell>{entry.payment_capture}</TableCell>
                  <TableCell>{entry.account_type}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell>{entry.nach_provider}</TableCell>
                  <TableCell>{entry.loan_id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="flex justify-center mt-4">
        <Button onClick={prevPage} disabled={currentPage === 1}>
          &lt;
        </Button>
        <span className="mx-4">
          Page {currentPage} of {totalPages}
        </span>
        <Button onClick={nextPage} disabled={currentPage === totalPages}>
          &gt;
        </Button>
      </div>
    </div>
  );
};

export default MonthDetail;
