import React, { createContext, useState, useContext, useEffect } from 'react';

const ReportsContext = createContext();

const HARDCODED_REPORTS = [];

export const ReportsProvider = ({ children }) => {
  // Always start with hardcoded data so the UI is never empty
  const [reports, setReports] = useState(HARDCODED_REPORTS);
  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    try {
      const response = await fetch(`/api?t=${Date.now()}`);
      if (response.ok) {
        const data = await response.json();
        const fetched = data.data || [];
        setReports(fetched);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const addReport = async (reportData) => {
    const newReport = {
      id: reportData.reportId || reportData.id || 'REP-' + Date.now(),
      ...reportData,
      date: reportData.reportDate || reportData.date || new Date().toISOString()
    };
    setReports(prev => [...prev, newReport]);

    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData)
      });
      if (response.ok) {
        const data = await response.json();
        setReports(prev => prev.map(r => r.id === newReport.id ? { ...r, ...data.data } : r));
      }
    } catch (err) {
      console.error("Error adding report to API:", err);
    }
    return true;
  };

  const updateReportStatus = async (id, status) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    try {
      await fetch(`/api?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
    } catch (err) {
      console.error("Error updating report:", err);
    }
    return true;
  };

  const removeReport = async (id) => {
    setReports(prev => prev.filter(r => r.id !== id));
    try {
      await fetch(`/api?id=${id}`, {
        method: 'DELETE'
      });
    } catch (err) {
      console.error("Error removing report:", err);
    }
    return true;
  };

  return (
    <ReportsContext.Provider value={{ reports, setReports, loading, addReport, updateReportStatus, removeReport, refreshReports: fetchReports }}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => useContext(ReportsContext);
