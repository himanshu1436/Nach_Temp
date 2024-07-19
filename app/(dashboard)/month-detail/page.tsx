'use client';

import React, { useState, useEffect } from 'react';
import Avatar from 'react-avatar';
import Image from 'next/image';
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

import MOCK_DATA from './mockData.json';

const ENTRIES_PER_PAGE = 100;

const MonthDetail: React.FC = () => {
  const data: EntryData[] = MOCK_DATA as EntryData[];
  const [monthData, setMonthData] = useState<EntryData[]>(data);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const searchParams = useSearchParams();
  const month = searchParams.get('month');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch(
        //   'https://borrow-uat.wizr.in/nach/fetch-data'
        // );
        // const data = await response.json();

        // const filteredData = data.filter((item: EntryData) => {
        //   const itemDate = new Date(item.proposed_payment_date);
        //   const itemMonthYear = itemDate.toLocaleString('default', {
        //     month: 'long',
        //     year: 'numeric'
        //   });
        //   return itemMonthYear === month;
        // });

        // setMonthData(filteredData);
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

  const columnColors = [
    'text-blue-500',
    'text-red-500',
    'text-green-500',
    'text-yellow-500',
    'text-purple-500',
    'text-pink-500',
    'text-indigo-500',
    'text-gray-500',
    'text-orange-500',
    'text-teal-500',
    'text-cyan-500',
    'text-lime-500',
    'text-amber-500',
    'text-rose-500',
    'text-violet-500',
    'text-fuchsia-500',
    'text-sky-500',
    'text-emerald-500',
    'text-olive-500',
    'text-maroon-500'
  ];

  return (
    <div className="relative w-full max-w-full overflow-hidden">
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
      <Card className="mb-16">
        <CardHeader>
          <CardTitle>Details for {month}</CardTitle>
          <CardDescription>
            Showing {startIndex + 1}-{endIndex} of {monthData.length} entries
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-auto max-h-[70vh] custom-scrollbar">
          <div className="w-max min-w-full">
            <Table>
              <TableCaption>Month Detail Data</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-bold">Loan ID</TableHead>
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentEntries.map((entry, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <span className={columnColors[0]}>{entry.loan_id}</span>
                    </TableCell>
                    <TableCell>
                      <span className={columnColors[1]}>
                        {entry.current_status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Image
                          src="/profile.png"
                          width={24}
                          height={24}
                          alt="Avatar"
                          className="overflow-hidden rounded-full"
                        />
                        <span className={`ml-2 ${columnColors[6]}`}>
                          {entry.person_name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={columnColors[3]}>{entry.ifsc_code}</span>
                    </TableCell>
                    <TableCell>
                      <span className={columnColors[4]}>
                        {entry.loan_initiated}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={columnColors[5]}>
                        {entry.customer_id}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={columnColors[2]}>
                        {entry.account_number}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={columnColors[7]}>{entry.email}</span>
                    </TableCell>
                    <TableCell>
                      <span className={columnColors[8]}>{entry.auth_type}</span>
                    </TableCell>
                    <TableCell>
                      <span className={columnColors[9]}>{entry.method}</span>
                    </TableCell>
                    <TableCell>
                      <span className={columnColors[10]}>
                        {entry.proposed_payment_date}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={columnColors[11]}>
                        {entry.emi_amount}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={columnColors[12]}>
                        {entry.mobile_num}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={columnColors[13]}>{entry.receipt}</span>
                    </TableCell>
                    <TableCell>
                      <span className={columnColors[14]}>
                        {entry.debit_type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={columnColors[15]}>{entry.amount}</span>
                    </TableCell>
                    <TableCell>
                      <span className={columnColors[16]}>
                        {entry.payment_capture}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={columnColors[17]}>
                        {entry.account_type}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={columnColors[18]}>
                        {entry.description}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={columnColors[19]}>
                        {entry.nach_provider}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
