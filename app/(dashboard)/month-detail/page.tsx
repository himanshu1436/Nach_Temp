// 'use client';

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import Image from 'next/image';
// import { useSearchParams, useRouter } from 'next/navigation';
// import { Search, ChevronDown, Filter } from 'lucide-react';
// import * as Dialog from '@radix-ui/react-dialog';
// import axios from 'axios';
// import moment from 'moment';
// import {
//   Table,
//   TableHeader,
//   TableBody,
//   TableHead,
//   TableRow,
//   TableCell,
//   TableCaption
// } from '@/components/ui/monthlyTable';
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription
// } from '@/components/ui/card';
// import { Button } from '@/components/ui/button2';
// import { Input } from '@/components/ui/input';
// import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

// interface EntryData {
//   current_status: string;
//   person_name: string;
//   ifsc_code: string;
//   loan_initiated: number;
//   customer_id: string;
//   account_number: string;
//   email: string;
//   auth_type: string;
//   method: string;
//   proposed_payment_date: string;
//   emi_amount: number;
//   mobile_num: string;
//   receipt: string;
//   start_date: any;
//   debit_type: number;
//   amount: number;
//   payment_capture: string;
//   account_type: number;
//   description: string;
//   nach_provider: string;
//   loan_id: number;
//   year?: number;
//   expire_at?: string;
//   order_id: string;
//   token_id: string;
//   provider_type?: string;
// }

// interface Metadata {
//   currentPage: number;
//   itemsPerPage: number;
//   totalPages: number;
//   totalItems: number;
//   searchMessage?: string;
// }

// const monthToNumber: { [key: string]: number } = {
//   January: 1,
//   February: 2,
//   March: 3,
//   April: 4,
//   May: 5,
//   June: 6,
//   July: 7,
//   August: 8,
//   September: 9,
//   October: 10,
//   November: 11,
//   December: 12
// };

// const ENTRIES_PER_PAGE = 100;

// const MonthDetail: React.FC = () => {
//   const [monthData, setMonthData] = useState<EntryData[]>([]);
//   const [searchInput, setSearchInput] = useState('');
//   const [isSearchActive, setIsSearchActive] = useState(false);
//   const [selectedNachProviders, setSelectedNachProviders] = useState<string[]>(
//     []
//   );
//   const [selectedRows, setSelectedRows] = useState<number[]>([]);
//   const [resetTrigger, setResetTrigger] = useState(0);
//   const [searchMessage, setSearchMessage] = useState('');
//   const [loadingProgress, setLoadingProgress] = useState(0);
//   const [metadata, setMetadata] = useState<Metadata>({
//     currentPage: 1,
//     itemsPerPage: ENTRIES_PER_PAGE,
//     totalPages: 1,
//     totalItems: 0
//   });
//   const [sortOrder, setSortOrder] = useState<'ascending' | 'descending' | null>(
//     null
//   );
//   const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
//   const month = searchParams.get('month')?.split(' ')[0];
//   const monthNumber = month ? monthToNumber[month] || 1 : 1;
//   const currentPage = parseInt(searchParams.get('page') || '1', 10);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isInitialLoad, setIsInitialLoad] = useState(true);
//   const eventSourceRef = useRef<EventSource | null>(null);

//   const isPresentNachEnabled = selectedRows.length > 0;
//   const [tokenIdInput, setTokenIdInput] = useState('');

//   const handleStatusSelect = (status: string | null) => {
//     console.log('Status selected:', status);
//     setSelectedStatus(status);
//     setIsSearchActive(false);

//     const currentParams = new URLSearchParams(searchParams.toString());
//     currentParams.set('page', '1');

//     if (status) {
//       const statusParam =
//         status === 'Not Presented' ? 'null' : status.toLowerCase();
//       console.log('Setting c_s parameter to:', statusParam);
//       currentParams.set('c_s', statusParam);
//     } else {
//       currentParams.delete('c_s');
//     }

//     const newUrl = `${window.location.pathname}?${currentParams.toString()}`;
//     console.log('New URL:', newUrl);

//     router.replace(newUrl);
//   };

//   const getStatusDisplay = (status: string) => {
//     if (!status || status.trim() === '') {
//       return { text: 'Not Presented', color: 'text-red-600' };
//     }
//     const capitalizedStatus = capitalizeName(status);
//     if (capitalizedStatus.toLowerCase() === 'captured') {
//       return { text: capitalizedStatus, color: 'text-green-600' };
//     }
//     return { text: capitalizedStatus, color: 'text-gray-700' };
//   };

//   const isRowSelectable = (entry: EntryData) => {
//     // if (selectedStatus) {
//     //   return !entry.current_status || entry.current_status.trim() === '';
//     // }
//     // return !['captured', 'authorized'].includes(
//     //   entry.current_status?.toLowerCase() || ''
//     // );
//     return true;
//   };

//   const handleReset = () => {
//     setSortOrder(null);
//     setSearchInput('');
//     setSelectedNachProviders([]);
//     setIsSearchActive(false);
//     setSelectedStatus(null);
//     setResetTrigger((prev) => prev + 1);

//     const currentParams = new URLSearchParams(searchParams.toString());
//     currentParams.delete('sort');
//     currentParams.delete('s_o');
//     currentParams.delete('search');
//     currentParams.delete('c_s');
//     currentParams.set('page', '1');

//     router.push(`${window.location.pathname}?${currentParams.toString()}`);
//   };

//   const isEligibleForCreateOrder = (entry: EntryData) => {
//     return entry.token_id && (!entry.order_id || entry.order_id.trim() === '');
//   };

//   // Add this function to check if an entry is eligible for recurring payment
//   const isEligibleForRecurringPayment = (entry: EntryData) => {
//     return (
//       entry.token_id &&
//       entry.order_id &&
//       (!entry.current_status || entry.current_status.trim() === '')
//     );
//   };

//   const handleCheckboxChange = (loanId: number) => {
//     const entry = monthData.find((e) => e.loan_id === loanId);
//     if (entry && isRowSelectable(entry)) {
//       setSelectedRows((prev) =>
//         prev.includes(loanId)
//           ? prev.filter((id) => id !== loanId)
//           : [...prev, loanId]
//       );
//     }
//   };

//   const handleSelectAllChange = (
//     event: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     if (event.target.checked) {
//       const selectableRows = monthData
//         .filter(isRowSelectable)
//         .map((entry) => entry.loan_id);
//       setSelectedRows(selectableRows);
//     } else {
//       setSelectedRows([]);
//     }
//   };

//   const fetchData = useCallback(
//     (searchQuery?: string) => {
//       if (!month) return;

//       setIsLoading(true);
//       setMonthData([]);
//       setSearchMessage('');
//       setLoadingProgress(0);

//       if (eventSourceRef.current) {
//         eventSourceRef.current.close();
//       }
//       let firstObjectLogged = false;

//       let url = `http://localhost:4000/nach/fetch-data-by-month?month=${monthNumber}&page=${currentPage}`;

//       if (sortOrder) {
//         url += `&sort=emi_amount&s_o=${sortOrder}`;
//       }
//       if (searchQuery) {
//         const isName = /^[a-zA-Z\s]+$/.test(searchQuery);
//         const searchType = isName ? 'search_name' : 'loan_id';
//         url += `&${searchType}=${encodeURIComponent(searchQuery)}`;
//       }

