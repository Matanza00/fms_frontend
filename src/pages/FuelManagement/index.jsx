import React, { useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { Link } from 'react-router-dom';
import { IoMdAddCircle } from 'react-icons/io';
import FuelApprovalTable from './FuelApprovalTable';
import { useSelector } from 'react-redux';
import { FaSearch, FaFileExport } from 'react-icons/fa';
import { MdDownload, MdOutlineCloudUpload } from 'react-icons/md';
import { exportToPDF } from '../../components/ExportPDFCSV/ExportPDFCSV';
import { SiMicrosoftexcel } from 'react-icons/si';
import { FaChartSimple } from 'react-icons/fa6';
import ExcelJS from 'exceljs';
import ReactDOM from 'react-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useGetAllFuelQuery } from '../../services/fuelSlice';

const FuelManagement = () => {
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [companyId, setCompanyId] = useState(25); // State to store company ID
  const [status, setStatus] = useState(''); // State to store the selected status
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isReportsModalVisible, setIsReportsModalVisible] = useState(false); // State for Reports modal
  const [fileUploaded, setFileUploaded] = useState(false); // State to track if file is uploaded
  const [uploadedFileName, setUploadedFileName] = useState(''); // State to store uploaded file name
  const [selectedFile, setSelectedFile] = useState(null);
  const [sortedData, setSortedData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const { data: fuelData, error, isLoading } = useGetAllFuelQuery(companyId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  const handleStatusChange = (e) => {
    setStatus(e);
  };

  const exportPDF = (data) => {
    const columnsToFilter = [
      'id',
      'registrationNo',
      'driverName',
      'gbmsNo',
      'previousOddometerReading',
      'currentOddometerReading',
      'fuelAverage',
      'requestType',
      'rateOfFuel',
      'quantityOfFuel',
      'amount',
      'modeOfFueling',
      'cardNo',
      'fuelType',
      'station',
      'status',
      'created_at',
    ];
    const columnsToPrint = [
      'Request ID',
      'Vehicle No.',
      'Driver',
      'GMBS No.',
      'Prev Odo Reading',
      'Curr Odo Reading',
      'Prev Travel F.Avg',
      'Request Type',
      'Rate',
      'Litres',
      'Amount',
      'Fueling Mode',
      'Card Number',
      'Fuel Type',
      'Station',
      'Status',
      'Created At',
    ];
    exportToPDF(data, columnsToFilter, columnsToPrint, 'Fuel Requests');
  };

  const exportToCsv = (data) => {
    if (data.length === 0) {
      console.error('No data provided.');
      return;
    }

    const columnsToFilter = [
      'id',
      'registrationNo',
      'driverName',
      'gbmsNo',
      'previousOddometerReading',
      'currentOddometerReading',
      'fuelAverage',
      'requestType',
      'rateOfFuel',
      'quantityOfFuel',
      'amount',
      'modeOfFueling',
      'cardNo',
      'fuelType',
      'station',
      'status',
      'created_at',
    ];

    const columnsToPrint = [
      'Request ID',
      'Vehicle No.',
      'Driver',
      'GBMS No',
      'Prev Odo Reading',
      'Curr Odo Reading',
      'Prev Travel F.Avg',
      'Request Type',
      'Rate',
      'Litres',
      'Amount',
      'Fueling Mode',
      'Card Number',
      'Fuel Type',
      'Station',
      'Status',
      'Created At',
    ];

    const csvRows = [];
    const now = new Date();
    const formattedDate = now
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, ''); // Format as YYYY-MM-DD HH:MM:SS
    csvRows.push(`Downloaded on: ${formattedDate}`);
    csvRows.push(columnsToPrint.join(',')); // Header row

    const formatCreatedAt = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${day}-${month}-${year} ${hours}:${minutes}`;
    };

    data.forEach((obj) => {
      const values = columnsToFilter.map((key) => {
        let value = obj[key];
        if (key === 'created_at') {
          value = formatCreatedAt(value);
        }
        const escapedValue = ('' + value).replace(/"/g, '\\"');
        return `"${escapedValue}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, 'Fuel_Requests_Data.csv');
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'Fuel_Requests_Data.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error(
          'Your browser does not support downloading files. Please try another browser.',
        );
      }
    }
  };

  const handleFileSelect = (files) => {
    const file = files[0];
    setSelectedFile(file);
    setUploadedFileName(file.name);
    setFileUploaded(true);
  };

  const handleFileUpload = () => {
    if (!selectedFile) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event.target.result;
      const data = new Uint8Array(arrayBuffer);
      const binaryString = String.fromCharCode.apply(null, data);

      const workbook = read(binaryString, { type: 'binary' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = utils.sheet_to_json(worksheet);
      console.log(jsonData);

      setIsModalVisible(false);
      setFileUploaded(false);
      setUploadedFileName('');
      setSelectedFile(null);
    };

    reader.readAsArrayBuffer(selectedFile);
  };

  const exportFuelCardReport = async (data) => {
    console.log('Data from exportFuelCardReport ', data);
    if (!data || data.length === 0) {
      console.error('No data available for export.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Fuel Data');

    const columns = [
      { header: 'S.No', key: 'sno', width: 10 },
      { header: 'Station', key: 'station', width: 20 },
      { header: 'Mode Of Fueling', key: 'modeOfFueling', width: 20 },
      { header: 'Card Number', key: 'cardNo', width: 20 },
      { header: 'Registration Number', key: 'registrationNo', width: 20 },
      { header: 'Fuel Type', key: 'fuelType', width: 15 },
    ];
    // Style header row

    worksheet.columns = columns;
    // Freeze the first row
    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    const sortedData = data
      .filter((item) => item.station)
      .sort((a, b) => a.station.localeCompare(b.station));

    let currentStation = '';
    let serialNumber = 1; // Initialize serial number
    sortedData.forEach((item) => {
      if (item.station !== currentStation) {
        if (currentStation !== '') {
          worksheet.addRow([]);
        }
        currentStation = item.station;
        serialNumber = 1; // Reset serial number for each station
        const stationRow = worksheet.addRow([`Station: ${currentStation}`]);
        stationRow.font = { bold: true };
        const headerRow = worksheet.addRow(columns.map((col) => col.header));
        headerRow.font = { bold: true, size: 16, color: { argb: 'FFFFFF' } };
        headerRow.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF00' },
          };
          cell.font = { bold: true, size: 14 };
        });
      }
      worksheet.addRow({
        sno: serialNumber++, // Increment serial number
        station: item.station,
        modeOfFueling: item.modeOfFueling,
        cardNo: item.cardNo,
        registrationNo: item.registrationNo,
        fuelType: item.fuelType,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Fuel_Card_Tagging_Report.xlsx';
    link.click();
  };

  const exportDailyVehicleFuelingReport = async (data) => {
    if (!data || data.length === 0) {
      console.error('No data available for export.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Daily Vehicle Fueling Report');

    const columns = [
      { header: 'S.No', key: 'serialNo', width: 7 },
      { header: 'Req ID', key: 'id', width: 10 },
      { header: 'Station', key: 'station', width: 10 },
      { header: 'Vehicle', key: 'registrationNo', width: 13 },
      { header: 'Card Number', key: 'cardNo', width: 20 },
      { header: 'Type', key: 'modeOfFueling', width: 10 },
      { header: 'Created At', key: 'created_at', width: 20 },
      { header: 'Amount', key: 'amount', width: 15 },
      { header: 'Prev. Litre', key: 'quantityOfFuel', width: 10 },
      { header: 'Rate of Fuel', key: 'rateOfFuel', width: 15 },
      {
        header: 'Current Oddo',
        key: 'currentOddometerReading',
        width: 25,
      },
      {
        header: 'Previous Oddo',
        key: 'previousOddometerReading',
        width: 25,
      },
      { header: 'Mileage', key: 'mileage', width: 10 },
      { header: 'Average', key: 'fuelAverage', width: 10 },
      { header: 'Category', key: 'category', width: 10 },
    ];

    worksheet.columns = columns;

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, size: 14, color: { argb: 'FFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4F81BD' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day}, ${hours}:${minutes}:${seconds}`;
    };

    data.forEach((item, index) => {
      const mileage =
        item.currentOddometerReading - item.previousOddometerReading;
      const fuelAverage = mileage / item.previousFuelQuantity;
      let category = '';
      if (fuelAverage >= 9) {
        category = 'A';
      } else if (fuelAverage < 9 && fuelAverage >= 7) {
        category = 'B';
      } else if (fuelAverage < 7) {
        category = 'C';
      }
      const row = worksheet.addRow({
        serialNo: index + 1,
        id: item.id,
        station: item.station,
        registrationNo: item.registrationNo,
        cardNo: item.cardNo,
        created_at: formatDate(item.created_at),
        amount: item.amount,
        quantityOfFuel: item.previousFuelQuantity,
        rateOfFuel: item.rateOfFuel,
        modeOfFueling: item.modeOfFueling,
        currentOddometerReading: item.currentOddometerReading,
        previousOddometerReading: item.previousOddometerReading,
        mileage: mileage,
        fuelAverage: fuelAverage,
        category: category,
      });

      const categoryCell = row.getCell('category');
      if (category === 'A') {
        categoryCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF0000FF' },
        };
      } else if (category === 'B') {
        categoryCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF00' },
        };
      } else if (category === 'C') {
        categoryCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF0000' },
        };
      }
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Daily_Vehicle_Fueling_Report.xlsx';
    link.click();
  };

  const exportDailyOilComparisonReport = async (data) => {
    // need to change this
    const filteredData = data.filter((obj) => {
      const createdAt = new Date(obj.created_at);
      if (startDate && createdAt < startDate) return false;
      if (endDate && createdAt > endDate) return false;
      return true;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Daily Oil Comparison Report');

    const columns = [
      { header: 'Station', key: 'station', width: 20 },
      { header: 'Region Wise Total', key: 'total', width: 15 },
    ];
    const start = new Date(startDate);
    const end = new Date(endDate);
    const dateRange = [];

    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      const dateString = formatDate(d);
      columns.push({ header: dateString, key: dateString, width: 15 });
      dateRange.push(dateString);
    }

    worksheet.columns = columns;

    const groupedData = {};
    filteredData.forEach((obj) => {
      const date = formatDate(obj.created_at);
      const key = obj.station;
      if (!groupedData[key]) {
        groupedData[key] = { station: obj.station, total: 0 };
        dateRange.forEach((date) => {
          groupedData[key][date] = 0;
        });
      }
      groupedData[key][date] += parseFloat(obj.amount);
      groupedData[key].total += parseFloat(obj.amount);
    });

    Object.keys(groupedData).forEach((key) => {
      worksheet.addRow(groupedData[key]);
    });

    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCCCFF' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    const columnSums = { station: 'Date Wise Total' };
    dateRange.forEach((date) => {
      let columnSum = 0;
      Object.keys(groupedData).forEach((key) => {
        columnSum += groupedData[key][date];
      });
      columnSums[date] = columnSum;
    });
    columnSums.total = Object.keys(groupedData).reduce(
      (sum, key) => sum + groupedData[key].total,
      0,
    );

    worksheet.addRow(columnSums);

    worksheet.getRow(worksheet.lastRow.number).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF00' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Daily_Oil_Comparison_Report.xlsx';
    link.click();
  };

  const exportCategoryWiseAverage = async (data) => {
    try {
      if (!data || data.length === 0) {
        console.error('No data available for export.');
        return;
      }

      console.log('Data received for export:', data);

      const groupedData = data.reduce((acc, item) => {
        if (!acc[item.station]) {
          acc[item.station] = {
            station: item.station,
            totalMileage: 0,
            totalQuantityOfFuel: 0,
          };
        }

        const mileage =
          item.currentOddometerReading - item.previousOddometerReading;

        acc[item.station].totalMileage += mileage;
        acc[item.station].totalQuantityOfFuel += parseInt(
          item.quantityOfFuel,
          10,
        );

        return acc;
      }, {});

      console.log('Grouped data:', groupedData);

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Category Wise Average');

      const columns = [
        { header: 'S.No', key: 'serialNo', width: 10 },
        { header: 'Station', key: 'station', width: 20 },
        { header: 'Total Mileage', key: 'totalMileage', width: 25 },
        { header: 'Total Litres', key: 'totalQuantityOfFuel', width: 25 },
        { header: 'Average', key: 'averageFuelAverage', width: 20 },
        { header: 'Category', key: 'category', width: 15 },
      ];

      worksheet.columns = columns;

      Object.values(groupedData).forEach((item, index) => {
        const averageFuelAverage =
          item.totalQuantityOfFuel !== 0
            ? item.totalMileage / item.totalQuantityOfFuel
            : 0;

        let category = '';
        let fillColor = '';

        if (averageFuelAverage < 7) {
          category = 'C';
          fillColor = 'FFFF0000';
        } else if (averageFuelAverage >= 7 && averageFuelAverage < 9) {
          category = 'B';
          fillColor = 'FFFFFF00';
        } else {
          category = 'A';
          fillColor = 'FF00FF00';
        }

        const row = worksheet.addRow({
          serialNo: index + 1,
          station: item.station,
          totalMileage: item.totalMileage,
          totalQuantityOfFuel: item.totalQuantityOfFuel,
          averageFuelAverage: averageFuelAverage.toFixed(2),
          category: category,
        });

        row.getCell('category').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: fillColor },
        };
      });

      worksheet.getRow(1).eachCell((cell) => {
        cell.font = { bold: true, size: 15 };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFCCCCFF' },
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      console.log('Worksheet rows added:', worksheet.rowCount);

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Category_Wise_Average.xlsx';
      link.click();

      console.log('File downloaded successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const exportMileageReport = async (data) => {
    if (!data || data.length === 0) {
      console.error('No data available for export.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Mileage Report');

    const columns = [
      { header: 'S.No', key: 'serialNo', width: 7 },
      { header: 'Req ID', key: 'id', width: 10 },
      { header: 'Card Number', key: 'cardNo', width: 20 },
      { header: 'Name on Card', key: 'registrationNo', width: 20 },
      { header: 'Type', key: 'modeOfFueling', width: 10 },
      { header: 'Fuel Qty', key: 'quantityOfFuel', width: 12 },
      { header: 'Mileage', key: 'mileage', width: 12 },
      { header: 'Average', key: 'fuelAverage', width: 12 },
      { header: 'Make', key: 'make', width: 12 },
      { header: 'Category', key: 'category', width: 10 },
    ];

    worksheet.columns = columns;

    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, size: 14, color: { argb: 'FFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4F81BD' },
    };
    headerRow.alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.views = [{ state: 'frozen', ySplit: 1 }];

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day}, ${hours}:${minutes}:${seconds}`;
    };

    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.station]) {
        acc[item.station] = [];
      }
      acc[item.station].push(item);
      return acc;
    }, {});

    Object.keys(groupedData).forEach((station) => {
      const stationData = groupedData[station];
      worksheet.addRow([]);
      worksheet.addRow([`Station: ${station}`]).font = { bold: true, size: 15 };
      const headerRow = worksheet.addRow(columns.map((col) => col.header));
      headerRow.eachCell((cell) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFF00' },
        };
        cell.font = { bold: true };
      });

      stationData.forEach((item, index) => {
        const mileage =
          item.currentOddometerReading - item.previousOddometerReading;
        const fuelAverage = mileage / item.quantityOfFuel;
        let category = '';
        if (fuelAverage >= 9) {
          category = 'A';
        } else if (fuelAverage < 9 && fuelAverage >= 7) {
          category = 'B';
        } else if (fuelAverage < 7) {
          category = 'C';
        }
        const row = worksheet.addRow({
          serialNo: index + 1,
          id: item.id,
          cardNo: item.cardNo,
          registrationNo: item.registrationNo,
          modeOfFueling: item.modeOfFueling,
          quantityOfFuel: item.quantityOfFuel,
          mileage: mileage,
          fuelAverage: fuelAverage,
          make: item.make,
          category: category,
        });

        const categoryCell = row.getCell('category');
        if (category === 'A') {
          categoryCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF00FF00' },
          };
        } else if (category === 'B') {
          categoryCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FF0000FF' },
          };
        } else if (category === 'C') {
          categoryCell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF0000' },
          };
        }
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Mileage_Report.xlsx';
    link.click();
  };

  console.log('Data of all fuel ', fuelData.data);

  console.log('Data of all fuel ', fuelData.data);
  // console.log("Sorted " , fuelData)

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Fuel Management" />
      <div className="flex justify-between mb-2">
        <div className="flex justify-between items-center">
          <div className="ml-7 mr-auto relative text-gray-600 w-90">
            <input
              className="rounded-full border border-slate-300 bg-white h-12 px-5 pr-16 text-md focus:outline-none focus:border-slate-400 w-full dark:border-slate-600 dark:bg-boxdark dark:text-slate-300 dark:focus:border-slate-400"
              type="text"
              name="search"
              placeholder="Search"
              value={searchTerm}
              onChange={handleSearch}
            />
            <button type="submit" className="absolute right-0 top-0 mt-4 mr-5">
              <FaSearch />
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex items-end gap-2">
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className=" btn h-[30px] min-h-[30px] text-sm border-slate-200 hover:bg-opacity-70 dark:text-white dark:bg-slate-700 dark:border-slate-700 dark:hover:bg-opacity-70 transition duration-150 ease-in-out rounded-md"
              >
                Export
                <MdDownload />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-slate-200 dark:text-white dark:bg-slate-700 dark:border-slate-700"
              >
                <li>
                  <button
                    className="flex justify-between items-center"
                    onClick={() => exportPDF(sortedData)}
                  >
                    Export as PDF
                    <FaFileExport />
                  </button>
                </li>
                <li>
                  <button
                    className="flex justify-between items-center"
                    onClick={() => exportToCsv(sortedData)}
                  >
                    Export as CSV
                    <FaFileExport />
                  </button>
                </li>
              </ul>
            </div>
            <button
              onClick={() => setIsReportsModalVisible(true)}
              className=" btn h-[30px] min-h-[30px] text-sm border-slate-200 hover:bg-opacity-70 dark:text-white dark:bg-slate-700 dark:border-slate-700 dark:hover:bg-opacity-70 transition duration-150 ease-in-out rounded-md"
            >
              Reports
            </button>
            <Link
              to="fuel-dashboard"
              className="btn h-[30px] min-h-[30px] text-sm border-slate-200 hover:bg-opacity-70 dark:text-white dark:bg-slate-700 dark:border-slate-700 dark:hover:bg-opacity-70 transition duration-150 ease-in-out rounded-md"
            >
              <span>
                <FaChartSimple />
              </span>
              Dashboard
            </Link>
            {user?.Role?.roleName === 'regionalAdmin' && (
              <Link
                to="form"
                className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary mx-2 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 lg:mx-2 lg:px-4"
              >
                <span>
                  <IoMdAddCircle />
                </span>
                Request Fuel
              </Link>
            )}
          </div>
        </div>
      </div>
      <FuelApprovalTable
        setSortedDataIndex={setSortedData}
        searchTerm={searchTerm}
        statusFilter={status?.value}
      />
      {isModalVisible && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-black opacity-50"></div>
          <div className="bg-white p-8 rounded-xl z-10 w-full max-w-3xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Import Excel File</h2>
              <button
                onClick={() => setIsModalVisible(false)}
                className="text-gray-600 hover:text-primary text-xl mr-1"
              >
                &times;
              </button>
            </div>
            <label
              htmlFor="fileInput"
              className="h-50 w-full border border-dashed border-gray-400 rounded-md p-10 text-center cursor-pointer flex flex-col justify-center items-center"
            >
              <input
                type="file"
                id="fileInput"
                accept=".xlsx, .xls, .csv"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
              {fileUploaded ? (
                <SiMicrosoftexcel className="h-15 w-15 text-green-700" />
              ) : (
                <div className="flex justify-center items-center">
                  <MdOutlineCloudUpload className="h-15 w-15" />
                </div>
              )}
              <br />
              {fileUploaded ? (
                <span>{uploadedFileName}</span>
              ) : (
                <span>Click here to upload Excel file</span>
              )}
            </label>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={() => setIsModalVisible(false)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-md border border-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={handleFileUpload}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
      {isReportsModalVisible &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-6 relative">
              <button
                className="hover:text-primary border px-2 py-0.5 rounded-full absolute top-0 right-0 mt-3 mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-500"
                onClick={() => setIsReportsModalVisible(false)}
              >
                &times;
              </button>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4">
                Reports
              </h2>
              <div className="mb-4 flex space-x-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300">
                    From:
                  </label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-boxdark dark:text-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 dark:text-gray-300">
                    To:
                  </label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-boxdark dark:text-gray-300"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-start space-x-2">
                <button
                  onClick={() => exportFuelCardReport(fuelData.data)}
                  className="mt-5 bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-opacity-90 flex items-center"
                >
                  Fuel Card Tagging Report
                  <SiMicrosoftexcel className="ml-2" />
                </button>
                <button
                  onClick={() => exportDailyVehicleFuelingReport(fuelData.data)}
                  className="mt-5 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-opacity-90 flex items-center"
                >
                  Daily Vehicle Fueling Report
                  <SiMicrosoftexcel className="ml-2" />
                </button>
                <button
                  onClick={() => exportDailyOilComparisonReport(fuelData.data)}
                  className="mt-5 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-opacity-90 flex items-center"
                >
                  Daily Oil Comparison Report
                  <SiMicrosoftexcel className="ml-2" />
                </button>
                <button
                  onClick={() => exportMileageReport(fuelData.data)}
                  className="mt-5 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-opacity-90 flex items-center"
                >
                  Mileage Report
                  <SiMicrosoftexcel className="ml-2" />
                </button>
                <button
                  onClick={() => exportCategoryWiseAverage(fuelData.data)}
                  className="mt-5 bg-slate-600 text-white px-4 py-2 rounded-md hover:bg-opacity-90 flex items-center"
                >
                  Category Wise Average
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </DefaultLayout>
  );
};

export default FuelManagement;
