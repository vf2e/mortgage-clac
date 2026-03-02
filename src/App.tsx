import { useEffect, useState, useRef } from "react";
import { useCalculatorStore } from "./store/useCalculatorStore";
import {
  Calculator,
  CalendarDays,
  TrendingUp,
  Wallet,
  MoveDown,
  Landmark,
  Sun,
  Moon,
  Info,
} from "lucide-react";

const App = () => {
  const store = useCalculatorStore();
  const [rateMode, setRateMode] = useState<"auto" | "manual">("auto");

  const [isDark, setIsDark] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDark]);

  useEffect(() => {
    if (rateMode === "auto") {
      store.setField("businessRate", 3.1);
      store.setField("pafRate", 2.6);
    }
  }, [rateMode, store.loanType]);

  useEffect(() => {
    store.calculate();
  }, [
    store.loanType,
    store.repayType,
    store.businessSum,
    store.pafSum,
    store.years,
    store.businessRate,
    store.pafRate,
  ]);

  const formatMoney = (val: number) => (val / 10000).toFixed(2) + " 万";

  const isDebj = store.repayType === "debj";
  const paymentRaw = store.result?.monthlyPayment
    ? String(store.result.monthlyPayment)
    : "0";
  const [maxPay, minPay] =
    isDebj && paymentRaw.includes("递减至")
      ? paymentRaw.split(" 递减至 ")
      : [paymentRaw, paymentRaw];

  const monthlyDecrease =
    isDebj && store.years > 0
      ? ((Number(maxPay) - Number(minPay)) / (store.years * 12 - 1)).toFixed(2)
      : "0";

  return (
    <div className="min-h-screen p-4 md:p-8 flex items-center justify-center relative transition-colors duration-700">
      <div className="mesh-bg"></div>

      <div className="max-w-350 w-full glass-card rounded-[3rem] overflow-hidden flex flex-col lg:flex-row min-h-220 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.15)] dark:shadow-[0_32px_80px_-16px_rgba(0,0,0,0.5)] transition-all duration-700 relative">
        <button
          onClick={() => setIsDark(!isDark)}
          className="absolute top-8 right-8 z-50 p-3 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-sm hover:scale-110 transition-transform text-slate-600 dark:text-amber-400"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="w-full lg:w-115 bg-white/40 dark:bg-slate-900/40 p-10 border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col shrink-0 transition-colors duration-700">
          <div className="flex items-center space-x-4 mb-12 mt-2">
            <div className="p-3.5 bg-linear-to-br from-indigo-500 to-violet-600 rounded-2xl shadow-xl shadow-indigo-500/20">
              <Landmark className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white transition-colors duration-700">
                <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-500 to-violet-500">
                房贷测算
                </span>
              </h1>
              <p className="text-xs font-bold mt-1 text-slate-400 dark:text-slate-500 tracking-widest">
                2026
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-10">
            <section>
              <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 mb-3 flex items-center">
                <Wallet className="w-4 h-4 mr-2 text-indigo-500" /> 还款策略
              </h3>
              <div className="segmented-control gap-2.5!">
                {[
                  { id: "debx", label: "等额本息", desc: "每月还款金额固定" },
                  { id: "debj", label: "等额本金", desc: "利息少,逐月递减" },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => store.setField("repayType", type.id)}
                    className={
                      store.repayType === type.id
                        ? "btn-active-primary"
                        : "btn-inactive"
                    }
                  >
                    <div className="flex flex-col items-center justify-center py-1">
                      <span className="text-[15px]">{type.label}</span>
                      <span
                        className={`text-[11px] mt-1 font-normal ${
                          store.repayType === type.id
                            ? "text-indigo-100"
                            : "text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        {type.desc}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 mb-3 flex items-center">
                <Info className="w-4 h-4 mr-2 text-indigo-500" /> 贷款类型
              </h3>
              <div className="segmented-control">
                {[
                  { id: "business", label: "商业贷款" },
                  { id: "paf", label: "公积金" },
                  { id: "mixed", label: "组合方案" },
                ].map(
                  (
                    item 
                  ) => (
                    <button
                      key={item.id}
                      onClick={() => store.setField("loanType", item.id)}
                      className={
                        store.loanType === item.id
                          ? "btn-active-white"
                          : "btn-inactive"
                      }
                    >
                      <span className="text-[14px]">{item.label}</span>
                    </button>
                  )
                )}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-black text-slate-500 dark:text-slate-400 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2 text-indigo-500" />{" "}
                  金额与利率
                </h3>
                <div className="flex bg-slate-200/50 dark:bg-slate-800 p-1 rounded-lg border border-slate-300/30 dark:border-slate-700">
                  <button
                    onClick={() => setRateMode("auto")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                      rateMode === "auto"
                        ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    基准 LPR
                  </button>
                  <button
                    onClick={() => setRateMode("manual")}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                      rateMode === "manual"
                        ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs"
                        : "text-slate-500 dark:text-slate-400"
                    }`}
                  >
                    手动配置
                  </button>
                </div>
              </div>

              {(store.loanType === "business" ||
                store.loanType === "mixed") && (
                <div className="flex space-x-4 p-2.5 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-indigo-100 dark:border-indigo-900/30">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-400 mb-2 block">
                      商贷总额
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={store.businessSum}
                        onChange={(e) =>
                          store.setField("businessSum", Number(e.target.value))
                        }
                        className="w-full pl-4 pr-10 py-3 text-lg font-black text-slate-800 dark:text-white bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                        万
                      </span>
                    </div>
                  </div>
                  <div className="w-28">
                    <label className="text-xs font-bold text-slate-400 mb-2 block">
                      商贷利率
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        disabled={rateMode === "auto"}
                        value={store.businessRate}
                        onChange={(e) =>
                          store.setField("businessRate", Number(e.target.value))
                        }
                        className="w-full pl-3 pr-7 py-3 text-lg font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50 focus:ring-2 focus:ring-indigo-500 outline-none transition-colors disabled:opacity-70"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 font-bold">
                        %
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {(store.loanType === "paf" || store.loanType === "mixed") && (
                <div className="flex space-x-4 p-2.5 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-sky-100 dark:border-sky-900/30">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-400 mb-2 block">
                      公积金总额
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={store.pafSum}
                        onChange={(e) =>
                          store.setField("pafSum", Number(e.target.value))
                        }
                        className="w-full pl-4 pr-10 py-3 text-lg font-black text-slate-800 dark:text-white bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-sky-500 outline-none transition-colors"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">
                        万
                      </span>
                    </div>
                  </div>
                  <div className="w-28">
                    <label className="text-xs font-bold text-slate-400 mb-2 block">
                      公积金利率
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        disabled={rateMode === "auto"}
                        value={store.pafRate}
                        onChange={(e) =>
                          store.setField("pafRate", Number(e.target.value))
                        }
                        className="w-full pl-3 pr-7 py-3 text-lg font-black text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-900/20 rounded-xl border border-sky-100 dark:border-sky-800/50 focus:ring-2 focus:ring-sky-500 outline-none transition-colors disabled:opacity-70"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sky-400 font-bold">
                        %
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="relative" ref={dropdownRef}>
                <label className="text-sm font-black text-slate-500 dark:text-slate-400 mb-3 flex items-center">
                  <CalendarDays className="w-4 h-4 mr-2 text-indigo-500" />
                  贷款总时长
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={store.years}
                    onChange={(e) =>
                      store.setField("years", parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                  <span className="text-base font-bold text-slate-700 dark:text-white whitespace-nowrap">
                    {store.years} 年 ({store.years * 12} 期)
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="flex-1 p-8 lg:p-14 flex flex-col h-220 bg-white/60 dark:bg-slate-900/70 transition-colors duration-700">
          {store.result && (
            <>
              <div className="relative group mb-10 mt-6 lg:mt-0">
                <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-violet-600 rounded-[2.5rem] blur-xl opacity-20 dark:opacity-40 group-hover:opacity-30 dark:group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border border-white/50 dark:border-slate-700 p-8 lg:p-10 rounded-[2.5rem] flex flex-col lg:flex-row items-start lg:items-center justify-between shadow-2xl shadow-indigo-500/10">
                  <div className="mb-6 lg:mb-0">
                    <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white mb-3">
                      资产月供预测
                    </h2>
                    <div className="flex items-center space-x-3">
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 text-xs font-black rounded-lg">
                        {store.repayType === "debx" ? "等额本息" : "等额本金"}
                      </span>
                      <span className="text-slate-400 dark:text-slate-500 text-sm font-bold">
                        测算时间: {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="text-left lg:text-right w-full lg:w-auto">
                    <p className="text-xs font-black text-indigo-500 dark:text-indigo-400 tracking-widest mb-2">
                      {isDebj ? "首月应还本息" : "每月固定月供"}
                    </p>
                    <div className="flex items-baseline justify-start lg:justify-end">
                      <span className="text-3xl font-black text-indigo-600 mr-2">
                        ¥
                      </span>
                      <span className="text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">
                        {Number(maxPay).toLocaleString(undefined, {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                    {isDebj && (
                      <div className="mt-4 flex flex-wrap justify-start lg:justify-end gap-3">
                        <div className="flex items-center text-rose-500 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-3 py-2 rounded-xl text-xs font-black">
                          <MoveDown className="w-3.5 h-3.5 mr-1 animate-bounce" />{" "}
                          每月递减 ¥{monthlyDecrease}
                        </div>
                        <div className="text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 px-3 py-2 rounded-xl text-xs font-black">
                          末月还款 ¥
                          {Number(minPay).toLocaleString(undefined, {
                            maximumFractionDigits: 0,
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-5">
                {[
                  {
                    label: "贷款本金总额",
                    value: formatMoney(store.result.totalLoan),
                    color: "emerald",
                    icon: Calculator,
                    desc: "实际借入银行资金",
                    bgLight: "bg-emerald-50",
                    bgDark: "dark:bg-emerald-900/20",
                    textLight: "text-emerald-700",
                    textDark: "dark:text-emerald-300",
                    borderLight: "border-emerald-100",
                    borderDark: "dark:border-emerald-800/30",
                  },
                  {
                    label: "支付利息总额",
                    value: formatMoney(store.result.totalInterest),
                    color: "rose",
                    icon: TrendingUp,
                    desc: "资金占用成本估算",
                    bgLight: "bg-rose-50",
                    bgDark: "dark:bg-rose-900/20",
                    textLight: "text-rose-700",
                    textDark: "dark:text-rose-300",
                    borderLight: "border-rose-100",
                    borderDark: "dark:border-rose-800/30",
                  },
                  {
                    label: "累计偿还总计",
                    value: formatMoney(store.result.totalRepayment),
                    color: "indigo",
                    icon: Wallet,
                    desc: "包含本金与全部利息",
                    bgLight: "bg-indigo-50",
                    bgDark: "dark:bg-indigo-900/20",
                    textLight: "text-indigo-700",
                    textDark: "dark:text-indigo-300",
                    borderLight: "border-indigo-100",
                    borderDark: "dark:border-indigo-800/30",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className={`relative p-5 rounded-2xl bg-white dark:bg-slate-800/80 border-2 ${stat.borderLight} ${stat.borderDark} hover:shadow-xl transition-all duration-300 group cursor-pointer`}
                    style={{
                      boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
                    }}
                  >
                    <div
                      className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-${stat.color}-500 dark:bg-${stat.color}-400`}
                    ></div>

                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={`p-2.5 rounded-xl ${stat.bgLight} ${stat.bgDark} ${stat.textLight} ${stat.textDark} group-hover:scale-110 transition-transform duration-300`}
                      >
                        <stat.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-black text-slate-400 dark:text-slate-500 tracking-wider uppercase">
                          {stat.label}
                        </div>
                        <div
                          className={`text-3xl font-black ${stat.textLight} ${stat.textDark} leading-tight mt-0.5`}
                        >
                          {stat.value}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50 pt-3 mt-1">
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                        <span className="inline-block w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500"></span>
                        {stat.desc}
                      </p>
                      <div
                        className={`text-xs font-bold px-2 py-1 rounded-full ${stat.bgLight} ${stat.bgDark} ${stat.textLight} ${stat.textDark}`}
                      >
                        {stat.color === "indigo"
                          ? "总成本"
                          : stat.color === "emerald"
                          ? "自有资金"
                          : "利息支出"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-lg font-black text-slate-800 dark:text-white flex items-center">
                  <CalendarDays className="w-5 h-5 mr-2 text-indigo-500" />{" "}
                  各期明细对账单
                </h2>
                <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black border border-indigo-100 dark:border-indigo-800">
                  共 {store.years * 12} 期
                </div>
              </div>

              <div
                className="table-wrapper custom-scrollbar shadow-inner"
                style={{ borderRadius: 0 }}
              >
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-20">
                    <tr>
                      <th className="px-6 py-5 bg-slate-100/95 dark:bg-slate-700/95 backdrop-blur-md font-bold text-slate-500 dark:text-slate-300 text-xs border-b border-slate-200 dark:border-slate-600">
                        期次
                      </th>
                      <th className="px-6 py-5 bg-slate-100/95 dark:bg-slate-700/95 backdrop-blur-md font-bold text-indigo-600 dark:text-indigo-400 text-xs border-b border-slate-200 dark:border-slate-600">
                        本期月供 (元)
                      </th>
                      <th className="px-6 py-5 bg-slate-100/95 dark:bg-slate-700/95 backdrop-blur-md font-bold text-emerald-600 dark:text-emerald-400 text-xs border-b border-slate-200 dark:border-slate-600">
                        偿还本金 (元)
                      </th>
                      <th className="px-6 py-5 bg-slate-100/95 dark:bg-slate-700/95 backdrop-blur-md font-bold text-rose-500 dark:text-rose-400 text-xs border-b border-slate-200 dark:border-slate-600">
                        产生利息 (元)
                      </th>
                      <th className="px-6 py-5 bg-slate-100/95 dark:bg-slate-700/95 backdrop-blur-md font-bold text-slate-500 dark:text-slate-400 text-xs border-b border-slate-200 dark:border-slate-600">
                        剩余本金 (元)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {store.result.monthData.map((row) => (
                      <tr
                        key={row.month}
                        className="group hover:bg-white dark:hover:bg-slate-800 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 font-bold text-slate-400 dark:text-slate-500 text-sm">
                          第 {row.month.toString().padStart(3, "0")} 期
                        </td>
                        <td className="px-6 py-4 font-black text-indigo-600 dark:text-indigo-400 text-base tabular-nums">
                          ¥ {row.payment.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-bold tabular-nums">
                          ¥ {row.principal.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-rose-500 dark:text-rose-400 font-bold tabular-nums">
                          ¥ {row.interest.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-mono text-sm tabular-nums">
                          ¥ {row.remaining.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
