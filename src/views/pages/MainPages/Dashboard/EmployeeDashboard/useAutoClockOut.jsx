import { useEffect } from 'react';
import axios from 'axios';

const useAutoClockOut = (userId, isClockedIn, setIsClockedIn, setClockedInTime) => {
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === 'authToken' && event.oldValue && !event.newValue && isClockedIn) {
        clockOut();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isClockedIn]);

  const clockOut = async () => {
    try {
      const response = await axios.post('https://wd79p.com/backend/public/api/clock-out', {
        user_id: userId,
      });

      if (response.status === 200) {
        setIsClockedIn(false);
        setClockedInTime(null);
        localStorage.removeItem('isClockedIn');
        localStorage.removeItem('clockedInTime');
        console.log('Clocked Out:', response.data);
      }
    } catch (err) {
      console.error('Error during clock-out request:', err);
    }
  };
};

export default useAutoClockOut;
