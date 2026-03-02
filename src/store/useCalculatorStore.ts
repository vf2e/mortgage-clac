import { create } from 'zustand';
import { calculateLoan, CalcResult, LoanType, RepayType } from '../utils/calculator';

interface CalculatorState {
  loanType: LoanType;
  repayType: RepayType;
  businessSum: number;
  pafSum: number;
  years: number;
  businessRate: number;
  pafRate: number;
  result: CalcResult | null;

  setField: (field: keyof CalculatorState, value: any) => void;
  calculate: () => void;
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  loanType: 'business',
  repayType: 'debx',
  businessSum: 120, // 默认 100万
  pafSum: 90,       // 默认 80万
  years: 20,
  businessRate: 3.45, // 2024+最新LPR
  pafRate: 2.75,
  result: null,

  setField: (field, value) => set({ [field]: value }),
  
  calculate: () => {
    const state = get();
    const result = calculateLoan(
      state.loanType,
      state.repayType,
      state.businessSum,
      state.businessRate,
      state.pafSum,
      state.pafRate,
      state.years
    );
    set({ result });
  }
}));