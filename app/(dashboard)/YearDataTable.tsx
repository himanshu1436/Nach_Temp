'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

interface MonthData {
  captured: number;
  authorized: number;
  nan: number;
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
    data[month] = { captured: 0, authorized: 0, nan: 0 };
  });
  return data;
};

const YearDataTable: React.FC = () => {
  const [yearData, setYearData] = useState<YearData>(initialYearData());
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:4000/redshift-data');
        const data = await response.json();

        const newYearData = initialYearData();

        data.forEach((item: any) => {
          const date = new Date(item.month + '-01');
          const monthYear = date.toLocaleString('default', {
            month: 'long',
            year: 'numeric'
          });
          if (newYearData[monthYear]) {
            newYearData[monthYear].captured = item.captured;
            newYearData[monthYear].authorized = item.authorized;
            newYearData[monthYear].nan = item.nan;
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

  const handleMonthClick = (month: string) => {
    router.push(`/month-detail?month=${encodeURIComponent(month)}`);
  };

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
                <TableHead className="font-bold">Captured</TableHead>
                <TableHead className="font-bold">Authorized</TableHead>
                <TableHead className="font-bold">
                  Failed / Not Presented{' '}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {generateLast12Months().map((month) => (
                <TableRow key={month}>
                  <TableCell>
                    <Button
                      variant="link"
                      onClick={() => handleMonthClick(month)}
                    >
                      {month}
                    </Button>
                  </TableCell>
                  <TableCell>{yearData[month].captured}</TableCell>
                  <TableCell>{yearData[month].authorized}</TableCell>
                  <TableCell>{yearData[month].nan}</TableCell>
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
