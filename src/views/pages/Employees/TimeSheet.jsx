import React, { useState, useEffect } from 'react';
import {Button} from 'antd'
import axios from 'axios';
import './TimeSheet.css';

const TimeSheet = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchDate, setSearchDate] = useState('');


  const exportCSV = async () => {
    try {
      const response = await axios.get('https://wd79p.com/backend/public/api/timelogs/export', {
        responseType: 'blob',
      });
  

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'timelogs.csv'); 
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('Error exporting CSV:', error);
    }
  };

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get('https://wd79p.com/backend/public/api/attendance');
      const attendanceRecords = response.data.data;


      const attendanceWithUsers = await fetchUsersForAttendance(attendanceRecords);
      setAttendanceData(attendanceWithUsers);
      setFilteredData(attendanceWithUsers); 
      
      setLoading(false);
    } catch (err) {
      setError('Error fetching attendance data');
      setLoading(false);
    }
  };

  const fetchUsersForAttendance = async (attendanceRecords) => {
    return Promise.all(
      attendanceRecords.map(async (record) => {
        try {
          const userResponse = await axios.get(`https://wd79p.com/backend/public/api/users/${record.user_id}`);
          const { first_name, last_name } = userResponse.data;
          return {
            ...record,
            user: {
              ...record.user,
              first_name,
              last_name,
            },
          };
        } catch (error) {
          console.error('Error fetching user data:', error);
          return {
            ...record,
            user: {
              ...record.user,
              first_name: 'Unknown',
              last_name: 'User',
            },
          };
        }
      })
    );
  };

  const formatTime = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,  
    });
  };

  const formatDate = (datetime) => {
    const date = new Date(datetime);
    return date.toLocaleDateString('en-US', {
      timeZone: 'America/New_York',  
    });
  };


  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearchDate(searchValue);

    if (searchValue.trim() === '') {
      setFilteredData(attendanceData); 
    } else {
      const filtered = attendanceData.filter((record) => {
        const recordDate = formatDate(record.created_at);
        return recordDate.includes(searchValue); 
      });
      setFilteredData(filtered);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="page-wrapper" style={{ marginTop: '20px' }}>
      <h1>Time Sheet</h1>

      {/* Search Input */}
      <div style={{ marginBottom: '5px', marginLeft:'20px' }}>
        <input
          type="text"
          placeholder="Search by Date (MM/DD/YYYY)"
          value={searchDate}
          onChange={handleSearch}
          style={{
            padding: '8px',
            width: '300px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <Button onClick={exportCSV}>
        Export Time Logs
        </Button>
      </div>

      {filteredData.length > 0 ? (
        <table className="styled-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record) => (
              <tr key={record.id}>
                <td>{record.user.first_name} {record.user.last_name}</td>
                <td className="clock-in-time">{formatTime(record.clock_in)}</td>
                <td className="clock-out-time">{formatTime(record.clock_out)}</td>
                <td>{formatDate(record.created_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No attendance records found.</p>
      )}
    </div>
  );
};

export default TimeSheet;
