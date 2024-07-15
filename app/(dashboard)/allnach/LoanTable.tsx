// app/components/LoanTable.tsx
'use client';

import React, { useState, useMemo } from 'react';
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
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LoanEntry } from './LoanEntry';
import tableData from './tableData';
import { Loan } from './types';

interface LoanTableProps {
  initialOffset?: number;
  itemsPerPage?: number;
}

export function LoanTable({
  initialOffset = 0,
  itemsPerPage = 5
}: LoanTableProps) {
  const [offset, setOffset] = useState(initialOffset);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const totalItems = tableData.length;

  const sortedData = useMemo(() => {
    const sorted = [...tableData].sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.Outstanding_amount - b.Outstanding_amount;
      } else {
        return b.Outstanding_amount - a.Outstanding_amount;
      }
    });
    return sorted;
  }, [sortOrder]);

  const prevPage = () => setOffset(Math.max(0, offset - itemsPerPage));
  const nextPage = () =>
    setOffset(Math.min(totalItems - itemsPerPage, offset + itemsPerPage));

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Loan Data</CardTitle>
          <Button onClick={toggleSortOrder}>
            Sorting {sortOrder === 'asc' ? '↑' : '↓'}
          </Button>
        </div>
        <CardDescription>
          Overview of bank loans and their details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of bank loans and their details</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Bank/FI Name</TableHead>
              <TableHead>Type of Loan</TableHead>
              <TableHead>Disbursement Date</TableHead>
              <TableHead>Outstanding Amount</TableHead>
              <TableHead>Principal Amount</TableHead>
              <TableHead>Interest Amount</TableHead>
              <TableHead>TDS Amount</TableHead>
              <TableHead>Net Payment</TableHead>
              <TableHead>Repayment Date</TableHead>
              <TableHead>NACH/NEFT</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData
              .slice(offset, offset + itemsPerPage)
              .map((loan: Loan, index: number) => (
                <LoanEntry key={index} loan={loan} />
              ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div>
          Showing {Math.min(offset + 1, totalItems)}-
          {Math.min(offset + itemsPerPage, totalItems)} of {totalItems} entries
        </div>
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={offset === 0}
          >
            <ChevronLeft className="h-4 w-4" />
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={offset + itemsPerPage >= totalItems}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
