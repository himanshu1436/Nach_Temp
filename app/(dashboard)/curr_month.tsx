// 'use client';

// import React, { useState, useEffect } from 'react';

// interface CustomerData {
//   provider_type: string;
//   current_status: string;
//   person_name: string;
//   ifsc_code: string;
//   loan_initiated: number;
//   customer_id: string;
//   account_number: string;
//   email: string;
//   auth_type: string;
//   bank_name: number;
//   method: string;
//   proposed_payment_date: string;
//   emi_amount: number;
//   mobile_num: string;
//   receipt: string;
//   start_date: Record<string, never>;
//   debit_type: number;
//   year: string;
//   amount: number;
//   payment_capture: string;
//   account_type: number;
//   description: string;
//   nach_provider: string;
//   loan_id: number;
// }

// const CurrentMonth: React.FC = () => {
//   const [customerData, setCustomerData] = useState<CustomerData[]>([]);
//   const [totalAmount, setTotalAmount] = useState<number>(0);
//   const [failCount, setFailCount] = useState<number>(0);

//   const [sucessfullAmount, setSucessfullAmount] = useState<number>(0);
//   const [sucessfullCount, setSucessfullCount] = useState<number>(0);

//   useEffect(() => {
//     async function fetchData() {
//       const res = await fetch(
//         'http://localhost:4000/nach/fetch-current-month-data'
//       );

//       const data: CustomerData[] = await res.json();
//       setCustomerData(data);
//       console.log(data);

//       let currentMonth: number = new Date().getMonth() + 1;

//       let total: number = 0;
//       let sTotal: number = 0;
//       let sCount: number = 0;

//       data.forEach((ele, index) => {
//         const eleMonth = new Date(ele.proposed_payment_date).getMonth() + 1;

//         total += ele.emi_amount;
//         if (ele.current_status == 'captured') {
//           sTotal += ele.emi_amount;
//           sCount++;
//         }
//       });
//       setTotalAmount(total);
//       setSucessfullAmount(sTotal);
//       setSucessfullCount(sCount);

//       console.table([total, sTotal, sCount]);
//     }

//     fetchData();
//   }, []);

//   return (
//     <div className="w-full mx-auto px-4">
//       <h1 className="text-lg font-bold mb-4">Current Month's NACH Details</h1>

//       <div className="mt-4 flex flex-col space-y-4">
//         <div>
//           <p className="text-sm">Total Amount: ₹{totalAmount.toFixed(2)}</p>
//         </div>
//         <div className="flex space-x-4 justify-between">
//           <p className="text-sm">
//             Successful Amount: ₹{sucessfullAmount.toFixed(2)}
//           </p>
//           <p className="text-sm">Successful Count: {sucessfullCount}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export { CurrentMonth };

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

const CurrentMonth: React.FC = () => {
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [successfulAmount, setSuccessfulAmount] = useState<number>(0);
  const [successfulCount, setSuccessfulCount] = useState<number>(0);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const res = await fetch(
          'http://localhost:4000/nach/fetch-current-month-data'
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
      <h1 className="text-lg font-bold mb-4">Current Month's NACH Details</h1>

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

export { CurrentMonth };
