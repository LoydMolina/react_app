import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../../../../AuthContext';
import useAutoClockOut from './useAutoClockOut';
import { Card } from 'antd';

const EmployeeDashboard = () => {
  const { authState } = useAuth();
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clockedInTime, setClockedInTime] = useState(null);
  const [attendanceLog, setAttendanceLog] = useState([]);
  const [fetchingLog, setFetchingLog] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;

  useAutoClockOut(authState.user_id, isClockedIn, setIsClockedIn, setClockedInTime); 

  useEffect(() => {
    const storedClockInStatus = localStorage.getItem('isClockedIn');
    const storedClockedInTime = localStorage.getItem('clockedInTime');

    if (storedClockInStatus === 'true') {
      setIsClockedIn(true);
      setClockedInTime(new Date(storedClockedInTime));
    }

    const fetchAttendanceLog = async () => {
      try {
        const response = await axios.get('https://wd79p.com/backend/public/api/attendance', {
          params: { user_id: authState.user_id },
        });

        const userId = Number(authState.user_id);
        const filteredLog = response.data.data.filter(entry => entry.user_id === userId);

        setAttendanceLog(filteredLog);
      } catch (err) {
        console.error('Error fetching attendance log:', err);
        setError('Failed to fetch attendance log. Please try again.');
      } finally {
        setFetchingLog(false);
      }
    };

    fetchAttendanceLog();
  }, [authState.user_id]);

  const handleClockIn = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://wd79p.com/backend/public/api/clock-in', {
        user_id: authState.user_id,
      });

      const currentTime = new Date();
      setIsClockedIn(true);
      setClockedInTime(currentTime);
      localStorage.setItem('isClockedIn', 'true');
      localStorage.setItem('clockedInTime', currentTime.toString());

      console.log('Clocked In:', response.data);
    } catch (err) {
      setError('Failed to clock in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('https://wd79p.com/backend/public/api/clock-out', {
        user_id: authState.user_id,
      });

      if (response.status === 200) {
        setIsClockedIn(false);
        setClockedInTime(null);
        localStorage.removeItem('isClockedIn');
        localStorage.removeItem('clockedInTime');
        console.log('Clocked Out:', response.data);
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (err) {
      console.error('Error during clock-out request:', err);
      setError('Failed to clock out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if ((currentPage + 1) * itemsPerPage < attendanceLog.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatTime = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className='page-wrapper' style={styles.pageWrapper}>
      <div className="col-xl-8 col-lg-7">
      <Card>
      <h2 style={styles.title}>Clock In/Out</h2>
      {error && <p style={styles.error}>{error}</p>}
      {loading && <p style={styles.loading}>Loading...</p>}
      {!loading && (
        <>
          <div style={styles.buttonContainer}>
            {isClockedIn ? (
              <>
                <p style={styles.info}>You clocked in at: {formatTime(clockedInTime)}</p>
                <button onClick={handleClockOut} style={styles.buttonOut}>Clock Out</button>
              </>
            ) : (
              <button onClick={handleClockIn} style={styles.buttonIn}>Clock In</button>
            )}
          </div>

          {fetchingLog ? (
            <p style={styles.loading}>Fetching attendance log...</p>
          ) : (
            <div style={styles.tableContainer}>
              <h3 style={styles.logTitle}>Attendance Log</h3>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Date</th>
                    <th style={styles.tableHeader}>Clock In</th>
                    <th style={styles.tableHeader}>Clock Out</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceLog.length > 0 ? (
                    attendanceLog
                      .sort((a, b) => new Date(b.clock_in) - new Date(a.clock_in))
                      .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage)
                      .map((entry) => (
                        <tr key={entry.id}>
                          <td style={styles.tableCell}>{new Date(entry.clock_in).toLocaleDateString()}</td>
                          <td style={styles.tableCell}>{formatTime(entry.clock_in)}</td>
                          <td style={styles.tableCell}>{entry.clock_out ? formatTime(entry.clock_out) : 'N/A'}</td>
                        </tr>
                      ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={styles.tableCell}>No records found</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div style={styles.paginationContainer}>
                <button onClick={prevPage} style={styles.paginationButton} disabled={currentPage === 0}>
                  Previous
                </button>
                <button onClick={nextPage} style={styles.paginationButton} disabled={(currentPage + 1) * itemsPerPage >= attendanceLog.length}>
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
      </Card>
      </div>
    </div>
  );
};

const styles = {
  pageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f4f4',
    padding: '20px',
    marginRight:'25px'
  },
  title: {
    fontSize: '24px',
    color: '#333',
    marginBottom: '20px',
    textAlign: 'center', 
  },
  error: {
    color: 'red',
    marginBottom: '20px',
  },
  loading: {
    fontSize: '18px',
    color: '#555',
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  info: {
    fontSize: '18px',
    color: '#555',
    marginBottom: '10px',
  },
  buttonIn: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#4CAF50',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonOut: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#f44336',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  tableContainer: {
    marginTop: '20px',
    width: '100%',
    maxWidth: '800px',
    marginLeft: 'auto',  
    marginRight: 'auto', 
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#ddd',
    padding: '10px',
    borderBottom: '2px solid #ddd',
    textAlign: 'center', 
  },
  tableCell: {
    padding: '10px',
    borderBottom: '1px solid #ddd',
    textAlign: 'center',
  },
  logTitle: {
    fontSize: '20px',
    color: '#333',
    marginBottom: '10px',
  },
  paginationContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  paginationButton: {
    padding: '10px 20px',
    fontSize: '16px',
    color: '#fff',
    backgroundColor: '#FE7B4D',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    marginRight: '10px',
  },
};

export default EmployeeDashboard;
