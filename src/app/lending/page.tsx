"use client";

import React, { useState } from 'react';
import { Table } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


const mockLendingData = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  asset: ['ETH', 'USDC', 'DAI'][i % 3],
  availableAmount: (Math.random() * 1000).toFixed(2),
  apy: (Math.random() * 10).toFixed(2),
  totalSupplied: (Math.random() * 5000).toFixed(2)
}));

export default function LendingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const filteredData = mockLendingData.filter(item => 
    item.asset.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage, 
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  return (
    <Card className="w-full max-w-6xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Lending Marketplace</CardTitle>
        <div className="flex justify-between items-center">
          <Input 
            placeholder="Search assets" 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-1/3"
          />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <thead>
            <tr>
              <th>Asset</th>
              <th>Available Amount</th>
              <th>APY (%)</th>
              <th>Total Supplied</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((item) => (
              <tr key={item.id}>
                <td>{item.asset}</td>
                <td>{item.availableAmount}</td>
                <td>{item.apy}</td>
                <td>{item.totalSupplied}</td>
                <td>
                  <Button variant="outline">Supply</Button>
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