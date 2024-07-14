import React, { useEffect, useState } from 'react';
import "react-datepicker/dist/react-datepicker.css";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Table, Input } from 'antd';
import axios from 'axios';
import moment from 'moment';

const Activities = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const primaryResponse = await axios.get('https://wd79p.com/backend/public/api/activities');
        setData(primaryResponse.data.reverse());
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "User Id",
      dataIndex: "user_id",
      sorter: (a, b) => a.user_id - b.user_id,
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
      title: "Subject Type",
      dataIndex: "subject_type",
      render: (text) => {
        const parts = text.split('\\');
        return parts[parts.length - 1];
      }
    },
    {
      title: "Date",
      dataIndex: "created_at",
      sorter: (a, b) => moment(a.created_at).unix() - moment(b.created_at).unix(),
      render: (text) => moment(text).format('MMMM DD, YYYY [at] h:mma')
    },
  ];

  // Filter data based on exact search term match
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;
