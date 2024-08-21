'use client';

import React, { useState, useEffect } from 'react';

interface StatusData {
  'current_status.s': string;
  status_count: string;
  total_emi_amount: string;
}

interface ApiResponse {
  yearMonth: string;
  statusCounts: StatusData[];
  emiAmounts: StatusData[];
}

const PreviousMonth: React.FC = () => {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [successfulAmount, setSuccessfulAmount] = useState<number>(0);
  const [successfulCount, setSuccessfulCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const res = await fetch(
          'http://localhost:4000/nach/fetch-previous-month-data'
        );
        const data: ApiResponse = await res.json();
        setApiData(data);

        let total = 0;
        let sTotal = 0;
        let sCount = 0;

        // Combine statusCounts and emiAmounts
        const combinedData = data.statusCounts.map((count) => {
          const emiAmount = data.emiAmounts.find(
            (emi) => emi['current_status.s'] === count['current_status.s']
          );
          return {
            ...count,
            total_emi_amount: emiAmount
              ? parseFloat(emiAmount.total_emi_amount)
              : 0
          };
        });

        combinedData.forEach((item) => {
          const emiAmount = parseFloat(
            item.total_emi_amount as unknown as string
          );
          const statusCount = parseInt(item.status_count, 10);

          total += emiAmount;
          if (item['current_status.s'].toLowerCase() === 'captured') {
            sTotal += emiAmount;
            sCount += statusCount;
          }
        });

        setTotalAmount(total);
        setSuccessfulAmount(sTotal);
        setSuccessfulCount(sCount);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full mx-auto px-4">
      <h1 className="text-lg font-bold mb-4">Prev Month's NACH Details</h1>

      <div className="mt-4 flex flex-col space-y-4">
        <div>
          <p className="text-sm">Total Amount: ₹{totalAmount.toFixed(2)}</p>
        </div>
        <div className="flex space-x-4 justify-between">
          <p className="text-sm">
            Successful Amount: ₹{successfulAmount.toFixed(2)}
          </p>
          <p className="text-sm">Successful Count: {successfulCount}</p>
        </div>
      </div>
    </div>
  );
};

export { PreviousMonth };
