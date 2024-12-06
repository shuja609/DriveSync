import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const SalesChart = ({ data, type = 'sales' }) => {
    if (!data) return null;

    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: type === 'sales' ? 'Sales' : 'Revenue',
                data: data.values,
                fill: true,
                borderColor: type === 'sales' ? '#3949AB' : '#4CAF50',
                backgroundColor: type === 'sales' 
                    ? 'rgba(57, 73, 171, 0.1)' 
                    : 'rgba(76, 175, 80, 0.1)',
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: type === 'sales' ? '#3949AB' : '#4CAF50',
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: '#E0E0E0'
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: '#1E1E1E',
                titleColor: '#E0E0E0',
                bodyColor: '#E0E0E0',
                borderColor: '#3949AB',
                borderWidth: 1,
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (type === 'revenue') {
                            label += new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD'
                            }).format(context.parsed.y);
                        } else {
                            label += context.parsed.y;
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#E0E0E0'
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: '#E0E0E0',
                    callback: function(value) {
                        if (type === 'revenue') {
                            return '$' + value.toLocaleString();
                        }
                        return value;
                    }
                }
            }
        }
    };

    return (
        <div className="h-[300px]">
            <Line data={chartData} options={options} />
        </div>
    );
};

export default SalesChart; 