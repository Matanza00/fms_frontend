import jsPDF from 'jspdf';
import 'jspdf-autotable';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}`;
};

export const exportToPDF = (data, toFilter, toPrint, name) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.error('No data provided.');
    return;
  }

  const headers = toPrint.map(
    (key) => key.charAt(0).toUpperCase() + key.slice(1),
  ); // Capitalize the first letter of each header

  const filteredData = data.map((obj) => {
    const filteredObj = {};
    toFilter.forEach((key) => {
      if (key === 'created_at') {
        filteredObj[key] = formatDate(obj[key]);
      } else if (
        key === 'vehicle' &&
        name === 'Periodic Maintenance Requests'
      ) {
        filteredObj.station = obj[key]?.station;
      } else {
        filteredObj[key] = obj[key];
      }
    });
    return filteredObj;
  });

  // Create a new jsPDF instance in landscape mode
  const doc = new jsPDF('landscape');

  // Add download date and time
  const downloadDateTime = new Date();
  const formattedDateTime = `${downloadDateTime.toLocaleDateString()} ${downloadDateTime.toLocaleTimeString()}`;
  doc.setFontSize(10);
  doc.text(`Downloaded on: ${formattedDateTime}`, 14, 10);

  // Add header
  doc.setFontSize(14);
  doc.text(`${name} Data`, 14, 20);

  // AutoTable plugin options
  const options = {
    startY: 30,
    headStyles: { fillColor: [46, 204, 113], textColor: 255 },
    bodyStyles: { textColor: 0 },
    columnStyles: { id: { fillColor: [46, 204, 113] } }, // Add specific styles for columns if needed
    head: [headers],
    body: filteredData.map((obj) =>
      toFilter.map((key) => {
        if (key === 'vehicle' && name === 'Periodic Maintenance Requests') {
          return obj.station;
        } else {
          return obj[key];
        }
      }),
    ),
  };

  // Add auto-generated table
  doc.autoTable(options);

  // Save the PDF
  doc.save(`${name}_data.pdf`);
};
