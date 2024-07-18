'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { CurrentMonth } from './curr_month';
import { PreviousMonth } from './prev_month';
import YearDataTable from './YearDataTable';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

const Home: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('Home');
  const [prevMonthData, setPrevMonthData] = useState({
    totalAmnt: 0,
    failCont: 0
  });
  const [currMonthData, setCurrMonthData] = useState({
    totalAmnt_2: 0,
    failCont_2: 0
  });
  const pathname = usePathname();

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <main className="flex-1 p-8 overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Prev Month's NACH</CardTitle>
              <CardDescription>
                View all customers and their orders.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm">
              <Link href="/prev_month">
                <div>
                  <PreviousMonth />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Current Month's NACH</CardTitle>
              <CardDescription>
                View all customers and their orders.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/curr_month">
                <div>
                  <CurrentMonth />
                </div>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="mt-6">
        <YearDataTable />
      </div>
    </main>
    // </div>
  );
};

export default Home;
