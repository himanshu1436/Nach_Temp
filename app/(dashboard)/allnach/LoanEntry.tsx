// app/components/LoanEntry.tsx
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loan } from './types';

interface LoanEntryProps {
  loan: Loan;
}

export function LoanEntry({ loan }: LoanEntryProps) {
  return (
    <TableRow>
      <TableCell>{loan.Bank_FI_name}</TableCell>
      <TableCell>{loan.Type_of_loan}</TableCell>
      <TableCell>{loan.disbursement_date}</TableCell>
      <TableCell>{loan.Outstanding_amount.toLocaleString()}</TableCell>
      <TableCell>{loan.Priniciple_amount.toLocaleString()}</TableCell>
      <TableCell>{loan.Interest_amount.toLocaleString()}</TableCell>
      <TableCell>{loan.TDS_amount.toLocaleString()}</TableCell>
      <TableCell>{loan.Net_Payment.toLocaleString()}</TableCell>
      <TableCell>{loan.Repayment_date}</TableCell>
      <TableCell>
        <Badge variant={loan.NACH_NEFT === 'NACH' ? 'default' : 'secondary'}>
          {loan.NACH_NEFT}
        </Badge>
      </TableCell>
    </TableRow>
  );
}
