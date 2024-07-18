'use client';

import React, { useState, useRef, useEffect } from 'react';
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
  const totalItems = tableData.length;
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  const prevPage = () => setOffset(Math.max(0, offset - itemsPerPage));
  const nextPage = () =>
    setOffset(Math.min(totalItems - itemsPerPage, offset + itemsPerPage));

  return (
    <div className="relative" ref={containerRef}>
      <Card className="mb-16">
        <CardHeader>
          <CardTitle>Loan Data</CardTitle>
          <CardDescription>
            Overview of bank loans and their details.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableCaption>A list of bank loans and their details</TableCaption>
            <TableHeader>
              <TableRow>
                {[
                  'Bank/FI Name',
                  'Type of Loan',
                  'Disbursement Date',
                  'Outstanding amount',
                  'Principal Amount',
                  'Interest Amount',
                  'TDS Amount',
                  'Net Payment',
                  'Repayment Date',
                  'NACH/NEFT'
                ].map((field) => (
                  <TableHead key={field} className="font-bold">
                    {field}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData
                .slice(offset, offset + itemsPerPage)
                .map((loan: Loan, index: number) => (
                  <LoanEntry key={index} loan={loan} />
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <div
        className="absolute bottom-0 left-0 right-0 bg-white p-4 shadow-md flex justify-between items-center"
        style={{ width: `${containerWidth}px` }}
      >
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={prevPage}
            disabled={offset === 0}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Prev
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={offset + itemsPerPage >= totalItems}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="text-center">
          Showing {Math.min(offset + 1, totalItems)}-
          {Math.min(offset + itemsPerPage, totalItems)} of {totalItems} entries
        </div>
      </div>
    </div>
  );
}