//       const statusParam = searchParams.get('c_s');
//       if (statusParam) {
//         url += `&c_s=${statusParam}`;
//       }

//       console.log('Fetching data with URL:', url);

//       const eventSource = new EventSource(url);
//       eventSourceRef.current = eventSource;

//       let receivedData: EntryData[] = [];

//       eventSource.onmessage = (event) => {
//         try {
//           const parsedData = JSON.parse(event.data);
//           if (Array.isArray(parsedData)) {
//             receivedData = [...receivedData, ...parsedData];
//             if (!firstObjectLogged && receivedData.length > 0) {
//               console.log('First object of first page:', receivedData[0]);
//               firstObjectLogged = true;
//             }
//             setMonthData(receivedData);
//           } else if (
//             typeof parsedData === 'object' &&
//             !Array.isArray(parsedData)
//           ) {
//             receivedData = [...receivedData, parsedData];

//             setMonthData(receivedData);
//           }

//           console.log('data:' + receivedData);
//         } catch (error) {
//           console.error('Error parsing event data:', error);
//         }
//       };

//       eventSource.addEventListener('searchProgress', (event) => {
//         setSearchMessage(event.data);
//       });

//       eventSource.addEventListener('searchComplete', (event) => {
//         setSearchMessage(event.data);
//         setIsLoading(false);
//         setIsInitialLoad(false);
//         eventSource.close();
//       });

//       eventSource.addEventListener('progress', (event) => {
//         try {
//           const progressData = JSON.parse(event.data);
//           setLoadingProgress(progressData.totalItems);
//           setMetadata((prevMetadata) => ({
//             ...prevMetadata,
//             totalItems: progressData.totalItems,
//             totalPages: Math.ceil(progressData.totalItems / ENTRIES_PER_PAGE)
//           }));
//         } catch (error) {
//           console.error('Error parsing progress data:', error);
//         }
//       });

//       eventSource.addEventListener('meta', (event) => {
//         try {
//           const metaData: Metadata = JSON.parse(event.data);
//           setMetadata((prevMetadata) => ({
//             ...metaData,
//             currentPage,
//             itemsPerPage: ENTRIES_PER_PAGE,
//             totalItems: Math.max(metaData.totalItems, prevMetadata.totalItems)
//           }));
//         } catch (error) {
//           console.error('Error parsing meta data:', error);
//         }
//       });

//       eventSource.addEventListener('end', () => {
//         setIsLoading(false);
//         setIsInitialLoad(false);
//         eventSource.close();
//       });

//       eventSource.onerror = (error) => {
//         console.error('EventSource failed:', error);
//         setIsLoading(false);
//         setIsInitialLoad(false);
//         eventSource.close();
//       };
//     },
//     [month, monthNumber, currentPage, sortOrder, searchParams]
//   );

//   // useEffect(() => {
//   //   fetchData();
//   //   return () => {
//   //     if (eventSourceRef.current) {
//   //       eventSourceRef.current.close();
//   //     }
//   //   };
//   // }, [fetchData, sortOrder, currentPage, resetTrigger]);

//   // useEffect(() => {
//   //   fetchData();
//   //   return () => {
//   //     if (eventSourceRef.current) {
//   //       eventSourceRef.current.close();
//   //     }
//   //   };
//   // }, [fetchData, sortOrder, currentPage, resetTrigger, selectedStatus]);

//   // // useEffect(() => {
//   // //   const status = searchParams.get('c_s');
//   // //   console.log("URL changed. Current status from URL:", status);
//   // //   if (status) {
//   // //     setSelectedStatus(status === 'null' ? 'Not Presented' : status);
//   // //   } else {
//   // //     setSelectedStatus(null);
//   // //   }
//   // // }, [searchParams]);

//   useEffect(() => {
//     fetchData();
//     return () => {
//       if (eventSourceRef.current) {
//         eventSourceRef.current.close();
//       }
//     };
//   }, [fetchData, sortOrder, currentPage, resetTrigger, searchParams]); // Add searchParams here

//   const handleSearch = () => {
//     setIsSearchActive(true);
//     fetchData(searchInput);
//   };

//   const capitalizeName = (name: string): string => {
//     if (name) {
//       return name
//         .toLowerCase()
//         .split(' ')
//         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(' ');
//     }
//     return 'None';
//   };

//   const toLowerCaseEmail = (email: string): string =>
//     email ? email.toLowerCase() : 'None';

//   const updateURL = (page: number) => {
//     const currentParams = new URLSearchParams(window.location.search);
//     currentParams.set('page', page.toString());
//     if (sortOrder) {
//       currentParams.set('sort', 'emi_amount');
//       currentParams.set('s_o', sortOrder);
//     } else {
//       currentParams.delete('sort');
//       currentParams.delete('s_o');
//     }
//     if (searchInput) {
//       currentParams.set('search', searchInput);
//     } else {
//       currentParams.delete('search');
//     }
//     router.push(`${window.location.pathname}?${currentParams.toString()}`);
//   };

//   const nextPage = () => {
//     if (metadata.currentPage < metadata.totalPages) {
//       updateURL(metadata.currentPage + 1);
//     }
//   };

//   const prevPage = () => {
//     if (metadata.currentPage > 1) {
//       updateURL(metadata.currentPage - 1);
//     }
//   };

//   const handleSortChange = (order: 'ascending' | 'descending') => {
//     setSortOrder((prevOrder) => (prevOrder === order ? null : order));
//     applyFilters();
//   };

//   const getEntryRange = () => {
//     const start = (metadata.currentPage - 1) * metadata.itemsPerPage + 1;
//     const end = Math.min(
//       metadata.currentPage * metadata.itemsPerPage,
//       metadata.totalItems
//     );
//     return `${start}-${end}`;
//   };

//   const handleNachProviderChange = (provider: string) => {
//     setSelectedNachProviders((prev) =>
//       prev.includes(provider)
//         ? prev.filter((p) => p !== provider)
//         : [...prev, provider]
//     );
//     applyFilters();
//   };

//   const applyFilters = () => {
//     setIsFilterModalOpen(false);
//     updateURL(1);
//   };

//   const handleUpdateCustomerAndOrderId = async () => {
//     if (selectedRows.length !== 1) {
//       console.error('Please select exactly one row to update');
//       return;
//     }

//     const selectedEntry = monthData.find(
//       (entry) => entry.loan_id === selectedRows[0]
//     );

//     // if (!selectedEntry || !isEligibleForCreateOrder(selectedEntry)) {
//     //   console.error('Selected entry is not eligible for order creation');
//     //   return;
//     // }

//     try {
//       const response = await axios.post(
//         'http://localhost:4000/update-customer-id-and-order-id',
//         selectedEntry
//       );
//       console.log('Update response:', response.data);

//       // Update the monthData with the new customer_id and order_id
//       setMonthData((prevData) =>
//         prevData.map((entry) =>
//           entry.loan_id === selectedRows[0]
//             ? {
//                 ...entry,
//                 customer_id: response.data.updatedItem.customer_id,
//                 order_id: response.data.updatedItem.order_id
//               }
//             : entry
//         )
//       );

//       // Clear the selection
//       setSelectedRows([]);
//     } catch (error) {
//       console.error('Error updating customer and order ID:', error);
//     }
//   };

