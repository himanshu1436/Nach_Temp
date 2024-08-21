'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { CurrentMonth } from './curr_month';
import { PreviousMonth } from './prev_month';
import YearDataTable from './YearDataTable';
import { useInView } from 'react-intersection-observer';

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

  // const FilterComponent = () => {
  //   const [showFilters, setShowFilters] = useState(false);

  //   const toggleFilters = () => {
  //     setShowFilters(!showFilters);
  //   };

  //   return (
  //     <div className="relative">
  //       {/* Filter Button */}
  //       <button
  //         onClick={toggleFilters}
  //         className="flex items-center justify-center p-2 bg-blue-500 text-white rounded-md"
  //       >
  //         <FaFilter className="mr-2" />
  //         Filters
  //       </button>

  //       {/* Filter Options */}
  //       {showFilters && (
  //         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
  //           <div className="bg-white p-4 rounded-lg shadow-lg">
  //             <h2 className="text-xl font-semibold mb-4">Filter Options</h2>
  //             {/* Add your filter options here */}
  //             <div className="flex flex-col space-y-4">
  //               <label>
  //                 <input type="checkbox" name="filter1" /> Filter 1
  //               </label>
  //               <label>
  //                 <input type="checkbox" name="filter2" /> Filter 2
  //               </label>
  //               <label>
  //                 <input type="checkbox" name="filter3" /> Filter 3
  //               </label>
  //             </div>
  //             <button
  //               onClick={toggleFilters}
  //               className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
  //             >
  //               Apply Filters
  //             </button>
  //           </div>
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

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
