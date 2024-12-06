import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEye } from 'react-icons/fi';
import transactionService from '../../../services/transactionService';

const TransactionsList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const data = await transactionService.getAllTransactions();
                setTransactions(data || []);
            } catch (err) {
                setError('Failed to fetch transactions');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <div className="text-red-500 text-lg">{error}</div>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-primary-light text-white rounded-lg hover:bg-primary-dark"
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!transactions.length) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl text-text-primary mb-4">No Transactions Found</h2>
                <p className="text-text-primary/70">There are currently no transactions in the system.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-text-primary">Transactions</h1>
            </div>

            <div className="bg-background-light rounded-lg shadow overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-background-dark">
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">
                                Transaction ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">
                                Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-background-dark">
                        {transactions.map((transaction) => (
                            <tr key={transaction._id} className="hover:bg-background-dark/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-text-primary">
                                    {transaction._id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-text-primary">
                                    <Link 
                                        to={`/admin/sales/orders/${transaction.orderId}`}
                                        className="text-primary-light hover:text-primary transition-colors"
                                    >
                                        {transaction.orderId}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                                        ${transaction.type === 'payment' ? 'bg-blue-100 text-blue-800' : 
                                          'bg-orange-100 text-orange-800'}`}>
                                        {transaction.type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-text-primary">
                                    ${transaction.amount?.toFixed(2) || '0.00'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${transaction.status === 'successful' ? 'bg-green-100 text-green-800' : 
                                          transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                          'bg-red-100 text-red-800'}`}>
                                        {transaction.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-text-primary">
                                    {new Date(transaction.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-3">
                                        <Link 
                                            to={`/admin/sales/transactions/${transaction._id}`}
                                            className="text-primary-light hover:text-primary transition-colors"
                                        >
                                            <FiEye className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionsList; 