//   const newOrderData = async () => {
//     const today = moment();
//     try {
//       const response = await axios.get<EntryData[]>(
//         'http://localhost:4000/nach/fetch-data'
//       );
//       const filteredData = response.data.filter((customer) => {
//         const presentationDate = moment(customer.proposed_payment_date);
//         return presentationDate.isSame(today, 'day');
//       });
//       setMonthData(filteredData);
//     } catch (error) {
//       console.error('Error fetching new order data:', error);
//     }
//   };

//   const handleRecurringPayment = async () => {
//     try {
//       if (selectedRows.length === 0) {
//         console.error('No customers selected for recurring payment');
//         return;
//       }

//       const selectedCustomers = monthData.filter((customer) =>
//         selectedRows.includes(customer.loan_id)
//       );

//       console.log('Selected Customers:', selectedCustomers);

//       const response = await fetch(
//         'http://localhost:4000/nach/recurring_payments',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(selectedCustomers)
//         }
//       );

//       if (!response.ok) {
//         const errorResponse = await response.json();
//         throw new Error(
//           `Error creating recurring payment: ${errorResponse.error}`
//         );
//       }

//       const responseData = await response.json();
//       console.log('Recurring Payment Successful:', responseData);

//       // Update the monthData with the new status
//       setMonthData((prevData) =>
//         prevData.map((entry) =>
//           selectedRows.includes(entry.loan_id)
//             ? { ...entry, current_status: responseData[0].paymentStatus }
//             : entry
//         )
//       );

//       alert(responseData[0].paymentStatus);
//     } catch (error) {
//       console.error('Error processing recurring payments:', error);
//     }
//   };

//   // const handleUpdateTokenId = async () => {
//   //   if (selectedRows.length !== 1) {
//   //     console.error('Please select exactly one row to update');
//   //     return;
//   //   }

//   //   const selectedEntry = monthData.find(
//   //     (entry) => entry.loan_id === selectedRows[0]
//   //   );

//   //   if (!selectedEntry) {
//   //     console.error('Selected entry not found');
//   //     return;
//   //   }

//   //   if (!tokenIdInput) {
//   //     console.error('Token ID is required');
//   //     return;
//   //   }

//   //   try {
//   //     const response = await axios.post(
//   //       'http://localhost:4000/update-token-id',
//   //       {
//   //         ...selectedEntry,
//   //         token_id: tokenIdInput
//   //       }
//   //     );
//   //     console.log('Update response:', response.data);

//   //     // Update the monthData with the new token_id
//   //     setMonthData((prevData) =>
//   //       prevData.map((entry) =>
//   //         entry.loan_id === selectedRows[0]
//   //           ? {
//   //               ...entry,
//   //               token_id: response.data.updatedItem.token_id
//   //             }
//   //           : entry
//   //       )
//   //     );

//   //     // Clear the selection and input
//   //     setSelectedRows([]);
//   //     setTokenIdInput('');
//   //   } catch (error) {
//   //     console.error('Error updating token ID:', error);
//   //   }
//   // };

//   const handleCreateOrderAndPayment = async () => {
//     if (selectedRows.length !== 1) {
//       console.error('Please select exactly one row to process');
//       return;
//     }

//     const selectedEntry = monthData.find(
//       (entry) => entry.loan_id === selectedRows[0]
//     );

//     if (!selectedEntry) {
//       console.error('Selected entry not found');
//       return;
//     }

//     try {
//       const response = await axios.post(
//         'http://localhost:4000/create-order-and-payment',
//         selectedEntry
//       );
//       console.log('Create order and payment response:', response.data);

//       // Update the monthData with the new order_id and payment status
//       setMonthData((prevData) =>
//         prevData.map((entry) =>
//           entry.loan_id === selectedRows[0]
//             ? {
//                 ...entry,
//                 order_id: response.data.order_id,
//                 current_status: 'Processed' // You can adjust this status as needed
//               }
//             : entry
//         )
//       );

//       // Clear the selection
//       setSelectedRows([]);

//       // Show a success message to the user
//       alert('Order created and payment processed successfully!');
//     } catch (error) {
//       console.error('Error creating order and processing payment:', error);
//       alert('Failed to create order and process payment. Please try again.');
//     }
//   };

//   const handleUpdateTokenId = async () => {
//     if (selectedRows.length !== 1) {
//       console.error('Please select exactly one row to update');
//       return;
//     }

//     const selectedEntry = monthData.find(
//       (entry) => entry.loan_id === selectedRows[0]
//     );

//     if (!selectedEntry) {
//       console.error('Selected entry not found');
//       return;
//     }

//     if (!tokenIdInput) {
//       console.error('Token ID is required');
//       return;
//     }

//     try {
//       const response = await axios.post(
//         'http://localhost:4000/update-token-id',
//         {
//           ...selectedEntry,
//           token_id: tokenIdInput
//         }
//       );
//       console.log('Update response:', response.data);

//       // Update the monthData with the new token_id
//       setMonthData((prevData) =>
//         prevData.map((entry) =>
//           entry.loan_id === selectedRows[0]
//             ? {
//                 ...entry,
//                 token_id: response.data.updatedItem.token_id
//               }
//             : entry
//         )
//       );

//       // Clear the selection and input
//       setSelectedRows([]);
//       setTokenIdInput('');
//     } catch (error) {
//       console.error('Error updating token ID:', error);
//     }
//   };

//   const isNextDisabled =
//     isLoading || isSearchActive || metadata.currentPage >= metadata.totalPages;
//   const isPrevDisabled =
//     isLoading || isSearchActive || metadata.currentPage === 1;

//   const fieldsToShow = [
//     'loan_id',
//     'customer_id',
//     'current_status',
//     'order_id',
//     'token_id',
//     'emi_amount',
//     'email',
//     'person_name',
//     'account_number',
//     'description',
//     'ifsc_code',
//     'receipt',
//     'start_date',
//     'year',
//     'method',
//     'payment_capture',
//     'auth_type',
//     'mobile_num',
//     'provider_type',
//     'proposed_payment_date'
//   ];

//   return (
//     <div className="relative w-full max-w-full overflow-hidden pb-16 animate-fade-in-up">
//       <style jsx global>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

//         body {
//           font-family: 'Inter', sans-serif;
//         }
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 6px;
//           height: 6px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: #f1f1f1;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: #888;
//           border-radius: 3px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: #555;
//         }

//         .react-tabs__tab {
//           position: relative;
//           padding-bottom: 8px; /* Adjust if needed */
//         }

