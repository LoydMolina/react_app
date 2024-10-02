import React, { useEffect, useState } from 'react';
import { Table, Input } from 'antd';
import axios from 'axios';
import moment from 'moment';
import "react-datepicker/dist/react-datepicker.css";
import Breadcrumbs from "../../../../components/Breadcrumbs";

const Activities = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [activitiesResponse, usersResponse] = await Promise.all([
          axios.get('https://wd79p.com/backend/public/api/activities'),
          axios.get('https://wd79p.com/backend/public/api/users')
        ]);

        const userMap = {};
        usersResponse.data.forEach(user => {
          userMap[user.user_id] = `${user.first_name} ${user.last_name}`;
        });

        setUsers(userMap);
        setData(activitiesResponse.data.reverse());
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "user_id",
      render: (user_id) => users[user_id] || 'Unknown User',
      sorter: (a, b) => (users[a.user_id] || '').localeCompare(users[b.user_id] || ''),
    },
    {
      title: "Subject Type",
      dataIndex: "subject_type",
      render: (text) => {
        const parts = text.split('\\');
        return parts[parts.length - 1];
      }
    },
    {
      title: "Subject Id",
      dataIndex: "subject_id",
      sorter: (a, b) => a.subject_id - b.subject_id,
    },
    {
      title: "Action",
      dataIndex: "action",
    },
    {
      title: "Date",
      dataIndex: "created_at",
      sorter: (a, b) => moment(a.created_at).unix() - moment(b.created_at).unix(),
      render: (text) => moment(text).format('MMMM DD, YYYY [at] h:mma')
    },
  ];

  const filteredData = data.filter(item =>
    item.subject_id.toString() === searchTerm.trim()
  );

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Activities"
          title="Dashboard"
          subtitle="Activities"
        />
        <div className="row">
          <div className="col-md-12">
            <Input
              placeholder="Search Subject Id"
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ marginBottom: 10, width: 200 }}
            />
            <div className="table-responsive">
              <Table
                className="table-striped"
                rowKey={(record) => record.id}
                columns={columns}
                dataSource={searchTerm ? filteredData : data}
                loading={loading}
                pagination={{ pageSize: 10 }} 
                locale={{ emptyText: "No activities found" }} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;
