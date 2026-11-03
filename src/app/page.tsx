
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

  // Load saved transactions
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

  // Save transactions
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(
        "together-transactions",
        JSON.stringify(transactions)
      );
    }
  }, [transactions, loaded]);

  // Calculate totals
  const totalIncome = transactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalSavings = totalIncome - totalExpenses;

  // Add transaction
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

    setTransactions((previous) => [
      newTransaction,
      ...previous,
    ]);

    setAmount("");
    setNote("");
    alert("Transaction added successfully!");
  }

  // Delete transaction
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
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">

      {/* Header */}
      <header className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-bold text-pink-700">
          Together ❤️
        </h1>
        <p className="text-gray-600">Our Expense Tracker</p>
      </header>

      <main className="max-w-5xl mx-auto">

        {/* Welcome */}
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome to Together!
        </h2>

        <p className="text-gray-500 mb-8">
          Manage your expenses and savings together.
        </p>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Total Income</p>
            <h3 className="text-2xl font-bold text-green-600">
              {formatMoney(totalIncome)}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Total Expenses</p>
            <h3 className="text-2xl font-bold text-red-500">
              {formatMoney(totalExpenses)}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-500">Total Savings</p>
            <h3
              className={`text-2xl font-bold ${
                totalSavings >= 0
                  ? "text-blue-600"
                  : "text-red-500"
              }`}
            >
              {formatMoney(totalSavings)}
            </h3>
          </div>

        </div>

        {/* Add Transaction Form */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">

          <h3 className="text-xl font-bold text-gray-800 mb-5">
            Add New Transaction
          </h3>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Transaction Type */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Transaction Type
              </label>

              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setType("income");
                    setCategory("Salary");
                  }}
                  className={`flex-1 py-3 rounded-lg font-semibold ${
                    type === "income"
                      ? "bg-green-600 text-white"
                      : "bg-gray-100 text-gray-700"
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
                  className={`flex-1 py-3 rounded-lg font-semibold ${
                    type === "expense"
                      ? "bg-red-500 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  - Expense
                </button>

              </div>
            </div>

            

            {/* Amount */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
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
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-800"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category
              </label>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-800"
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Date
              </label>

              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-800"
              />
            </div>

            {/* Note */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Note (Optional)
              </label>

              <input
                type="text"
                placeholder="Example: Monthly salary or Grocery shopping"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-3 text-gray-800"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className={`w-full py-3 rounded-lg text-white font-bold ${
                type === "income"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-500 hover:bg-red-600"
              }`}
            >
              Add {type === "income" ? "Income" : "Expense"}
            </button>

          </form>
        </div>

        {/* Transaction History */}
        <div className="bg-white rounded-xl shadow p-6">

          <h3 className="text-xl font-bold text-gray-800 mb-5">
            Recent Transactions
          </h3>

          {transactions.length === 0 ? (
            <p className="text-gray-500">
              No transactions yet. Start adding your income and expenses!
            </p>
          ) : (

            <div className="space-y-4">

              {transactions.map((item) => (

                <div
                  key={item.id}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 border-b border-gray-200 pb-4"
                >

                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {item.category}
                    </h4>
                    
                    {item.note && (
                      <p className="text-sm text-gray-500">
                        {item.note}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between gap-4">

                    <span
                      className={`font-bold ${
                        item.type === "income"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {item.type === "income" ? "+" : "-"}
                      {formatMoney(item.amount)}
                    </span>

                    <button
                      onClick={() => deleteTransaction(item.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </main>
    </div>
  );
}