//         .react-tabs__tab--selected::after {
//           content: '';
//           position: absolute;
//           bottom: 0;
//           left: 0;
//           width: 100%;
//           height: 2px; /* Adjust the thickness of the underline */
//           background: blue; /* Change to your desired underline color */
//           transition: none; /* Ensure underline doesn't animate or disappear */
//         }
//       `}</style>
//       <Card className="mb-16">
//         <CardHeader className="flex flex-col space-y-4">
//           <div>
//             <CardTitle>Details for {month}</CardTitle>
//             <CardDescription>
//               {isLoading ? (
//                 `Loading... (${loadingProgress} items loaded)`
//               ) : isSearchActive ? (
//                 `Showing ${monthData.length} search results`
//               ) : (
//                 <>
//                   Showing {getEntryRange()} entries
//                   {metadata.totalItems > 0 &&
//                     ` (Total: ${metadata.totalItems})`}
//                 </>
//               )}
//               {searchMessage && (
//                 <div className="text-sm text-blue-500 mt-1">
//                   {searchMessage}
//                 </div>
//               )}
//               {selectedRows.length > 0 && (
//                 <div className="text-sm text-blue-500 mt-1">
//                   {selectedRows.length} row(s) selected
//                 </div>
//               )}
//             </CardDescription>
//           </div>
//           <Tabs
//             selectedIndex={['Captured', 'Authorized', 'Not Presented'].indexOf(
//               selectedStatus || ''
//             )}
//             onSelect={(index) =>
//               handleStatusSelect(
//                 ['Captured', 'Authorized', 'Not Presented'][index] || null
//               )
//             }
//             className="flex flex-col"
//           >
//             <TabList className="flex border-b-0">
//               {['Captured', 'Authorized', 'Not Presented'].map(
//                 (status, index) => (
//                   <Tab
//                     key={status}
//                     className={`
//         px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out
//         border-t border-r first:border-l first:rounded-tl-md last:rounded-tr-md
//         ${index === 0 ? 'border-l' : ''}
//         hover:bg-gray-50 focus:outline-none
//         cursor-pointer
//          hover:font-semibold
//       `}
//                     selectedClassName="bg-blue-100 border-b-0 relative z-10 text-blue-600"
//                   >
//                     {status}
//                   </Tab>
//                 )
//               )}
//             </TabList>
//           </Tabs>
//           <div className="flex items-center space-x-2">
//             {/* <Button
//               onClick={handleRecurringPayment}
//               className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105"
//               disabled={
//                 !selectedRows.some((id) => {
//                   const entry = monthData.find((e) => e.loan_id === id);
//                   return entry && isEligibleForRecurringPayment(entry);
//                 })
//               }
//             >
//               Start Recurring Payment
//             </Button> */}

//             <Button
//               onClick={handleCreateOrderAndPayment}
//               className="bg-green-500 hover:bg-green-600 text-white transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105"
//               disabled={selectedRows.length !== 1}
//             >
//               Present
//             </Button>

//             {/* <Input
//               type="text"
//               placeholder="Enter Token ID"
//               value={tokenIdInput}
//               onChange={(e) => setTokenIdInput(e.target.value)}
//               className="w-56 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
//             /> */}

//             {/* <Button
//               onClick={handleUpdateTokenId}
//               className="bg-purple-500 hover:bg-purple-600 text-white transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105"
//               disabled={selectedRows.length !== 1 || !tokenIdInput}
//             >
//               Update Token ID
//             </Button> */}

//             {/* <Button
//               onClick={handleUpdateCustomerAndOrderId}
//               className="bg-yellow-500 hover:bg-yellow-600 text-white transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105"
//               // disabled={
//               //   selectedRows.length !== 1 ||
//               //   !monthData.find(
//               //     (e) =>
//               //       e.loan_id === selectedRows[0] && isEligibleForCreateOrder(e)
//               //   )
//               // }
//             >
//               Create an Order
//             </Button> */}

//             <Button
//               onClick={handleReset}
//               className="bg-red-500 hover:bg-red-600 text-white transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105"
//               disabled={isLoading || isInitialLoad}
//             >
//               Reset All
//             </Button>

//             <div className="relative">
//               <Input
//                 type="text"
//                 placeholder="Search by Name/Loan ID"
//                 value={searchInput}
//                 onChange={(e) => setSearchInput(e.target.value)}
//                 className="w-56 pr-8 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
//                 onKeyPress={(e) => {
//                   if (e.key === 'Enter') {
//                     handleSearch();
//                   }
//                 }}
//                 disabled={isLoading || isInitialLoad}
//               />
//               <button
//                 onClick={handleSearch}
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105"
//                 disabled={isLoading || isInitialLoad}
//               >
//                 <Search size={18} />
//               </button>
//             </div>

//             <Dialog.Root
//               open={isFilterModalOpen}
//               onOpenChange={setIsFilterModalOpen}
//             >
//               <Dialog.Trigger asChild>
//                 <Button
//                   className="transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105"
//                   disabled={isLoading || isInitialLoad}
//                 >
//                   Filters <Filter size={16} className="ml-2" />
//                 </Button>
//               </Dialog.Trigger>
//               <Dialog.Portal>
//                 <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
//                 <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-xl w-[500px] animate-scale-in">
//                   <Dialog.Title className="text-lg font-bold mb-3"></Dialog.Title>
//                   <div className="flex space-x-2">
//                     <div className="flex-1 border-r pr-2">
//                       <h3 className="font-semibold mb-1 text-sm">
//                         NACH Provider
//                       </h3>
//                       <div className="space-y-1">
//                         {['Razorpay', 'Axis', 'Salesforce'].map((provider) => (
//                           <button
//                             key={provider}
//                             onClick={() => handleNachProviderChange(provider)}
//                             className={`w-full text-left py-1 px-2 text-sm ${
//                               selectedNachProviders.includes(provider)
//                                 ? 'font-semibold bg-blue-100'
//                                 : 'font-normal'
//                             } transition-all duration-200 ease-in-out hover:bg-gray-100 rounded`}
//                           >
//                             {provider}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                     <div className="flex-1 pl-2">
//                       <h3 className="font-semibold mb-1 text-sm">
//                         Sort by EMI
//                       </h3>
//                       <div className="space-y-1">
//                         {['Ascending', 'Descending'].map((option) => (
//                           <button
//                             key={option}
//                             onClick={() =>
//                               handleSortChange(
//                                 option.toLowerCase() as
//                                   | 'ascending'
//                                   | 'descending'
//                               )
//                             }
//                             className={`w-full text-left py-1 px-2 text-sm ${
//                               sortOrder === option.toLowerCase()
//                                 ? 'font-semibold bg-blue-100'
//                                 : 'font-normal'
//                             } transition-all duration-200 ease-in-out hover:bg-gray-100 rounded`}
//                           >
//                             {option}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </Dialog.Content>
//               </Dialog.Portal>
//             </Dialog.Root>
//           </div>
//         </CardHeader>
//         <CardContent className="overflow-auto max-h-[70vh] custom-scrollbar">
//           <div className="w-max min-w-full">
//             <Table>
//               <TableCaption>Month Detail Data</TableCaption>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead className="font-bold w-10">
//                     <input
//                       type="checkbox"
//                       className="form-checkbox h-5 w-5 mt-1 text-blue-600 transition duration-150 ease-in-out"
//                       checked={
//                         selectedRows.length > 0 &&
//                         selectedRows.length ===
//                           monthData.filter(isRowSelectable).length
//                       }
//                       onChange={handleSelectAllChange}
//                     />
//                   </TableHead>
//                   {fieldsToShow.map((field, index) => (
//                     <TableHead key={index} className="font-bold">
//                       {field.replace(/_/g, ' ').toUpperCase()}
//                     </TableHead>
//                   ))}
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {monthData.map((entry, index) => (
//                   <TableRow
//                     key={index}
//                     className="animate-fade-in-up"
//                     style={{ animationDelay: `${index * 50}ms` }}
//                   >
//                     <TableCell className="w-10">
//                       {isRowSelectable(entry) && (
//                         <input
//                           type="checkbox"
//                           className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
//                           checked={selectedRows.includes(entry.loan_id)}
//                           onChange={() => handleCheckboxChange(entry.loan_id)}
//                         />
//                       )}
//                     </TableCell>
//                     {fieldsToShow.map((field, cellIndex) => {
//                       if (field === 'current_status') {
//                         const { text, color } = getStatusDisplay(entry[field]);
//                         return (
//                           <TableCell key={cellIndex} className={color}>
//                             {text}
//                           </TableCell>
//                         );
//                       }
//                       if (field === 'person_name') {
//                         return (
//                           <TableCell key={cellIndex} className="text-gray-700">
//                             {capitalizeName(entry[field])}
//                           </TableCell>
//                         );
//                       }
//                       if (field === 'email') {
//                         return (
//                           <TableCell key={cellIndex} className="text-gray-700">
//                             {toLowerCaseEmail(entry[field])}
//                           </TableCell>
//                         );
//                       }
//                       return (
//                         <TableCell key={cellIndex} className="text-gray-700">
//                           {entry[field as keyof EntryData] != null
//                             ? String(entry[field as keyof EntryData])
//                             : ' '}
//                         </TableCell>
//                       );
//                     })}
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </div>
//         </CardContent>
//       </Card>
//       <div className="fixed bottom-4 left-0 right-0 flex justify-center items-center z-10">
//         <div className="flex items-center bg-white rounded-full shadow-sm px-2 py-1">
//           <Button
//             onClick={prevPage}
//             disabled={isPrevDisabled}
//             variant="pagination"
//             size="sm"
//             className="rounded-l-full transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105"
//           >
//             &lt;
//           </Button>
//           <span className="px-3 text-xs font-medium text-gray-600">
//             {isSearchActive
//               ? 'Search Results'
//               : `${metadata.currentPage}/${metadata.totalPages || 1}`}
//           </span>
//           <Button
//             onClick={nextPage}
//             disabled={isNextDisabled}
//             variant="pagination"
//             size="sm"
//             className="rounded-r-full transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105"
//           >
//             &gt;
//           </Button>
//         </div>
//       </div>
//     </div>
//   );

// };

// export default MonthDetail;

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, ChevronDown, Filter } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import axios from 'axios';
import moment from 'moment';
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
import { Button } from '@/components/ui/button2';
import { Input } from '@/components/ui/input';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { RiCloseCircleLine } from 'react-icons/ri';

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
  year?: number;
  expire_at?: string;
  order_id: string;
  token_id: string;
  provider_type?: string;
}

interface Metadata {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalItems: number;
  searchMessage?: string;
}

const monthToNumber: { [key: string]: number } = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12
};

