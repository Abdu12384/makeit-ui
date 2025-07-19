import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Calendar,  ArrowUpRight, ArrowDownLeft, DollarSign, Receipt, ShoppingCart, IndianRupee } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAdminWalletByIdMutation } from "@/hooks/AdminCustomHooks";
import { Pagination1 } from "@/components/common/paginations/Pagination";
import { Transaction } from "@/types/transaction";


export const AdminWallet = () => {
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [transaction, setTransaction] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;
  const getAdminWalletByIdMutation = useGetAdminWalletByIdMutation();

  useEffect(() => {
    getAdminWalletByIdMutation.mutate(
      {
        page: currentPage,
        limit: limit,
      },
      {
        onSuccess: (data) => {
          setBalance(data.wallet.wallet.balance);
          setTransaction(data.wallet.transaction);
          setTotalPages(data.wallet.total);
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  }, [currentPage]);

  useEffect(() => {
    const now = new Date();
    const filtered = transaction.filter((tx: Transaction) => {
      const txDate = new Date(tx.date);
      if (filterPeriod === "all") return true;
      if (filterPeriod === "today") {
        return txDate.toDateString() === now.toDateString();
      }
      if (filterPeriod === "week") {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return txDate >= weekAgo;
      }
      if (filterPeriod === "month") {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        return txDate >= monthAgo;
      }
      return true;
    });

    if (JSON.stringify(filtered) !== JSON.stringify(filteredTransactions)) {
      setFilteredTransactions(filtered);
    }
  }, [filterPeriod, transaction, filteredTransactions]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "credit":
        return (
          <div className="bg-teal-900 p-2 rounded-full">
            <ArrowDownLeft className="h-4 w-4 text-teal-400" />
          </div>
        );
      case "withdrawal":
        return (
          <div className="bg-amber-900 p-2 rounded-full">
            <ArrowUpRight className="h-4 w-4 text-amber-400" />
          </div>
        );
      case "debit":
        return (
          <div className="bg-rose-900 p-2 rounded-full">
            <ShoppingCart className="h-4 w-4 text-rose-400" />
          </div>
        );
      case "refund":
        return (
          <div className="bg-teal-900 p-2 rounded-full">
            <Receipt className="h-4 w-4 text-teal-400" />
          </div>
        );
      default:
        return (
          <div className="bg-gray-700 p-2 rounded-full">
            <DollarSign className="h-4 w-4 text-gray-400" />
          </div>
        );
    }
  };



  return (
    <div className="container mx-auto p-4 bg-gray-900 min-h-screen text-gray-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center">
            <Wallet className="mr-2 h-7 w-7 text-teal-400" />
            My Wallet
          </h1>
          <p className="text-gray-400 mt-1">Manage your funds and transactions</p>
        </div>
      </div>

      {/* Wallet Balance Card */}
      <div className="mb-6">
        <Card className="overflow-hidden bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium text-gray-400">Wallet Balance</CardDescription>
            <CardTitle className="text-3xl font-bold text-white flex items-baseline">
              ₹{balance !== undefined ? balance.toFixed(2) : 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Available for payments</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dummy UI for No Balance and No Transactions */}
      {balance === 0 && filteredTransactions.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-4">
            <IndianRupee className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-white mb-2">No Transactions Yet</h3>
          <p className="text-gray-400 max-w-md mx-auto mb-6">
            It looks like you haven't made transactions yet. Your transaction history will appear here once you do.
          </p>
        </motion.div>
      ) : (
        /* Transaction History */
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-white">Transaction History</h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-full sm:w-[150px] bg-gray-700 border-gray-600 text-gray-200">
                  <SelectValue placeholder="Filter by period" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600 text-gray-200">
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="divide-y divide-gray-700">
            <AnimatePresence>
              {filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-4 hover:bg-gray-700 px-4 -mx-4 rounded-lg"
                >
                  <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                    {getTransactionIcon(transaction.paymentStatus)}
                    <div>
                      <p className="font-medium text-white">{transaction.paymentType}</p>
                      <div className="flex items-center text-sm text-gray-400 mt-1">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {formatDate(transaction.date)} at {formatTime(transaction.date)}
                      </div>
                      {transaction.relatedTitle && (
                        <div className="text-sm text-slate-500 mt-1">
                          <span className="font-medium">Related:</span> {transaction.relatedTitle}
                        </div>
                      )}
                      {transaction.vendor && (
                        <div className="text-sm text-gray-400 mt-1">
                          <span className="font-medium">Vendor:</span> {transaction?.vendor}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
                    <div className="text-right sm:text-left">
                      <p
                        className={`font-semibold ${
                          transaction.paymentStatus === "credit"
                            ? "text-teal-400"
                            : "text-rose-400"
                        }`}
                      >
                        {transaction.paymentStatus === "credit" ? "+" : "-"}
                        {transaction.amount.toFixed(2)}
                      </p>
                    </div>
                    <div>{transaction.paymentType}</div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-4">
                <Receipt className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">No transactions found</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                There are no transactions matching your current filters. Try adjusting your filter criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => setFilterPeriod("all")}
                className="bg-gray-700 border-gray-600 text-gray-200 hover:bg-gray-600"
              >
                View All Transactions
              </Button>
            </div>
          )}
        </div>
      )}
      <Pagination1
        currentPage={currentPage}
        totalPages={totalPages}
        onPagePrev={() => setCurrentPage(currentPage - 1)}
        onPageNext={() => setCurrentPage(currentPage + 1)}
      />
    </div>
  );
};

export default AdminWallet;