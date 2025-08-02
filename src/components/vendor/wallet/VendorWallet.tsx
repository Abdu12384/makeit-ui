import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Calendar, ArrowUpRight, ArrowDownLeft, DollarSign, Receipt, ShoppingCart, IndianRupee } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetVendorWalletByIdMutation } from "@/hooks/VendorCustomHooks";
import { Pagination1 } from "@/components/common/paginations/Pagination";
import { ITransaction } from "@/types/transaction";

 
export const VendorWallet = () => {
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [filteredTransactions, setFilteredTransactions] = useState<ITransaction[]>([]);
  const [transaction, setTransaction] = useState<ITransaction[]>([]);
  const [balance, setBalance] = useState<number | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10
  const getVendorWalletByIdMutation = useGetVendorWalletByIdMutation()  


  useEffect(() => {
    getVendorWalletByIdMutation.mutate(
      {
        page:currentPage,
        limit:limit
      },
      {
        onSuccess: (data) => {
          setBalance(data.wallet.wallet.balance)
          setTransaction(data.wallet.transaction)
          setTotalPages(data.wallet.total)
        },
        onError: (error) => {
          console.log(error)
        }
      }
    )
  },[currentPage])



  useEffect(() => {
    const now = new Date();
    const filtered = transaction.filter((tx:ITransaction) => {
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
          <div className="bg-teal-100 p-2 rounded-full">
            <ArrowDownLeft className="h-4 w-4 text-teal-600" />
          </div>
        );
      case "withdrawal":
        return (
          <div className="bg-amber-100 p-2 rounded-full">
            <ArrowUpRight className="h-4 w-4 text-amber-600" />
          </div>
        );
      case "debit":
        return (
          <div className="bg-rose-100 p-2 rounded-full">
            <ShoppingCart className="h-4 w-4 text-rose-600" />
          </div>
        );
      case "refund":
        return (
          <div className="bg-teal-100 p-2 rounded-full">
            <Receipt className="h-4 w-4 text-teal-600" />
          </div>
        );
      default:
        return (
          <div className="bg-slate-100 p-2 rounded-full">
            <DollarSign className="h-4 w-4 text-slate-600" />
          </div>
        );
    }
  };

 
  return (
    <div className="container mx-auto p-4 bg-slate-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center">
            <Wallet className="mr-2 h-7 w-7 text-teal-600" /> My Wallet
          </h1>
          <p className="text-slate-500 mt-1">Manage your funds and transactions</p>
        </div>
      </div>

      {/* Wallet Balance Card */}
      <div className="mb-6">
        <Card className="overflow-hidden border-slate-200">
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium text-slate-500">Wallet Balance</CardDescription>
            <CardTitle className="text-3xl font-bold text-slate-800 flex items-baseline">
              ₹{balance !== undefined ? balance.toFixed(2) : 0}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500">Available for payments</span>
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
          className="bg-white rounded-lg border border-slate-200 p-6 mb-6 text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
            <IndianRupee className="h-8 w-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No Transactions Yet</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-6">
            It looks like you haven't made  transactions yet. Your transaction history will appear here once you do.
          </p>
        </motion.div>
      ) : (
        /* Transaction History */
        <div className="bg-white rounded-lg border border-slate-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-xl font-bold text-slate-800">Transaction History</h2>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-full sm:w-[150px] border-slate-200">
                  <SelectValue placeholder="Filter by period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            <AnimatePresence>
              {filteredTransactions.map((transaction, index) => (
                <motion.div
                  key={transaction._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, delay: index * 0.03 }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between py-4 hover:bg-slate-50 px-4 -mx-4 rounded-lg"
                >
                  {/* Left Section: Icon + Main Title + Date/Time + Vendor */}
                  <div className="flex items-center space-x-4 mb-2 sm:mb-0 flex-grow-[2] min-w-0">
                    {getTransactionIcon(transaction.paymentStatus)}
                    <div>
                      {/* Main title for the transaction, using relatedTitle or a generic "Transaction" */}
                      <p className="font-medium text-slate-800">{transaction.relatedTitle || "Transaction"}</p>
                      <div className="flex items-center text-sm text-slate-500 mt-1">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {formatDate(transaction.date)} at {formatTime(transaction.date)}
                      </div>
                      {/* Vendor is still here if it exists */}
                      {transaction.vendor && (
                        <div className="text-sm text-slate-500 mt-1">
                          <span className="font-medium">Vendor:</span> {transaction?.vendor}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Middle Section: Payment Type (explicitly centered, hidden on small screens) */}
                  <div className="flex-grow-[1] text-center hidden sm:block">
                    <p className="text-sm text-slate-600">{transaction.paymentType}</p>
                  </div>

                  {/* Right Section: Amount (right-aligned, fixed position) */}
                  <div className="flex-shrink-0 text-right w-24">
                    <p
                      className={`font-semibold ${
                        transaction.paymentStatus === "credit" ? "text-teal-600" : "text-rose-600"
                      }`}
                    >
                      {transaction.paymentStatus === "credit" ? "+" : "-"}₹{transaction.amount.toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          {filteredTransactions.length === 0 && (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <Receipt className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-slate-900 mb-2">No transactions found</h3>
              <p className="text-slate-500 max-w-md mx-auto mb-6">
                There are no transactions matching your current filters. Try adjusting your filter criteria.
              </p>
              <Button
                variant="outline"
                onClick={() => setFilterPeriod("all")}
                className="border-slate-200 text-slate-700"
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
  )
};

export default VendorWallet;