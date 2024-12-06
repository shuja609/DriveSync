import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import orderService from '../../../services/orderService';

const OrdersList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                console.log('Fetching orders...');
                const data = await orderService.getAllOrders();
                console.log('Orders response:', data);
                setOrders(data || []);
            } catch (err) {
                console.error('Error details:', err);
                setError(err.message || 'Failed to fetch orders');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
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

    if (!orders.length) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl text-text-primary mb-4">No Orders Found</h2>
                <p className="text-text-primary/70">There are currently no orders in the system.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-text-primary">Orders</h1>
                <button className="bg-primary-light text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors">
                    Create Order
                </button>
            </div>

            <div className="bg-background-light rounded-lg shadow overflow-x-auto">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-background-dark">
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">
                                Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">
                                Vehicle
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-text-primary uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-background-dark">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-background-dark/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-text-primary">
                                    {order._id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-text-primary">
                                    {order.customer?.name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-text-primary">
                                    {order.vehicle?.name || 'N/A'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                        ${order.status === 'completed' ? 'bg-green-100 text-green-800' : 
                                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                          'bg-red-100 text-red-800'}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-text-primary">
                                    ${order.amount?.toFixed(2) || '0.00'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-3">
                                        <Link 
                                            to={`/admin/sales/orders/${order._id}`} 
                                            className="text-primary-light hover:text-primary transition-colors"
                                        >
                                            <FiEye className="w-5 h-5" />
                                        </Link>
                                        <button className="text-blue-500 hover:text-blue-600 transition-colors">
                                            <FiEdit2 className="w-5 h-5" />
                                        </button>
                                        <button className="text-red-500 hover:text-red-600 transition-colors">
                                            <FiTrash2 className="w-5 h-5" />
                                        </button>
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

export default OrdersList; 