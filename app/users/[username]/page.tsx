'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getUserDetails, getUserChargeHistory, getUserWithdrawHistory, getUserBalance, updateUserAutoWithdraw } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
export default function UserDetails() {
  const {toast} = useToast();
  const { username } = useParams();
  const [user, setUser] = useState<any>(null);
  const [chargeHistory, setChargeHistory] = useState([]);
  const [withdrawHistory, setWithdrawHistory] = useState([]);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchUserData();
  }, [username]);

  const fetchUserData = async () => {
    try {
      const userData = await getUserDetails(username as string);
      setUser(userData);
      
      const chargeData = await getUserChargeHistory(username as string);
      setChargeHistory(chargeData.charge_history);

      const withdrawData = await getUserWithdrawHistory(username as string);
      setWithdrawHistory(withdrawData.withdraw_history);

      const balanceData = await getUserBalance(username as string);
      setBalance(balanceData.balance);
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  };

  const handleAutoWithdrawToggle = async () => {
    try {
      await updateUserAutoWithdraw(username as string, !user.auto_withdraw);
      setUser({ ...user, auto_withdraw: !user.auto_withdraw });
      toast({
        title: "Auto withdraw updated",
        description: "Your account has been updated.",
        variant: "default",
        className: "bg-green-600 text-white",
      })
    } catch (error) {
      console.error('Failed to update auto withdraw', error);
    }
  };

  if (!user) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className="p-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 min-h-screen"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1 className="mb-6 text-3xl font-bold text-gray-800 dark:text-gray-100" variants={itemVariants}>
        User Details: {user.username}
      </motion.h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div variants={itemVariants}>
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-green-600 dark:text-green-400">{balance} USDT</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Auto Withdraw</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <span className="text-lg text-gray-600 dark:text-gray-400">Status:</span>
              <Switch
                checked={user.auto_withdraw}
                onCheckedChange={handleAutoWithdrawToggle}
                className="ml-4"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div variants={itemVariants}>
        <Card className="mb-8 bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Charge History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-600 dark:text-gray-400">Timestamp</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">From</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">To</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {chargeHistory.map((charge: any, index: number) => (
                  <TableRow key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <TableCell>{new Date(charge.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{charge.from}</TableCell>
                    <TableCell>{charge.to}</TableCell>
                    <TableCell className="font-semibold text-green-600 dark:text-green-400">{charge.amount} USDT</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-white dark:bg-gray-800 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-gray-700 dark:text-gray-300">Withdraw History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-gray-600 dark:text-gray-400">Timestamp</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">From</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">To</TableHead>
                  <TableHead className="text-gray-600 dark:text-gray-400">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawHistory.map((withdraw: any, index: number) => (
                  <TableRow key={index} className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                    <TableCell>{new Date(withdraw.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{withdraw.from}</TableCell>
                    <TableCell>{withdraw.to}</TableCell>
                    <TableCell className="font-semibold text-red-600 dark:text-red-400">{withdraw.amount} USDT</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}