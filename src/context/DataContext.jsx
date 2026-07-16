import React, { createContext, useState, useContext, useEffect } from 'react';
import mockDataLocal from '../data/mockSchema.json';

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('sentinai_token');
        const response = await fetch('/api?route=dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const result = await response.json();
        
        if (result.success && Object.keys(result.data).length > 0) {
          // If any table in the DB is empty (which happens if it's not seeded yet),
          // fallback to local mock data for that specific table to prevent UI crashes.
          const mergedData = { ...mockDataLocal };
          for (const key in result.data) {
            if (result.data[key] && result.data[key].length > 0) {
              mergedData[key] = result.data[key];
            }
          }
          setData(mergedData);
        } else {
          setData(mockDataLocal);
        }
      } catch (err) {
        console.error("Error fetching live data, falling back to local:", err);
        setData(mockDataLocal);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ data, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
