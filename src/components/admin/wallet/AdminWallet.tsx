// import { useState, useEffect, useMemo } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import {
//   BarChart3,
//   Calendar,
//   Clock,
//   CheckCircle2,
//   AlertCircle,
//   Search,
//   Filter,
//   ArrowUpRight,
//   ArrowDownLeft,
//   DollarSign,
//   Receipt,
//   ShoppingCart,
// } from "lucide-react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Input } from "@/components/ui/input"

// interface Transaction {
//   id: string
//   type: "deposit" | "payment" | "refund" | "withdrawal" | "payout"
//   amount: number
//   date: string
//   status: "completed" | "pending" | "failed"
//   description: string
//   vendor?: string
//   client?: string
//   service?: string
// }

// interface AdminWalletProps {
//   totalBalance: number
//   transactions: Transaction[]
// }

// const sampleTransactions: Transaction[] = [
//   {
//     id: "tx-1",
//     type: "payment",
//     amount: 250,
//     date: "2023-05-12T10:30:00",
//     status: "completed",
//     description: "Payment received for Web Development",
//     client: "John Smith",
//     vendor: "John's Web Services",
//     service: "Website Redesign",
//   },
//   {
//     id: "tx-2",
//     type: "payout",
//     amount: 200,
//     date: "2023-05-11T14:20:00",
//     status: "completed",
//     description: "Payout to vendor",
//     vendor: "John's Web Services",
//   },
//   {
//     id: "tx-3",
//     type: "payment",
//     amount: 150,
//     date: "2023-05-08T09:15:00",
//     status: "completed",
//     description: "Payment received for Logo Design",
//     client: "Sarah Johnson",
//     vendor: "Creative Designs Inc.",
//     service: "Logo Design",
//   },
//   {
//     id: "tx-4",
//     type: "payout",
//     amount: 120,
//     date: "2023-05-07T16:45:00",
//     status: "pending",
//     description: "Payout to vendor",
//     vendor: "Creative Designs Inc.",
//   },
//   {
//     id: "tx-5",
//     type: "refund",
//     amount: 150,
//     date: "2023-05-03T11:20:00",
//     status: "completed",
//     description: "Refund issued for cancelled service",
//     client: "Michael Brown",
//     vendor: "Creative Designs Inc.",
//   },
// ]

// export const AdminWallet = ({ totalBalance = 125800, transactions = [] }: AdminWalletProps) => {
//   const [filterPeriod, setFilterPeriod] = useState("all")
//   const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([])

//   // Memoize allTransactions to prevent reference changes
//   const allTransactions = useMemo(() => {
//     console.log("Computing allTransactions, transactions length:", transactions.length)
//     return transactions.length > 0 ? transactions : sampleTransactions
//   }, [transactions])

//   useEffect(() => {
//     console.log("useEffect running, filterPeriod:", filterPeriod, "allTransactions length:", allTransactions.length)
//     const now = new Date()
//     const filtered = allTransactions.filter((tx) => {
//       const txDate = new Date(tx.date)
//       if (filterPeriod === "all") return true
//       if (filterPeriod === "today") {
//         return txDate.toDateString() === now.toDateString()
//       }
//       if (filterPeriod === "week") {
//         const weekAgo = new Date(now)
//         weekAgo.setDate(now.getDate() - 7)
//         return txDate >= weekAgo
//       }
//       if (filterPeriod === "month") {
//         const monthAgo = new Date(now)
//         monthAgo.setMonth(now.getMonth() - 1)
//         return txDate >= monthAgo
//       }
//       return true
//     })

//     // Avoid unnecessary state updates
//     if (JSON.stringify(filtered) !== JSON.stringify(filteredTransactions)) {
//       console.log("Updating filteredTransactions, count:", filtered.length)
//       setFilteredTransactions(filtered)
//     }
//   }, [filterPeriod, allTransactions, filteredTransactions])

//   const formatCurrency = (amount: number) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 2,
//     }).format(amount)
//   }

//   const formatDate = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleDateString("en-IN", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     })
//   }

//   const formatTime = (dateString: string) => {
//     const date = new Date(dateString)
//     return date.toLocaleTimeString("en-IN", {
//       hour: "2-digit",
//       minute: "2-digit",
//     })
//   }

