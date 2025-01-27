"use client";

import React, { useState } from 'react';
import { Table } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

// Mock transaction data
const mockTransactionData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  type: ['Borrow', 'Lend', 'Repay'][i % 3],
  asset: ['ETH', 'USDC', 'DAI'][i % 3],
  amount: (Math.random() * 1000).toFixed(2),
  date: new Date(Date.now() - i * 86400000).toLocaleDateString(),
  status: ['Completed', 'Pending', 'Failed'][i % 3]
}));

export default function TransactionHistoryPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const itemsPerPage = 10;

  const filteredData = mockTransactionData.filter(item => 
    (filter === 'All' || item.type === filter) &&
    (item.asset.toLowerCase().includes(searchTerm.toLowerCase()) ||
     item.type.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <Card className="w-full max-w-6xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <div className="flex justify-between items-center space-x-4">
          <Input 
            placeholder="Search transactions" 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-1/3"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Filter: {filter}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter('All')}>
                All Transactions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('Borrow')}>
                Borrow
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('Lend')}>
                Lend
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('Repay')}>
                Repay
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <thead>
            <tr>
              <th>Transaction Type</th>
              <th>Asset</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id}>
                <td>{item.type}</td>
                <td>{item.asset}</td>
                <td>{item.amount}</td>
                <td>{item.date}</td>
                <td>
                  <span className={`
                    px-2 py-1 rounded-full text-xs
                    ${item.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                      item.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'}
                  `}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        
        <div className="flex justify-between items-center mt-4">
          <div>
            Page {currentPage} of {totalPages}
          </div>
          <div className="space-x-2">
            <Button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}