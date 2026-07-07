export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || !data.length) {
    alert("No data available to export.");
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Convert objects to CSV string
  const csvRows = [];
  csvRows.push(headers.join(',')); // Header row
  
  for (const row of data) {
    const values = headers.map(header => {
      const val = row[header] !== null && row[header] !== undefined ? row[header] : '';
      const stringVal = String(val).replace(/"/g, '""'); // Escape quotes
      return `"${stringVal}"`; // Wrap in quotes to handle commas
    });
    csvRows.push(values.join(','));
  }
  
  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  
  // Create download link
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
