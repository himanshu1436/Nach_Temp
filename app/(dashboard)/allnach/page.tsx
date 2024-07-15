// @/components/DummyPage.js
import React from 'react';
// import Layout from '../Layout'
// import Table from './table';
// // import MonthFilter from './monthFilter';
import { LoanTable } from './LoanTable';

export default function allnach() {
  const title = 'All Nach';
  return (
    // <Layout
    // pageTitle={title}
    // >
    <div className="min-h-screen flex flex-col items-center justify-center  ">
      <div className="h-[68vh] bg-blue-200 w-full flex flex-col items-center justify-center">
        <LoanTable />
      </div>
    </div>
    // </Layout>
  );
}
