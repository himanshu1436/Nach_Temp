// types.ts
export interface Loan {
  Bank_FI_name: string;
  Type_of_loan: string;
  disbursement_date: string;
  Outstanding_amount: number;
  Priniciple_amount: number;
  Interest_amount: number;
  TDS_amount: number;
  Net_Payment: number;
  Repayment_date: string;
  NACH_NEFT: 'NACH' | 'NEFT';
}