const ENTRIES_PER_PAGE = 100;

const MonthDetail: React.FC = () => {
  const [monthData, setMonthData] = useState<EntryData[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [selectedNachProviders, setSelectedNachProviders] = useState<string[]>(
    []
  );
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [resetTrigger, setResetTrigger] = useState(0);
  const [searchMessage, setSearchMessage] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [metadata, setMetadata] = useState<Metadata>({
    currentPage: 1,
    itemsPerPage: ENTRIES_PER_PAGE,
    totalPages: 1,
    totalItems: 0
  });
  const [sortOrder, setSortOrder] = useState<'ascending' | 'descending' | null>(
    null
  );
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const month = searchParams.get('month')?.split(' ')[0];
  const monthNumber = month ? monthToNumber[month] || 1 : 1;
  const currentPage = parseInt(searchParams.get('page') || '1', 10);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const eventSourceRef = useRef<EventSource | null>(null);

  const isPresentNachEnabled = selectedRows.length > 0;
  const [tokenIdInput, setTokenIdInput] = useState('');

  const handleStatusSelect = (status: string | null) => {
    console.log('Status selected:', status);
    setSelectedStatus(status);
    setIsSearchActive(false);

    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.set('page', '1');

    if (status) {
      const statusParam =
        status === 'Not Presented' ? 'null' : status.toLowerCase();
      console.log('Setting c_s parameter to:', statusParam);
      currentParams.set('c_s', statusParam);
    } else {
      currentParams.delete('c_s');
    }

    const newUrl = `${window.location.pathname}?${currentParams.toString()}`;
    console.log('New URL:', newUrl);

    router.replace(newUrl);
  };

  const getStatusDisplay = (status: string) => {
    if (!status || status.trim() === '') {
      return { text: 'Not Presented', color: 'text-red-600' };
    }
    const capitalizedStatus = capitalizeName(status);
    if (capitalizedStatus.toLowerCase() === 'captured') {
      return { text: capitalizedStatus, color: 'text-green-600' };
    }
    return { text: capitalizedStatus, color: 'text-gray-700' };
  };

  const isRowSelectable = (entry: EntryData) => {
    // if (selectedStatus) {
    //   return !entry.current_status || entry.current_status.trim() === '';
    // }
    // return !['captured', 'authorized'].includes(
    //   entry.current_status?.toLowerCase() || ''
    // );
    return true;
  };

  const handleReset = () => {
    setSortOrder(null);
    setSearchInput('');
    setSelectedNachProviders([]);
    setIsSearchActive(false);
    setSelectedStatus(null);
    setResetTrigger((prev) => prev + 1);

    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete('sort');
    currentParams.delete('s_o');
    currentParams.delete('search');
    currentParams.delete('c_s');
    currentParams.set('page', '1');

    router.push(`${window.location.pathname}?${currentParams.toString()}`);
  };

  const isEligibleForCreateOrder = (entry: EntryData) => {
    return entry.token_id && (!entry.order_id || entry.order_id.trim() === '');
  };

  // Add this function to check if an entry is eligible for recurring payment
  const isEligibleForRecurringPayment = (entry: EntryData) => {
    return (
      entry.token_id &&
      entry.order_id &&
      (!entry.current_status || entry.current_status.trim() === '')
    );
  };

  const handleCheckboxChange = (loanId: number) => {
    const entry = monthData.find((e) => e.loan_id === loanId);
    if (entry && isRowSelectable(entry)) {
      setSelectedRows((prev) =>
        prev.includes(loanId)
          ? prev.filter((id) => id !== loanId)
          : [...prev, loanId]
      );
    }
  };

  const handleSelectAllChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.checked) {
      const selectableRows = monthData
        .filter(isRowSelectable)
        .map((entry) => entry.loan_id);
      setSelectedRows(selectableRows);
    } else {
      setSelectedRows([]);
    }
  };

  const fetchData = useCallback(
    (searchQuery?: string) => {
      if (!month) return;

      setIsLoading(true);
      setMonthData([]);
      setSearchMessage('');
      setLoadingProgress(0);

      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      let firstObjectLogged = false;

      let url = `http://localhost:4000/nach/fetch-data-by-month?month=${monthNumber}&page=${currentPage}`;

      if (sortOrder) {
        url += `&sort=emi_amount&s_o=${sortOrder}`;
      }
      if (searchQuery) {
        const isName = /^[a-zA-Z\s]+$/.test(searchQuery);
        const searchType = isName ? 'search_name' : 'loan_id';
        url += `&${searchType}=${encodeURIComponent(searchQuery)}`;
      }

      const statusParam = searchParams.get('c_s');
      if (statusParam) {
        url += `&c_s=${statusParam}`;
      }

      console.log('Fetching data with URL:', url);

      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      let receivedData: EntryData[] = [];

      eventSource.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          if (Array.isArray(parsedData)) {
            receivedData = [...receivedData, ...parsedData];
            if (!firstObjectLogged && receivedData.length > 0) {
              console.log('First object of first page:', receivedData[0]);
              firstObjectLogged = true;
            }
            setMonthData(receivedData);
          } else if (
            typeof parsedData === 'object' &&
            !Array.isArray(parsedData)
          ) {
            receivedData = [...receivedData, parsedData];

            setMonthData(receivedData);
          }

          console.log('data:' + receivedData);
        } catch (error) {
          console.error('Error parsing event data:', error);
        }
      };

      eventSource.addEventListener('searchProgress', (event) => {
        setSearchMessage(event.data);
      });

      eventSource.addEventListener('searchComplete', (event) => {
        setSearchMessage(event.data);
        setIsLoading(false);
        setIsInitialLoad(false);
        eventSource.close();
      });

      eventSource.addEventListener('progress', (event) => {
        try {
          const progressData = JSON.parse(event.data);
          setLoadingProgress(progressData.totalItems);
          setMetadata((prevMetadata) => ({
            ...prevMetadata,
            totalItems: progressData.totalItems,
            totalPages: Math.ceil(progressData.totalItems / ENTRIES_PER_PAGE)
          }));
        } catch (error) {
          console.error('Error parsing progress data:', error);
        }
      });

      eventSource.addEventListener('meta', (event) => {
        try {
          const metaData: Metadata = JSON.parse(event.data);
          setMetadata((prevMetadata) => ({
            ...metaData,
            currentPage,
            itemsPerPage: ENTRIES_PER_PAGE,
            totalItems: Math.max(metaData.totalItems, prevMetadata.totalItems)
          }));
        } catch (error) {
          console.error('Error parsing meta data:', error);
        }
      });

      eventSource.addEventListener('end', () => {
        setIsLoading(false);
        setIsInitialLoad(false);
        eventSource.close();
      });

      eventSource.onerror = (error) => {
        console.error('EventSource failed:', error);
        setIsLoading(false);
        setIsInitialLoad(false);
        eventSource.close();
      };
    },
    [month, monthNumber, currentPage, sortOrder, searchParams]
  );

  // useEffect(() => {
  //   fetchData();
  //   return () => {
  //     if (eventSourceRef.current) {
  //       eventSourceRef.current.close();
  //     }
  //   };
  // }, [fetchData, sortOrder, currentPage, resetTrigger]);

  // useEffect(() => {
  //   fetchData();
  //   return () => {
  //     if (eventSourceRef.current) {
  //       eventSourceRef.current.close();
  //     }
  //   };
  // }, [fetchData, sortOrder, currentPage, resetTrigger, selectedStatus]);

  // // useEffect(() => {
  // //   const status = searchParams.get('c_s');
  // //   console.log("URL changed. Current status from URL:", status);
  // //   if (status) {
  // //     setSelectedStatus(status === 'null' ? 'Not Presented' : status);
  // //   } else {
  // //     setSelectedStatus(null);
  // //   }
  // // }, [searchParams]);

  useEffect(() => {
    fetchData();
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [fetchData, sortOrder, currentPage, resetTrigger, searchParams]); // Add searchParams here

  const handleSearch = () => {
    setIsSearchActive(true);
    fetchData(searchInput);
  };

  const capitalizeName = (name: string): string => {
    if (name) {
      return name
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return 'None';
  };

  const toLowerCaseEmail = (email: string): string =>
    email ? email.toLowerCase() : 'None';

  const updateURL = (page: number) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set('page', page.toString());
    if (sortOrder) {
      currentParams.set('sort', 'emi_amount');
      currentParams.set('s_o', sortOrder);
    } else {
      currentParams.delete('sort');
      currentParams.delete('s_o');
    }
    if (searchInput) {
      currentParams.set('search', searchInput);
    } else {
      currentParams.delete('search');
    }
    router.push(`${window.location.pathname}?${currentParams.toString()}`);
  };

  const nextPage = () => {
    if (metadata.currentPage < metadata.totalPages) {
      updateURL(metadata.currentPage + 1);
    }
  };

  const prevPage = () => {
    if (metadata.currentPage > 1) {
      updateURL(metadata.currentPage - 1);
    }
  };

  const handleSortChange = (order: 'ascending' | 'descending') => {
    setSortOrder((prevOrder) => (prevOrder === order ? null : order));
    applyFilters();
  };

  const getEntryRange = () => {
    const start = (metadata.currentPage - 1) * metadata.itemsPerPage + 1;
    const end = Math.min(
      metadata.currentPage * metadata.itemsPerPage,
      metadata.totalItems
    );
    return `${start}-${end}`;
  };

  const handleNachProviderChange = (provider: string) => {
    setSelectedNachProviders((prev) =>
      prev.includes(provider)
        ? prev.filter((p) => p !== provider)
        : [...prev, provider]
    );
    applyFilters();
  };

  const applyFilters = () => {
    setIsFilterModalOpen(false);
    updateURL(1);
  };

  const handleUpdateCustomerAndOrderId = async () => {
    if (selectedRows.length !== 1) {
      console.error('Please select exactly one row to update');
      return;
    }

    const selectedEntry = monthData.find(
      (entry) => entry.loan_id === selectedRows[0]
    );

    // if (!selectedEntry || !isEligibleForCreateOrder(selectedEntry)) {
    //   console.error('Selected entry is not eligible for order creation');
    //   return;
    // }

    try {
      const response = await axios.post(
        'http://localhost:4000/update-customer-id-and-order-id',
        selectedEntry
      );
      console.log('Update response:', response.data);

      // Update the monthData with the new customer_id and order_id
      setMonthData((prevData) =>
        prevData.map((entry) =>
          entry.loan_id === selectedRows[0]
            ? {
                ...entry,
                customer_id: response.data.updatedItem.customer_id,
                order_id: response.data.updatedItem.order_id
              }
            : entry
        )
      );

      // Clear the selection
      setSelectedRows([]);
    } catch (error) {
      console.error('Error updating customer and order ID:', error);
    }
  };

  const newOrderData = async () => {
    const today = moment();
    try {
      const response = await axios.get<EntryData[]>(
        'http://localhost:4000/nach/fetch-data'
      );
      const filteredData = response.data.filter((customer) => {
        const presentationDate = moment(customer.proposed_payment_date);
        return presentationDate.isSame(today, 'day');
      });
      setMonthData(filteredData);
    } catch (error) {
      console.error('Error fetching new order data:', error);
    }
  };

  const handleRecurringPayment = async () => {
    try {
      if (selectedRows.length === 0) {
        console.error('No customers selected for recurring payment');
        return;
      }

      const selectedCustomers = monthData.filter((customer) =>
        selectedRows.includes(customer.loan_id)
      );

      console.log('Selected Customers:', selectedCustomers);

      const response = await fetch(
        'http://localhost:4000/nach/recurring_payments',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(selectedCustomers)
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(
          `Error creating recurring payment: ${errorResponse.error}`
        );
      }

      const responseData = await response.json();
      console.log('Recurring Payment Successful:', responseData);

      // Update the monthData with the new status
      setMonthData((prevData) =>
        prevData.map((entry) =>
          selectedRows.includes(entry.loan_id)
            ? { ...entry, current_status: responseData[0].paymentStatus }
            : entry
        )
      );

      alert(responseData[0].paymentStatus);
    } catch (error) {
      console.error('Error processing recurring payments:', error);
    }
  };

  // const handleUpdateTokenId = async () => {
  //   if (selectedRows.length !== 1) {
  //     console.error('Please select exactly one row to update');
  //     return;
  //   }

  //   const selectedEntry = monthData.find(
  //     (entry) => entry.loan_id === selectedRows[0]
  //   );

  //   if (!selectedEntry) {
  //     console.error('Selected entry not found');
  //     return;
  //   }

  //   if (!tokenIdInput) {
  //     console.error('Token ID is required');
  //     return;
  //   }

  //   try {
  //     const response = await axios.post(
  //       'http://localhost:4000/update-token-id',
  //       {
  //         ...selectedEntry,
  //         token_id: tokenIdInput
  //       }
  //     );
  //     console.log('Update response:', response.data);

  //     // Update the monthData with the new token_id
  //     setMonthData((prevData) =>
  //       prevData.map((entry) =>
  //         entry.loan_id === selectedRows[0]
  //           ? {
  //               ...entry,
  //               token_id: response.data.updatedItem.token_id
  //             }
  //           : entry
  //       )
  //     );

  //     // Clear the selection and input
  //     setSelectedRows([]);
  //     setTokenIdInput('');
  //   } catch (error) {
  //     console.error('Error updating token ID:', error);
  //   }
  // };

  const handleCreateOrderAndPayment = async () => {
    if (selectedRows.length !== 1) {
      console.error('Please select exactly one row to process');
      return;
    }

    const selectedEntry = monthData.find(
      (entry) => entry.loan_id === selectedRows[0]
    );

    if (!selectedEntry) {
      console.error('Selected entry not found');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:4000/create-order-and-payment',
        selectedEntry
      );
      console.log('Create order and payment response:', response.data);

      // Update the monthData with the new order_id and payment status
      setMonthData((prevData) =>
        prevData.map((entry) =>
          entry.loan_id === selectedRows[0]
            ? {
                ...entry,
                order_id: response.data.order_id,
                current_status: 'Processed' // You can adjust this status as needed
              }
            : entry
        )
      );

      // Clear the selection
      setSelectedRows([]);

      // Show a success message to the user
      alert('Order created and payment processed successfully!');
    } catch (error) {
      console.error('Error creating order and processing payment:', error);
      alert('Failed to create order and process payment. Please try again.');
    }
  };

  const handleUpdateTokenId = async () => {
    if (selectedRows.length !== 1) {
      console.error('Please select exactly one row to update');
      return;
    }

    const selectedEntry = monthData.find(
      (entry) => entry.loan_id === selectedRows[0]
    );

    if (!selectedEntry) {
      console.error('Selected entry not found');
      return;
    }

    if (!tokenIdInput) {
      console.error('Token ID is required');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:4000/update-token-id',
        {
          ...selectedEntry,
          token_id: tokenIdInput
        }
      );
      console.log('Update response:', response.data);

      // Update the monthData with the new token_id
      setMonthData((prevData) =>
        prevData.map((entry) =>
          entry.loan_id === selectedRows[0]
            ? {
                ...entry,
                token_id: response.data.updatedItem.token_id
              }
            : entry
        )
      );

      // Clear the selection and input
      setSelectedRows([]);
      setTokenIdInput('');
    } catch (error) {
      console.error('Error updating token ID:', error);
    }
  };

  const isNextDisabled =
    isLoading || isSearchActive || metadata.currentPage >= metadata.totalPages;
  const isPrevDisabled =
    isLoading || isSearchActive || metadata.currentPage === 1;

  const fieldsToShow = [
    'loan_id',
    'customer_id',
    'current_status',
    'order_id',
    'token_id',
    'emi_amount',
    'email',
    'person_name',
    'account_number',
    'description',
    'ifsc_code',
    'receipt',
    'start_date',
    'year',
    'method',
    'payment_capture',
    'auth_type',
    'mobile_num',
    'provider_type',
    'proposed_payment_date'
  ];

  return (
    <div className="relative w-full max-w-full overflow-hidden pb-16 animate-fade-in-up">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

        body {
          font-family: 'Inter', sans-serif;
        }
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

        .react-tabs__tab {
          position: relative;
          padding-bottom: 8px; /* Adjust if needed */
        }

        .react-tabs__tab--selected::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px; /* Adjust the thickness of the underline */
          background: blue; /* Change to your desired underline color */
          transition: none; /* Ensure underline doesn't animate or disappear */
        }
      `}</style>
      <Card className="mb-16">
        <CardHeader className="flex flex-col -space-y-2">
          {/* Heading and Details Section */}
          <div>
            <CardTitle>Details for {month}</CardTitle>
            <CardDescription>
              {isLoading ? (
                `Loading... (${loadingProgress} items loaded)`
              ) : isSearchActive ? (
                `Showing ${monthData.length} search results`
              ) : (
                <>
                  Showing {getEntryRange()} entries
                  {metadata.totalItems > 0 &&
                    ` (Total: ${metadata.totalItems})`}
                </>
              )}
              {searchMessage && (
                <div className="text-sm text-blue-500 mt-1">
                  {searchMessage}
                </div>
              )}
              {selectedRows.length > 0 && (
                <div className="text-sm text-blue-500 mt-1">
                  {selectedRows.length} row(s) selected
                </div>
              )}
            </CardDescription>
          </div>

          {/* Tabs and Actions Section */}
          <div className="flex items-center justify-between">
            {/* <Tabs
              selectedIndex={[
                'Captured',
                'Authorized',
                'Not Presented'
              ].indexOf(selectedStatus || '')}
              onSelect={(index) =>
                handleStatusSelect(
                  ['Captured', 'Authorized', 'Not Presented'][index] || null
                )
              }
              className="flex flex-col"
            >
              <TabList className="flex border-b-0">
                {['Captured', 'Authorized', 'Not Presented'].map(
                  (status, index) => (
                    <Tab
                      key={status}
                      className={`
                        px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out
                        border-t border-r first:border-l first:rounded-tl-md last:rounded-tr-md
                        ${index === 0 ? 'border-l' : ''}
                        hover:bg-gray-50 focus:outline-none
                        cursor-pointer
                         hover:font-semibold
                      `}
                      selectedClassName="bg-blue-100 border-b-0 relative z-10 text-blue-600"
                    >
                      {status}
                    </Tab>
                  )
                )}
              </TabList>
            </Tabs> */}
            <Tabs
              selectedIndex={[
                'Captured',
                'Authorized',
                'Not Presented'
              ].indexOf(selectedStatus || '')}
              onSelect={(index) =>
                handleStatusSelect(
                  ['Captured', 'Authorized', 'Not Presented'][index] || null
                )
              }
              className="flex flex-col"
            >
              <TabList className="flex border-b-2 border-gray-200">
                {['Captured', 'Authorized', 'Not Presented'].map(
                  (status, index) => (
                    <Tab
                      key={status}
                      className={`
            px-4 py-2 text-sm font-medium transition-all duration-200 ease-in-out
            border-t border-r border-gray-200 first:border-l first:rounded-tl-md last:rounded-tr-md
            ${index === 0 ? 'border-l' : ''}
            hover:bg-gray-50 focus:outline-none
            cursor-pointer
            hover:font-semibold
          `}
                      selectedClassName="bg-blue-100 border-b-2 border-gray-200 relative z-10 text-blue-600"
                    >
                      {status}
                    </Tab>
                  )
                )}
              </TabList>
            </Tabs>

            <div className="flex items-center space-x-2">
              <Button
                onClick={handleCreateOrderAndPayment}
                className="bg-green-500 hover:bg-green-600 text-white transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105"
                disabled={selectedRows.length !== 1}
              >
                Present
              </Button>

              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search by Name/Loan ID"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-56 pr-8 transition-all duration-200 ease-in-out focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch();
                    }
                  }}
                  disabled={isLoading || isInitialLoad}
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105"
                  disabled={isLoading || isInitialLoad}
                >
                  <Search size={18} />
                </button>
              </div>

              <Dialog.Root
                open={isFilterModalOpen}
                onOpenChange={setIsFilterModalOpen}
              >
                <Dialog.Trigger asChild>
                  <Button
                    className="transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105"
                    disabled={isLoading || isInitialLoad}
                  >
                    Filters <Filter size={16} className="ml-2" />
                  </Button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-lg shadow-xl w-[500px] animate-scale-in">
                    <Dialog.Title className="text-lg font-bold mb-3"></Dialog.Title>
                    <div className="flex space-x-2">
                      <div className="flex-1 border-r pr-2">
                        <h3 className="font-semibold mb-1 text-sm">
                          NACH Provider
                        </h3>
                        <div className="space-y-1">
                          {['Razorpay', 'Axis', 'Salesforce'].map(
                            (provider) => (
                              <button
                                key={provider}
                                onClick={() =>
                                  handleNachProviderChange(provider)
                                }
                                className={`w-full text-left py-1 px-2 text-sm ${
                                  selectedNachProviders.includes(provider)
                                    ? 'font-semibold bg-blue-100'
                                    : 'font-normal'
                                } transition-all duration-200 ease-in-out hover:bg-gray-100 rounded`}
                              >
                                {provider}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                      <div className="flex-1 pl-2">
                        <h3 className="font-semibold mb-1 text-sm">
                          Sort by EMI
                        </h3>
                        <div className="space-y-1">
                          {['Ascending', 'Descending'].map((option) => (
                            <button
                              key={option}
                              onClick={() =>
                                handleSortChange(
                                  option.toLowerCase() as
                                    | 'ascending'
                                    | 'descending'
                                )
                              }
                              className={`w-full text-left py-1 px-2 text-sm ${
                                sortOrder === option.toLowerCase()
                                  ? 'font-semibold bg-blue-100'
                                  : 'font-normal'
                              } transition-all duration-200 ease-in-out hover:bg-gray-100 rounded`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>

              {/* <Button
                onClick={handleReset}
                className="bg-red-500 hover:bg-red-600 text-white transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105"
                disabled={isLoading || isInitialLoad}
              >
                Reset All
              </Button> */}
              <Button
                onClick={handleReset}
                className="bg-red-500 hover:bg-red-600 text-white transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105"
                disabled={isLoading || isInitialLoad}
              >
                <RiCloseCircleLine className="h-6 w-6 text-white" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="overflow-auto max-h-[70vh] custom-scrollbar">
          <div className="w-max min-w-full">
            <Table>
              <TableCaption>Month Detail Data</TableCaption>
              <TableHeader>
                <TableRow className="border-l border-r border-t border-gray-200">
                  <TableHead className="font-bold w-10 border-r border-gray-200 px-4 py-2">
                    <input
                      type="checkbox"
                      className="form-checkbox h-5 w-5 mt-1 text-blue-600 transition duration-150 ease-in-out"
                      checked={
                        selectedRows.length > 0 &&
                        selectedRows.length ===
                          monthData.filter(isRowSelectable).length
                      }
                      onChange={handleSelectAllChange}
                    />
                  </TableHead>
                  {fieldsToShow.map((field, index) => (
                    <TableHead
                      key={index}
                      className={`font-bold border-r ${
                        index === fieldsToShow.length - 1
                          ? 'border-r-0'
                          : 'border-gray-200'
                      } px-4 py-2`}
                    >
                      {field.replace(/_/g, ' ').toUpperCase()}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthData.map((entry, index) => (
                  <TableRow
                    key={index}
                    className={`animate-fade-in-up border-l border-r ${
                      index === 0 ? 'border-t' : ''
                    } border-gray-200`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <TableCell className="w-10 border-l border-r border-gray-200 px-4 py-2">
                      {isRowSelectable(entry) && (
                        <input
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                          checked={selectedRows.includes(entry.loan_id)}
                          onChange={() => handleCheckboxChange(entry.loan_id)}
                        />
                      )}
                    </TableCell>
                    {fieldsToShow.map((field, cellIndex) => {
                      if (field === 'current_status') {
                        const { text, color } = getStatusDisplay(entry[field]);
                        return (
                          <TableCell
                            key={cellIndex}
                            className={`${cellIndex === 0 ? 'border-l' : ''} ${
                              cellIndex === fieldsToShow.length - 1
                                ? 'border-r'
                                : ''
                            } ${color} border-b border-gray-200 px-4 py-2`}
                          >
                            {text}
                          </TableCell>
                        );
                      }
                      if (field === 'person_name') {
                        return (
                          <TableCell
                            key={cellIndex}
                            className={`${cellIndex === 0 ? 'border-l' : ''} ${
                              cellIndex === fieldsToShow.length - 1
                                ? 'border-r'
                                : ''
                            } text-gray-700 border-b border-gray-200 px-4 py-2`}
                          >
                            {capitalizeName(entry[field])}
                          </TableCell>
                        );
                      }
                      if (field === 'email') {
                        return (
                          <TableCell
                            key={cellIndex}
                            className={`${cellIndex === 0 ? 'border-l' : ''} ${
                              cellIndex === fieldsToShow.length - 1
                                ? 'border-r'
                                : ''
                            } text-gray-700 border-b border-gray-200 px-4 py-2`}
                          >
                            {toLowerCaseEmail(entry[field])}
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell
                          key={cellIndex}
                          className={`${cellIndex === 0 ? 'border-l' : ''} ${
                            cellIndex === fieldsToShow.length - 1
                              ? 'border-r'
                              : ''
                          } text-gray-700 border-b border-gray-200 px-4 py-2`}
                        >
                          {entry[field as keyof EntryData] != null
                            ? String(entry[field as keyof EntryData])
                            : ' '}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <div className="fixed bottom-4 left-0 right-0 flex justify-center items-center z-10">
        <div className="flex items-center bg-white rounded-full shadow-sm px-2 py-1">
          <Button
            onClick={prevPage}
            disabled={isPrevDisabled}
            variant="pagination"
            size="sm"
            className="rounded-l-full transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105"
          >
            &lt;
          </Button>
          <span className="px-3 text-xs font-medium text-gray-600">
            {isSearchActive
              ? 'Search Results'
              : `${metadata.currentPage}/${metadata.totalPages || 1}`}
          </span>
          <Button
            onClick={nextPage}
            disabled={isNextDisabled}
            variant="pagination"
            size="sm"
            className="rounded-r-full transition-all duration-200 ease-in-out hover:shadow-lg hover:scale-105"
          >
            &gt;
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MonthDetail;
