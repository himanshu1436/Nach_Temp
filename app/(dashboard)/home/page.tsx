'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { PreviousMonth } from './prev_month';
import { CurrentMonth } from './curr_month';

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

  useEffect(() => {
    // If PreviousMonth and CurrentMonth are components that fetch data,
    // we can't call them directly here. Instead, we'll render them conditionally.
  }, []);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    // <div className="flex h-screen bg-gray-100">
    //   {/* Sidebar */}
    //   <aside className="bg-blue-100 p-4 flex flex-col items-start rounded-md my-2">
    //     <Link href={pathname || '/'} className="mb-8 block">
    //       <Image
    //         src="https://www.peakxv.com/wp-content/uploads/sites/2/2022/03/logo_eduvanz.png"
    //         width={80}
    //         height={44}
    //         alt="company logo"
    //       />
    //     </Link>
    //     <nav className="text-gray-800">
    //       <ul className="space-y-4">
    //         <li className={pathname === '/' ? 'font-bold' : ''}>
    //           <Link href="/" onClick={() => handleTabClick('Home')}>
    //             Home
    //           </Link>
    //         </li>
    //         <li className={pathname === '/display' ? 'font-bold' : ''}>
    //           <Link href="/display" onClick={() => handleTabClick('Display')}>
    //             Nach Presented
    //           </Link>
    //         </li>
    //         <li className={pathname === '/todays_nach' ? 'font-bold' : ''}>
    //           <Link
    //             href="/todays_nach"
    //             onClick={() => handleTabClick('Todays Nach')}
    //           >
    //             Today's Nach
    //           </Link>
    //         </li>
    //         <li className={pathname === '/all-nach' ? 'font-bold' : ''}>
    //           <Link
    //             href="/nach_presentation"
    //             onClick={() => handleTabClick('All Nach')}
    //           >
    //             All Nach
    //           </Link>
    //         </li>
    //       </ul>
    //     </nav>
    //   </aside>

    //   {/* Main content */}
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
                  <CurrentMonth />
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
    </main>
    // </div>
  );
};

export default Home;
