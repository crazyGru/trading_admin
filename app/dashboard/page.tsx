'use client';

import { useState, useEffect } from 'react';
import { getUsers } from '../services/api';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers(page, limit);
      setUsers(data);
      setHasMore(data.length === limit);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col"
    >
      <div className="flex-grow max-w-7xl w-full mx-auto py-2 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white shadow-lg rounded-lg overflow-hidden"
        >
          <div className="px-4 py-1 border-b border-gray-200 sm:px-6 bg-gradient-to-r from-blue-500 to-indigo-600">
            <h1 className="text-2xl font-semibold text-white flex items-center">
              <Users className="mr-2" /> User List
            </h1>
          </div>
          <div className="px-4 py-5 sm:p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="h-[400px] overflow-auto bg-gray-800 rounded-lg shadow-lg">
                <Table >
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="w-2/3 py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</TableHead>
                      <TableHead className="w-1/3 py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user: any, index: number) => (
                      <motion.tr 
                        key={user.username}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                      >
                        <TableCell className="py-4 px-6 text-sm font-medium text-gray-900">{user.username}</TableCell>
                        <TableCell className="py-4 px-6 text-sm">
                          <Link href={`/users/${user.username}`}>
                            <Button variant="outline" size="sm" className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 transition-colors duration-300">View Details</Button>
                          </Link>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </motion.div>
            )}
          </div>
          <div className="px-4 py-4 sm:px-6 border-t border-gray-200 bg-gray-50">
            <nav className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <Button onClick={() => setPage(page - 1)} disabled={page === 1} size="sm" className="bg-blue-600 text-white">
                  Previous
                </Button>
                <Button onClick={() => setPage(page + 1)} disabled={!hasMore} size="sm" className="bg-blue-600 text-white">
                  Next
                </Button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing page <span className="font-medium">{page}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <Button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                    </Button>
                    <Button
                      onClick={() => setPage(page + 1)}
                      disabled={!hasMore}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" aria-hidden="true" />
                    </Button>
                  </nav>
                </div>
              </div>
            </nav>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
