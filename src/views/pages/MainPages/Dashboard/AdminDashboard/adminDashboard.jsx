// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Card, Col, Row, Typography, Statistic } from 'antd';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';

import '../../Dashboard/AdminDashboard/adminDashboard.css'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    Legend
);

const { Title: AntTitle } = Typography;

const AdminDashboard = () => {
    const [tickets, setTickets] = useState([]);

    useEffect(() => {
        fetch('https://wd79p.com/backend/public/api/tickets')
            .then(response => response.json())
            .then(data => setTickets(data))
            .catch(error => console.error('Error fetching ticket data:', error));
    }, []);

    const priorityCounts = tickets.reduce((acc, ticket) => {
        acc[ticket.priority] = (acc[ticket.priority] || 0) + 1;
        return acc;
    }, {});

    const statusCounts = tickets.reduce((acc, ticket) => {
        acc[ticket.status] = (acc[ticket.status] || 0) + 1;
        return acc;
    }, {});

    const priorityData = {
        labels: Object.keys(priorityCounts),
        datasets: [{
            label: 'Tickets by Priority',
            data: Object.values(priorityCounts),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }],
    };

    const statusData = {
        labels: Object.keys(statusCounts),
        datasets: [{
            label: 'Tickets by Status',
            data: Object.values(statusCounts),
            fill: false,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            tension: 0.1,
        }],
    };

    const totalTickets = tickets.length;
    const newTickets = tickets.filter(ticket => ticket.status === 'New').length;
    const inprogress = tickets.filter(ticket => ticket.status === 'In Progress').length;
    const follwedup = tickets.filter(ticket => ticket.status === 'To Be Followed Up').length;
    const estimate = tickets.filter(ticket => ticket.status === 'Estimate Sent').length;
    const purchased = tickets.filter(ticket => ticket.status === 'Purchased Order').length;
    const solved = tickets.filter(ticket => ticket.status === 'Solved').length;
    const closedTickets = tickets.filter(ticket => ticket.status === 'Closed').length;

    return (
        <div className="page-wrapper" style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
            <AntTitle level={2} style={{ textAlign: 'center', marginBottom: '20px' }}>Admin Dashboard</AntTitle>
            <Row gutter={16}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                    <Card
                        title="Total Tickets"
                        style={{ marginBottom: '16px', borderRadius: '8px' }}
                        bodyStyle={{ padding: '16px' }}
                    >
                        <Statistic
                            title="Total Tickets"
                            value={totalTickets}
                            style={{ textAlign: 'center' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                    <Card
                        title="New Tickets"
                        style={{ marginBottom: '16px', borderRadius: '8px' }}
                        bodyStyle={{ padding: '16px' }}
                    >
                        <Statistic
                            title="New Tickets"
                            value={newTickets}
                            style={{ textAlign: 'center' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                    <Card
                        title="Estimate Sent"
                        style={{ marginBottom: '16px', borderRadius: '8px' }}
                        bodyStyle={{ padding: '16px' }}
                    >
                        <Statistic
                            title="Estimate Sent"
                            value={estimate}
                            style={{ textAlign: 'center' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                    <Card
                        title="In Progress"
                        style={{ marginBottom: '16px', borderRadius: '8px' }}
                        bodyStyle={{ padding: '16px' }}
                    >
                        <Statistic
                            title="In Progress"
                            value={inprogress}
                            style={{ textAlign: 'center' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                    <Card
                        title="To Be Followed Up"
                        style={{ marginBottom: '16px', borderRadius: '8px' }}
                        bodyStyle={{ padding: '16px' }}
                    >
                        <Statistic
                            title="To Be Followed Up"
                            value={follwedup}
                            style={{ textAlign: 'center' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                    <Card
                        title="Purchased Order"
                        style={{ marginBottom: '16px', borderRadius: '8px' }}
                        bodyStyle={{ padding: '16px' }}
                    >
                        <Statistic
                            title="Purchased Order"
                            value={purchased}
                            style={{ textAlign: 'center' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                    <Card
                        title="Solved"
                        style={{ marginBottom: '16px', borderRadius: '8px' }}
                        bodyStyle={{ padding: '16px' }}
                    >
                        <Statistic
                            title="Solved"
                            value={solved}
                            style={{ textAlign: 'center' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                    <Card
                        title="Closed Tickets"
                        style={{ marginBottom: '16px', borderRadius: '8px' }}
                        bodyStyle={{ padding: '16px' }}
                    >
                        <Statistic
                            title="Closed Tickets"
                            value={closedTickets}
                            style={{ textAlign: 'center' }}
                        />
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <Card
                        title="Tickets by Priority"
                        style={{ marginBottom: '16px', borderRadius: '8px' }}
                        bodyStyle={{ padding: '16px' }}
                    >
                        <div style={{ height: '300px' }}>
                            <Bar data={priorityData} options={{
                                responsive: true,
                                plugins: {
                                    legend: { display: true },
                                    tooltip: { callbacks: { label: (context) => context.raw.toString() } }
                                }
                            }} />
                        </div>
                    </Card>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                    <Card
                        title="Tickets by Status"
                        style={{ marginBottom: '16px', borderRadius: '8px' }}
                        bodyStyle={{ padding: '16px' }}
                    >
                        <div style={{ height: '300px' }}>
                            <Bar data={statusData} options={{
                                responsive: true,
                                plugins: {
                                    legend: { display: true },
                                    tooltip: { callbacks: { label: (context) => `${context.label}: ${context.raw}` } }
                                }
                            }} />
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminDashboard;