//   const getTransactionIcon = (type: string) => {
//     switch (type) {
//       case "deposit":
//         return (
//           <div className="bg-teal-900 p-2 rounded-full">
//             <ArrowDownLeft className="h-4 w-4 text-teal-400" />
//           </div>
//         )
//       case "withdrawal":
//       case "payout":
//         return (
//           <div className="bg-amber-900 p-2 rounded-full">
//             <ArrowUpRight className="h-4 w-4 text-amber-400" />
//           </div>
//         )
//       case "payment":
//         return (
//           <div className="bg-blue-900 p-2 rounded-full">
//             <ShoppingCart className="h-4 w-4 text-blue-400" />
//           </div>
//         )
//       case "refund":
//         return (
//           <div className="bg-rose-900 p-2 rounded-full">
//             <Receipt className="h-4 w-4 text-rose-400" />
//           </div>
//         )
//       default:
//         return (
//           <div className="bg-gray-800 p-2 rounded-full">
//             <DollarSign className="h-4 w-4 text-gray-400" />
//           </div>
//         )
//     }
//   }

//   const getStatusBadge = (status: string) => {
//     switch (status) {
//       case "completed":
//         return (
//           <Badge variant="outline" className="bg-teal-900/30 text-teal-400 border-teal-800">
//             <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
//           </Badge>
//         )
//       case "pending":
//         return (
//           <Badge variant="outline" className="bg-amber-900/30 text-amber-400 border-amber-800">
//             <Clock className="mr-1 h-3 w-3" /> Pending
//           </Badge>
//         )
//       case "failed":
//         return (
//           <Badge variant="outline" className="bg-rose-900/30 text-rose-400 border-rose-800">
//             <AlertCircle className="mr-1 h-3 w-3" /> Failed
//           </Badge>
//         )
//       default:
//         return (
//           <Badge variant="outline" className="bg-gray-800 text-gray-300 border-gray-700">
//             {status}
//           </Badge>
//         )
//     }
//   }

//   return (
//     <div className="container mx-auto p-4 bg-gray-900 min-h-screen text-gray-100">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-white flex items-center">
//             <BarChart3 className="mr-2 h-7 w-7 text-purple-400" />
//             Admin Dashboard
//           </h1>
//           <p className="text-gray-400 mt-1">Manage platform finances and transactions</p>
//         </div>
//       </div>

//       {/* Total Balance Card */}
//       <div className="mb-6">
//         <Card className="overflow-hidden border-gray-800 bg-gray-800">
//           <CardHeader className="pb-2">
//             <CardDescription className="text-sm font-medium text-gray-400">Total Platform Balance</CardDescription>
//             <CardTitle className="text-3xl font-bold text-white flex items-baseline">
//               {formatCurrency(totalBalance)}
//               <span className="text-sm font-normal text-gray-400 ml-2">INR</span>
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="flex items-center justify-between text-sm">
//               <span className="text-gray-400">Platform revenue and fees</span>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Transaction History */}
//       <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
//           <h2 className="text-xl font-bold text-white">Transaction History</h2>
//           <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
//             <div className="relative flex-grow">
//               <Input
//                 placeholder="Search transactions..."
//                 className="pl-9 border-gray-700 bg-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:ring-purple-500"
//               />
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
//             </div>
//             <Select value={filterPeriod} onValueChange={setFilterPeriod}>
//               <SelectTrigger className="w-full sm:w-[150px] border-gray-700 bg-gray-700 text-white focus:ring-purple-500">
//                 <SelectValue placeholder="Filter by period" />
//               </SelectTrigger>
//               <SelectContent className="bg-gray-800 border-gray-700 text-white">
//                 <SelectItem value="all" className="focus:bg-gray-700">
//                   All Time
//                 </SelectItem>
//                 <SelectItem value="today" className="focus:bg-gray-700">
//                   Today
//                 </SelectItem>
//                 <SelectItem value="week" className="focus:bg-gray-700">
//                   This Week
//                 </SelectItem>
//                 <SelectItem value="month" className="focus:bg-gray-700">
//                   This Month
//                 </SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         <div className="divide-y divide-gray-700">
//           <AnimatePresence>
//             {filteredTransactions.map((transaction, index) => (
//               <motion.div
//                 key={transaction.id}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 exit={{ opacity: 0, y: -10 }}
//                 transition={{ duration: 0.3, delay: index * 0.03 }}
//                 className="flex flex-col sm:flex-row sm:items-center justify-between py-4 hover:bg-gray-750 px-4 -mx-4 rounded-lg"
//               >
//                 <div className="flex items-center space-x-4 mb-2 sm:mb-0">
//                   {getTransactionIcon(transaction.type)}
//                   <div>
//                     <p className="font-medium text-white">{transaction.description}</p>
//                     <div className="flex items-center text-sm text-gray-400 mt-1">
//                       <Calendar className="h-3.5 w-3.5 mr-1" />
//                       {formatDate(transaction.date)} at {formatTime(transaction.date)}
//                     </div>
//                     {transaction.vendor && (
//                       <div className="text-sm text-gray-400 mt-1">
//                         <span className="font-medium text-gray-300">Vendor:</span> {transaction.vendor}
//                       </div>
//                     )}
//                     {transaction.client && (
//                       <div className="text-sm text-gray-400 mt-1">
//                         <span className="font-medium text-gray-300">Client:</span> {transaction.client}
//                       </div>
//                     )}
//                   </div>
//                 </div>
//                 <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
//                   <div className="text-right sm:text-left">
//                     <p
//                       className={`font-semibold ${
//                         transaction.type === "refund" || transaction.type === "payout"
//                           ? "text-rose-400"
//                           : "text-purple-400"
//                       }`}
//                     >
//                       {transaction.type === "refund" || transaction.type === "payout" ? "-" : "+"}
//                       {formatCurrency(transaction.amount)}
//                     </p>
//                   </div>
//                   <div>{getStatusBadge(transaction.status)}</div>
//                 </div>
//               </motion.div>
//             ))}
//           </AnimatePresence>
//         </div>

