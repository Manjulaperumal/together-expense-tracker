
"use client";

import { useEffect, useState } from "react";

type Transaction = {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  note: string;
};

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loaded, setLoaded] = useState(false);

  const [type, setType] = useState<"income" | "expense">("income");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Salary");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("together-transactions");
      if (saved) {
        setTransactions(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Unable to load transactions:", error);
    }

    setDate(new Date().toISOString().split("T")[0]);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(
        "together-transactions",
        JSON.stringify(transactions)
      );
    }
  }, [transactions, loaded]);

  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalSavings = totalIncome - totalExpenses;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!amount || Number(amount) <= 0 || !date) {
      alert("Please enter a valid amount and date.");
      return;
    }

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      type,
      amount: Number(amount),
      category,
      date,
      note,
    };

    setTransactions((previous) => [newTransaction, ...previous]);
    setAmount("");
    setNote("");
    alert("Transaction added successfully!");
  }

  function deleteTransaction(id: string) {
    if (confirm("Are you sure you want to delete this transaction?")) {
      setTransactions((previous) =>
        previous.filter((item) => item.id !== id)
      );
    }
  }

  const formatMoney = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);

  const categories =
    type === "income"
      ? ["Salary", "Business", "Freelance", "Gift", "Other"]
      : [
          "Food",
          "Shopping",
          "Travel",
          "Bills",
          "Rent",
          "Medical",
          "Entertainment",
          "Groceries",
          "Other",
        ];

  return (
    <div className="min-h-screen bg-[#f5f8f5] text-[#263b2d]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-10 border-b border-[#e1ebe2] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-4 sm:flex-row">
          <a href="#overview" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dcecdf] text-2xl">
              💚
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#315d40]">
                Together
              </h1>
              <p className="text-xs text-[#819285]">
                Our Expense Tracker
              </p>
            </div>
          </a>

          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-[#637668]">
            <a href="#overview" className="transition hover:text-[#39764c]">
              Overview
            </a>
            <a href="#add-transaction" className="transition hover:text-[#39764c]">
              Add Transaction
            </a>
            <a href="#history" className="transition hover:text-[#39764c]">
              Transactions
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-9">
        {/* Welcome Section */}
        <section id="overview" className="mb-9">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#73917a]">
            Your shared finances
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-[#294b34] sm:text-4xl">
            Welcome to Together! 🌿
          </h2>
          <p className="mt-3 text-[#7b8c7e]">
            Plan your money, track your spending and grow your savings together.
          </p>
        </section>

        {/* Dashboard Cards */}
        <section className="mb-9 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-[#e2eee4] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-medium text-[#748779]">Total Income</p>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e2f2e5] text-xl">
                ↗
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#398052]">
              {formatMoney(totalIncome)}
            </h3>
            <p className="mt-2 text-xs text-[#91a294]">
              Your total earnings
            </p>
          </div>

          <div className="rounded-2xl border border-[#e2eee4] bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-medium text-[#748779]">Total Expenses</p>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fcebea] text-xl">
                ↙
              </span>
            </div>
            <h3 className="text-2xl font-bold text-[#d46c62]">
              {formatMoney(totalExpenses)}
            </h3>
            <p className="mt-2 text-xs text-[#91a294]">
              Your total spending
            </p>
          </div>

          <div className="rounded-2xl border border-[#d8e9db] bg-[#e9f4e9] p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md sm:col-span-2 lg:col-span-1">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-medium text-[#58765e]">Total Savings</p>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/80 text-xl">
                🌱
              </span>
            </div>
            <h3
              className={`text-2xl font-bold ${
                totalSavings >= 0 ? "text-[#34754a]" : "text-[#d46c62]"
              }`}
            >
              {formatMoney(totalSavings)}
            </h3>
            <p className="mt-2 text-xs text-[#78927d]">
              Income minus expenses
            </p>
          </div>
        </section>

        {/* Add Transaction */}
        <section
          id="add-transaction"
          className="mb-9 scroll-mt-28 rounded-2xl border border-[#e2eee4] bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-7">
            <p className="mb-1 text-sm font-semibold text-[#71917a]">
              KEEP TRACK
            </p>
            <h3 className="text-2xl font-bold text-[#294b34]">
              Add New Transaction
            </h3>
            <p className="mt-2 text-sm text-[#849387]">
              Record your income and expenses here.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Transaction Type */}
            <div>
              <label className="mb-3 block text-sm font-semibold text-[#526b58]">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setType("income");
                    setCategory("Salary");
                  }}
                  className={`rounded-xl py-3 font-semibold transition ${
                    type === "income"
                      ? "bg-[#438357] text-white shadow-md"
                      : "bg-[#f0f5f0] text-[#617866] hover:bg-[#e5efe6]"
                  }`}
                >
                  + Income
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setType("expense");
                    setCategory("Food");
                  }}
                  className={`rounded-xl py-3 font-semibold transition ${
                    type === "expense"
                      ? "bg-[#cf766b] text-white shadow-md"
                      : "bg-[#f0f5f0] text-[#617866] hover:bg-[#e5efe6]"
                  }`}
                >
                  − Expense
                </button>
              </div>
            </div>

            {/* Amount and Category */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#526b58]">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  min="0.01"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-[#dce7dd] bg-[#fbfdfb] p-3 text-[#294b34] outline-none transition focus:border-[#6b9c76] focus:ring-2 focus:ring-[#dcecdf]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#526b58]">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-[#dce7dd] bg-[#fbfdfb] p-3 text-[#294b34] outline-none transition focus:border-[#6b9c76] focus:ring-2 focus:ring-[#dcecdf]"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date and Note */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#526b58]">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full rounded-xl border border-[#dce7dd] bg-[#fbfdfb] p-3 text-[#294b34] outline-none transition focus:border-[#6b9c76] focus:ring-2 focus:ring-[#dcecdf]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#526b58]">
                  Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Example: Grocery shopping"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full rounded-xl border border-[#dce7dd] bg-[#fbfdfb] p-3 text-[#294b34] outline-none transition focus:border-[#6b9c76] focus:ring-2 focus:ring-[#dcecdf]"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`w-full rounded-xl py-3.5 font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
                type === "income"
                  ? "bg-[#438357] hover:bg-[#356f48]"
                  : "bg-[#cf766b] hover:bg-[#bb6259]"
              }`}
            >
              Add {type === "income" ? "Income" : "Expense"}
            </button>
          </form>
        </section>

        {/* Transaction History */}
        <section
          id="history"
          className="scroll-mt-28 rounded-2xl border border-[#e2eee4] bg-white p-6 shadow-sm sm:p-8"
        >
          <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="mb-1 text-sm font-semibold text-[#71917a]">
                YOUR RECORDS
              </p>
              <h3 className="text-2xl font-bold text-[#294b34]">
                Recent Transactions
              </h3>
            </div>
            <span className="rounded-full bg-[#edf5ed] px-4 py-2 text-sm font-semibold text-[#52775a]">
              {transactions.length} Transactions
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="rounded-xl bg-[#f7faf7] px-5 py-12 text-center">
              <div className="mb-3 text-4xl">🌿</div>
              <p className="font-semibold text-[#526b58]">
                No transactions yet
              </p>
              <p className="mt-2 text-sm text-[#89998c]">
                Start adding your income and expenses!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-3 rounded-xl border border-[#edf2ed] bg-[#fcfdfc] p-4 transition hover:bg-[#f5f9f5] sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${
                        item.type === "income"
                          ? "bg-[#e2f2e5] text-[#398052]"
                          : "bg-[#fcebea] text-[#cf766b]"
                      }`}
                    >
                      {item.type === "income" ? "↗" : "↙"}
                    </div>

                    <div>
                      <h4 className="font-semibold text-[#36543d]">
                        {item.category}
                      </h4>
                      <p className="mt-1 text-xs text-[#89998c]">
                        {item.date}
                        {item.note ? ` · ${item.note}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:justify-end">
                    <span
                      className={`font-bold ${
                        item.type === "income"
                          ? "text-[#398052]"
                          : "text-[#cf766b]"
                      }`}
                    >
                      {item.type === "income" ? "+" : "−"}
                      {formatMoney(item.amount)}
                    </span>

                    <button
                      type="button"
                      onClick={() => deleteTransaction(item.id)}
                      className="rounded-lg px-3 py-2 text-sm font-medium text-[#c66b62] transition hover:bg-[#fcebea]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="py-9 text-center">
          <p className="text-sm font-medium text-[#66816c]">
            Made with 💚 for a beautiful life together
          </p>
          <p className="mt-2 text-xs text-[#9aaa9d]">
            Together Expense Tracker © 2026
          </p>
        </footer>
      </main>
    </div>
  );
}
