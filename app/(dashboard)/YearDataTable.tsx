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

interface MonthData {
  presented: number;
  captured: number;
  failed: number;
}

interface YearData {
  [key: string]: MonthData;
}

const generateLast12Months = (): string[] => {
  const months = [];
  const currentDate = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    months.push(
      d.toLocaleString('default', { month: 'long', year: 'numeric' })
    );
  }
  return months;
};

const initialYearData = (): YearData => {
  const data: YearData = {};
  generateLast12Months().forEach((month) => {
    data[month] = { presented: 0, captured: 0, failed: 0 };
  });
  return data;
};

const YearDataTable: React.FC = () => {
  const [yearData, setYearData] = useState<YearData>(initialYearData());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          'https://borrow-uat.wizr.in/nach/fetch-data'
        );
        const data = await response.json();

        const newYearData = initialYearData();

        data.forEach((item: any) => {
          const date = new Date(item.proposed_payment_date);
          const monthYear = date.toLocaleString('default', {
            month: 'long',
            year: 'numeric'
          });
          if (newYearData[monthYear]) {
            newYearData[monthYear].presented++;
            if (item.current_status === 'captured') {
              newYearData[monthYear].captured++;
            } else if (item.current_status === 'failed') {
              newYearData[monthYear].failed++;
            }
          }
        });

        setYearData(newYearData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative">
      <Card className="mb-16">
        <CardHeader>
          <CardTitle>Year Data Summary</CardTitle>
          <CardDescription>
            Overview of monthly data for the last 12 months.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableCaption>Year Data Summary</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Month</TableHead>
                <TableHead className="font-bold">Presented</TableHead>
                <TableHead className="font-bold">Captured</TableHead>
                <TableHead className="font-bold">Failed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {generateLast12Months().map((month) => (
                <TableRow key={month}>
                  <TableCell>{month}</TableCell>
                  <TableCell>{yearData[month].presented}</TableCell>
                  <TableCell>{yearData[month].captured}</TableCell>
                  <TableCell>{yearData[month].failed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {isLoading && <div>Loading...</div>}
    </div>
  );
};

export default YearDataTable;
