export type RepayType = 'debx' | 'debj'; // debx: 等额本息, debj: 等额本金
export type LoanType = 'business' | 'paf' | 'mixed';

export interface MonthData {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  remaining: number;
}

export interface CalcResult {
  totalLoan: number;
  totalInterest: number;
  totalRepayment: number;
  monthlyPayment: number | string; // debj is variable, so string
  monthData: MonthData[];
}

export const calculateLoan = (
  loanType: LoanType,
  repayType: RepayType,
  businessSum: number, // 万元
  businessRate: number, // %
  pafSum: number,     // 万元
  pafRate: number,    // %
  years: number
): CalcResult => {
  const months = years * 12;
  const bSum = loanType === 'paf' ? 0 : businessSum * 10000;
  const pSum = loanType === 'business' ? 0 : pafSum * 10000;
  const bRate = businessRate / 100 / 12;
  const pRate = pafRate / 100 / 12;

  let totalInterest = 0;
  let totalRepayment = 0;
  const monthData: MonthData[] = [];

  if (repayType === 'debx') {
    // 等额本息
    const calcDebx = (P: number, r: number, N: number) => {
      if (P === 0) return { payment: 0, monthData: [] };
      const payment = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
      return { payment };
    };

    const bRes = calcDebx(bSum, bRate, months);
    const pRes = calcDebx(pSum, pRate, months);
    const monthlyPayment = bRes.payment + pRes.payment;

    let bRemain = bSum;
    let pRemain = pSum;

    for (let i = 1; i <= months; i++) {
      const bInterest = bRemain * bRate;
      const pInterest = pRemain * pRate;
      const interest = bInterest + pInterest;
      const principal = monthlyPayment - interest;
      
      bRemain -= (bRes.payment - bInterest) || 0;
      pRemain -= (pRes.payment - pInterest) || 0;

      totalInterest += interest;
      monthData.push({
        month: i,
        payment: monthlyPayment,
        principal: principal,
        interest: interest,
        remaining: Math.max(0, bRemain + pRemain)
      });
    }

    totalRepayment = (bSum + pSum) + totalInterest;

    return {
      totalLoan: bSum + pSum,
      totalInterest,
      totalRepayment,
      monthlyPayment,
      monthData
    };

  } else {
    // 等额本金
    const bPrincipalMonthly = bSum / months;
    const pPrincipalMonthly = pSum / months;
    const principalMonthly = bPrincipalMonthly + pPrincipalMonthly;

    let bRemain = bSum;
    let pRemain = pSum;
    let maxPayment = 0;
    let minPayment = 0;

    for (let i = 1; i <= months; i++) {
      const bInterest = bRemain * bRate;
      const pInterest = pRemain * pRate;
      const interest = bInterest + pInterest;
      const payment = principalMonthly + interest;

      if (i === 1) maxPayment = payment;
      if (i === months) minPayment = payment;

      totalInterest += interest;
      bRemain -= bPrincipalMonthly;
      pRemain -= pPrincipalMonthly;

      monthData.push({
        month: i,
        payment,
        principal: principalMonthly,
        interest,
        remaining: Math.max(0, bRemain + pRemain)
      });
    }

    totalRepayment = (bSum + pSum) + totalInterest;

    return {
      totalLoan: bSum + pSum,
      totalInterest,
      totalRepayment,
      monthlyPayment: `${maxPayment.toFixed(2)} 递减至 ${minPayment.toFixed(2)}`,
      monthData
    };
  }
};