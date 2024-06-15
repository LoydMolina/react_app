import React, { useEffect, useState } from 'react'
import "react-datepicker/dist/react-datepicker.css";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import { Table } from 'antd';
import axios from 'axios';
import moment from 'moment';

const Activities = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const primaryResponse = await axios.get('https://wd79p.com/backend/public/api/activities');
      setData(primaryResponse.data);
    };

    fetchData();
  }, []);

  const column = [
    {
      title: "Id",
      dataIndex: "id",
      sorter: (a, b) => a.id.length - b.id.length,
    },
    {
      title: "User Id",
      dataIndex: "user_id",
      sorter: (a, b) => a.userId.length - b.userId.length,
    },
    {
      title: "Subject Id",
      dataIndex: "subject_id",
      sorter: (a, b) => a.subjectId.length - b.subjectId.length,
    },
    {
      title: "Action",
      dataIndex: "action",
      sorter: (a, b) => a.action.length - b.action.length,
    },
    {
      title: "Subject Type",
      dataIndex: "subject_type",
      sorter: (a, b) => a.subject_type.length - b.subject_type.length,
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

  ]

  return (
    <>
          <div className="page-wrapper">
        {/* Page Content */}
        <div className="content container-fluid">
          {/* Page Header */}
          <Breadcrumbs
            maintitle="Activities"
            title="Dashboard"
            subtitle="Activities"
            // modal="#add_ticket"
            // name="Add Ticket"
          />
          <div className="row">
            <div className="col-md-12">
              <div className="table-responsive">
                <Table
                  className="table-striped"
                  rowKey={(record) => record.id}
                  style={{ overflowX: "auto" }}
                  columns={column}
                  dataSource={data}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
};

export default Activities;
