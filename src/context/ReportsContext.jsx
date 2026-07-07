import React, { createContext, useState, useContext } from 'react';

const ReportsContext = createContext();

const initialReports = [
  { id: 'REP-2026-894', title: 'Cyber Fraud at MG Road', category: 'Cyber Crime', date: '2026-05-18T14:30:00Z', priority: 'High', status: 'In Progress', reporter: 'Ramesh Singh', assigned: 'Insp. Vikram' },
  { id: 'REP-2026-893', title: 'Vehicle Theft - Honda City', category: 'Theft', date: '2026-05-18T09:15:00Z', priority: 'Medium', status: 'Pending', reporter: 'Anita Kumar', assigned: 'Sub Insp. Sharma' },
  { id: 'REP-2026-892', title: 'Domestic Violence Complaint', category: 'Assault', date: '2026-05-17T22:45:00Z', priority: 'Critical', status: 'Resolved', reporter: 'Anonymous', assigned: 'Insp. Meena' },
  { id: 'REP-2026-891', title: 'Chain Snatching Incident', category: 'Robbery', date: '2026-05-17T18:20:00Z', priority: 'High', status: 'In Progress', reporter: 'Priya Desai', assigned: 'Sub Insp. Verma' },
  { id: 'REP-2026-890', title: 'Vandalism at Central Park', category: 'Others', date: '2026-05-16T11:10:00Z', priority: 'Low', status: 'Resolved', reporter: 'Park Authority', assigned: 'Constable Yadav' },
  { id: 'REP-2026-889', title: 'Phishing Scam Report', category: 'Cyber Crime', date: '2026-05-16T08:00:00Z', priority: 'Medium', status: 'Pending Approval', reporter: 'Deepak Jain', assigned: 'Cyber Cell' },
  { id: 'REP-2026-888', title: 'Hit and Run near Highway', category: 'Traffic', date: '2026-05-15T23:30:00Z', priority: 'Critical', status: 'In Progress', reporter: 'Traffic Cam 42', assigned: 'Traffic Div' },
  { id: 'REP-2026-887', title: 'Shoplifting at Mall', category: 'Theft', date: '2026-05-15T15:45:00Z', priority: 'Low', status: 'Closed', reporter: 'Mall Security', assigned: 'Sub Insp. Sharma' },
];

export const ReportsProvider = ({ children }) => {
  const [reports, setReports] = useState(initialReports);

  return (
    <ReportsContext.Provider value={{ reports, setReports }}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => useContext(ReportsContext);