//         {filteredTransactions.length === 0 && (
//           <div className="py-12 text-center">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-4">
//               <Receipt className="h-8 w-8 text-gray-500" />
//             </div>
//             <h3 className="text-lg font-medium text-white mb-2">No transactions found</h3>
//             <p className="text-gray-400 max-w-md mx-auto mb-6">
//               There are no transactions matching your current filters. Try adjusting your search or filter criteria.
//             </p>
//             <Button
//               variant="outline"
//               onClick={() => setFilterPeriod("all")}
//               className="border-gray-700 text-white hover:bg-gray-700"
//             >
//               View All Transactions
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default AdminWallet




import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wallet, Calendar, Clock, CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownLeft, DollarSign, Receipt, ShoppingCart, IndianRupee } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetAdminWalletByIdMutation } from "@/hooks/AdminCustomHooks";
import { Pagination1 } from "@/components/common/paginations/Pagination";

interface Transaction {
  _id: string;
  paymentType: string;
  amount: number;
  date: string;
  paymentStatus: string;
  description: string;
  vendor?: string;
  service?: string;
}

const sampleTransactions: Transaction[] = [
  {
    _id: "tx-1",
    paymentType: "payment",
    amount: 250,
    date: "2023-05-12T10:30:00",
    paymentStatus: "completed",
    description: "Payment for Web Development",
    vendor: "John's Web Services",
    service: "Website Redesign",
  },
];

export const AdminWallet = () => {
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [transaction, setTransaction] = useState<any>([]);
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
          console.log(data);
        },
        onError: (error) => {
          console.log(error);
        },
      }
    );
  }, [currentPage]);

  useEffect(() => {
    console.log("useEffect running, filterPeriod:", filterPeriod, "allTransactions length:", transaction.length);
    const now = new Date();
    const filtered = transaction.filter((tx: any) => {
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
      console.log("Updating filteredTransactions, count:", filtered.length);
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-teal-900 text-teal-300 border-teal-700">
            <CheckCircle2 className="mr-1 h-3 w-3" /> Completed
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="bg-amber-900 text-amber-300 border-amber-700">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="outline" className="bg-rose-900 text-rose-300 border-rose-700">
            <AlertCircle className="mr-1 h-3 w-3" /> Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-gray-700 text-gray-300 border-gray-600">
            {status}
          </Badge>
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
              ₹{balance !== undefined ? balance : 0}
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
            It looks like you haven't made any transactions yet. Your transaction history will appear here once you do.
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
                        {transaction.amount}
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