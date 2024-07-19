'use client';

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
} from '@/components/ui/table';
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

const TodaysNach: React.FC = () => {
  const [monthData, setMonthData] = useState<EntryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://borrow-uat.wizr.in/nach/fetch-data'
        );
        const data = await response.json();

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();

        const filteredData = data.filter((item: EntryData) => {
          const itemDate = new Date(item.proposed_payment_date);
          return (
            itemDate.getMonth() === 0 && itemDate.getFullYear() === currentYear
          );
        });

        setMonthData(filteredData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const currentMonth = new Date().toLocaleString('default', {
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="container mx-auto px-2 py-4">
      <h1 className="text-xl font-bold mb-2">Today's NACH Details</h1>
      <Card className="mb-8">
        <CardHeader className="py-2">
          <CardTitle className="text-lg">Details for {currentMonth}</CardTitle>
          <CardDescription className="text-sm">
            Showing {startIndex + 1}-{endIndex} of {monthData.length} entries
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-2">
          <Table className="w-full text-xs">
            <TableCaption>Month Detail Data</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="font-semibold p-1">
                  Current Status
                </TableHead>
                <TableHead className="font-semibold p-1">Person Name</TableHead>
                <TableHead className="font-semibold p-1">IFSC Code</TableHead>
                <TableHead className="font-semibold p-1">
                  Loan Initiated
                </TableHead>
                <TableHead className="font-semibold p-1">Customer ID</TableHead>
                <TableHead className="font-semibold p-1">
                  Account Number
                </TableHead>
                <TableHead className="font-semibold p-1">Email</TableHead>
                <TableHead className="font-semibold p-1">Auth Type</TableHead>
                <TableHead className="font-semibold p-1">Method</TableHead>
                <TableHead className="font-semibold p-1">
                  Proposed Payment Date
                </TableHead>
                <TableHead className="font-semibold p-1">EMI Amount</TableHead>
                <TableHead className="font-semibold p-1">
                  Mobile Number
                </TableHead>
                <TableHead className="font-semibold p-1">Receipt</TableHead>
                <TableHead className="font-semibold p-1">Debit Type</TableHead>
                <TableHead className="font-semibold p-1">Amount</TableHead>
                <TableHead className="font-semibold p-1">
                  Payment Capture
                </TableHead>
                <TableHead className="font-semibold p-1">
                  Account Type
                </TableHead>
                <TableHead className="font-semibold p-1">Description</TableHead>
                <TableHead className="font-semibold p-1">
                  NACH Provider
                </TableHead>
                <TableHead className="font-semibold p-1">Loan ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentEntries.map((entry, index) => (
                <TableRow key={index}>
                  <TableCell className="p-1">{entry.current_status}</TableCell>
                  <TableCell className="p-1">{entry.person_name}</TableCell>
                  <TableCell className="p-1">{entry.ifsc_code}</TableCell>
                  <TableCell className="p-1">{entry.loan_initiated}</TableCell>
                  <TableCell className="p-1">{entry.customer_id}</TableCell>
                  <TableCell className="p-1">{entry.account_number}</TableCell>
                  <TableCell className="p-1">{entry.email}</TableCell>
                  <TableCell className="p-1">{entry.auth_type}</TableCell>
                  <TableCell className="p-1">{entry.method}</TableCell>
                  <TableCell className="p-1">
                    {entry.proposed_payment_date}
                  </TableCell>
                  <TableCell className="p-1">{entry.emi_amount}</TableCell>
                  <TableCell className="p-1">{entry.mobile_num}</TableCell>
                  <TableCell className="p-1">{entry.receipt}</TableCell>
                  <TableCell className="p-1">{entry.debit_type}</TableCell>
                  <TableCell className="p-1">{entry.amount}</TableCell>
                  <TableCell className="p-1">{entry.payment_capture}</TableCell>
                  <TableCell className="p-1">{entry.account_type}</TableCell>
                  <TableCell className="p-1">{entry.description}</TableCell>
                  <TableCell className="p-1">{entry.nach_provider}</TableCell>
                  <TableCell className="p-1">{entry.loan_id}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div className="flex justify-center mt-2">
        <Button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="text-sm px-2 py-1"
        >
          &lt;
        </Button>
        <span className="mx-2 text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="text-sm px-2 py-1"
        >
          &gt;
        </Button>
      </div>
    </div>
  );
};

export default TodaysNach;
