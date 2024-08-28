
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MarketData = () => {
    const [u30Data, setU30Data] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchData = async (url, setData) => {
            try {
                const response = await axios.get(url);
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData('https://svm-server1.onrender.com/getU30_1DayBacktestPeeData', setU30Data);
    }, []);

    const handleShowModal = (item) => {
        setSelectedItem(item);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedItem(null);
    };

    // Prepare data for the chart
    const chartData = {
        labels: u30Data.map(item => item.date), // X-axis labels (Date)
        datasets: [
            {
                label: 'Closed Price',
                data: u30Data.map(item => item.closed), // Y-axis data (Closed Price)
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
                tension: 0.1,
            },
        ],
    };

    const chartOptions = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Date',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Closed Price',
                },
                beginAtZero: false,
            },
        },
    };

    return (
        <div className="container">
            <h1 className="my-4">Market Data</h1>

            {/* Line Chart for Closed Price */}
            <div className="mt-4">
                <h2>Closed Price Over Time</h2>
                <Line data={chartData} options={chartOptions} />
            </div>

            <div className="mt-4">
                <h2>U30 1 Day Backtest Data</h2>
                <table className="table table-bordered table-hover">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Date</th>
                            <th>Closed Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {u30Data.map(item => (
                            <tr key={item._id}>
                                <td>{item.no_}</td>
                                <td>{item.date}</td>
                                <td>{item.closed}</td>
                                <td>
                                    <Button variant="primary" onClick={() => handleShowModal(item)}>
                                        View Details
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedItem && (
                        <div>
                            <p><strong>No:</strong> {selectedItem.no_}</p>
                            <p><strong>Date:</strong> {selectedItem.date}</p>
                            <p><strong>Closed Price:</strong> {selectedItem.closed}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default MarketData;
