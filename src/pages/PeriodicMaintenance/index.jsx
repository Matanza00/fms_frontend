import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import PeriodicApprovalTable from './PeriodicApprovalTable';
import { FaSearch } from 'react-icons/fa';
import { IoMdAddCircle } from 'react-icons/io';
import { FaChartSimple, FaFileExport } from 'react-icons/fa6';
import { exportToPDF } from '../../components/ExportPDFCSV/ExportPDFCSV';
import { MdDownload } from 'react-icons/md';
import ReactDOM from 'react-dom';
import ExcelJS from 'exceljs';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { useGetAllPeriodicMaintenanceQuery } from '../../services/periodicSlice';

const PeriodicMaintenance = () => {
  const { user } = useSelector((state) => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortedData, setSortedData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  let adminRole = user?.Role?.roleName === 'companyAdmin';
  let showButton = user?.Role?.roleName === 'regionalAdmin';

  const {
    data: vehicle,
    error,
    isLoading,
  } = useGetAllPeriodicMaintenanceQuery();

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  const exportPDF = (data) => {
    const columnsToFilter = [
      'registrationNo',
      'periodicType.job', // Accessing the nested property
      'runningDifference',
      'dueStatus',
      'amount',
      'vehicle',
      'station',
      'status',
    ];
    const columnsToPrint = [
      'Vehicle No.',
      'Periodic Type',
      'Running Difference',
      'Due Status',
      'Amount',
      'Station',
      'Status',
    ];

    // Transform the data to extract the nested property
    const transformedData = data.map((obj) => ({
      ...obj,
      'periodicType.job': obj.periodicType?.job,
    }));

    exportToPDF(
      transformedData,
      columnsToFilter,
      columnsToPrint,
      'Periodic Maintenance Requests',
    );
  };

  const exportToCsv = (data) => {
    if (data.length === 0) {
      console.error('No data provided.');
      return;
    }

    const columnsToFilter = [
      'registrationNo',
      'periodicType.job', // Accessing the nested property
      'runningDifference',
      'dueStatus',
      'amount',
      'vehicle',
      'station',
      'status',
    ];

    const columnsToPrint = [
      'Vehicle No.',
      'Periodic Type',
      'Running Difference',
      'Due Status',
      'Amount',
      'Station',
      'Status',
    ];

    const csvRows = [];

    // Get the current date and time
    const now = new Date();
    const formattedDate = now
      .toISOString()
      .replace(/T/, ' ')
      .replace(/\..+/, ''); // Format as YYYY-MM-DD HH:MM:SS

    // Add date and time as the first row
    csvRows.push(`Downloaded on: ${formattedDate}`);
    csvRows.push(columnsToPrint.join(',')); // Header row

    // Transform the data to extract the nested property
    const transformedData = data.map((obj) => ({
      ...obj,
      'periodicType.job': obj.periodicType?.job,
    }));

    transformedData.forEach((obj) => {
      const values = columnsToFilter.map((key) => {
        const keys = key.split('.');
        const value = keys.reduce((acc, curr) => acc?.[curr], obj);
        const escapedValue = ('' + value).replace(/"/g, '\\"');
        return `"${escapedValue}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, 'Periodic_Maintenance_data.csv');
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // feature detection
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'Periodic_Maintenance_data.csv');
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

  const exportToExcel = (data) => {
    const filteredData = data.filter((obj) => {
      const createdAt = new Date(obj.created_at);
      if (startDate && createdAt < startDate) return false;
      if (endDate && createdAt > endDate) return false;
      return true;
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Daily Periodic Report');

    // Define the header row
    worksheet.columns = [
      { header: 'Serial No.', key: 'serial', width: 10 },
      { header: 'Month', key: 'month', width: 15 },
      { header: 'Created At', key: 'created_at', width: 20 },
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Station', key: 'station', width: 15 },
      { header: 'Registration No.', key: 'registrationNo', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Completion Date', key: 'completionDate', width: 15 },
      { header: 'Job', key: 'job', width: 20 },
      { header: 'Running Difference', key: 'runningDifference', width: 20 },
      { header: 'Amount', key: 'amount', width: 15 },
    ];

    // Add a row for each item in the data array
    filteredData.forEach((obj, index) => {
      const createdAt = new Date(obj.created_at);
      const completionDate = obj.completionDate ? new Date(obj.completionDate) : null;
      const month = createdAt.toLocaleString('default', { month: 'long' });
      const year = createdAt.getFullYear();
      const row = worksheet.addRow({
        serial: index + 1,
        month: `${month} ${year}`,
        created_at: createdAt,
        id: obj.id,
        station: obj.station,
        registrationNo: obj.registrationNo,
        status: obj.status,
        completionDate: completionDate,
        job: obj.periodicType?.job,
        runningDifference: obj.runningDifference,
        amount: obj.amount,
      });

      // Color the "Completion Date" cell if data is present
      if (completionDate) {
        row.getCell('completionDate').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFCCFFCC' }, // Light green color
        };
      }
    });

    // Define colors for different months
    const monthColors = {
      January: 'FFCCCCFF',
      February: 'FFCCFFFF',
      March: 'FFCCFFCC',
      April: 'FFFFFFCC',
      May: 'FFFFCCCC',
      June: 'FFFFCCFF',
      July: 'FFCCFFFF',
      August: 'FFCCFF99',
      September: 'FFFF99CC',
      October: 'FFCC99FF',
      November: 'FF99FFCC',
      December: 'FF99CCFF',
    };

    // Apply colors to "Month" column
    worksheet.getColumn('month').eachCell((cell, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
      const monthName = cell.value.split(' ')[0];
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: monthColors[monthName] },
      };
    });

    // Style the header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCCCFF' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Format the "Created At" and "Completion Date" columns
    worksheet.getColumn('created_at').numFmt = 'dd-mm-yyyy';
    worksheet.getColumn('completionDate').numFmt = 'dd-mm-yyyy';

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Daily_Periodic_Report.xlsx';
      link.click();
    });
  };

  const exportCustomToExcel = (data) => {
    const filteredData = data.filter((obj) => {
      const createdAt = new Date(obj.created_at);
      if (startDate && createdAt < startDate) return false;
      if (endDate && createdAt > endDate) return false;
      return obj.status === 'completed';
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Completed Status Periodic Report');

    // Define the header row
    worksheet.columns = [
      { header: 'Serial No.', key: 'serial', width: 10 },
      { header: 'Month', key: 'month', width: 15 },
      { header: 'Created At', key: 'created_at', width: 20 },
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Station', key: 'station', width: 15 },
      { header: 'Registration No.', key: 'registrationNo', width: 20 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Completion Date', key: 'completionDate', width: 15 },
      { header: 'Job', key: 'job', width: 20 },
      { header: 'Running Difference', key: 'runningDifference', width: 20 },
      { header: 'Amount', key: 'amount', width: 15 },
    ];

    // Add a row for each item in the data array
    filteredData.forEach((obj, index) => {
      const createdAt = new Date(obj.created_at);
      const completionDate = obj.completionDate ? new Date(obj.completionDate) : null;
      const month = createdAt.toLocaleString('default', { month: 'long' });
      const year = createdAt.getFullYear();
      const row = worksheet.addRow({
        serial: index + 1,
        month: `${month} ${year}`,
        created_at: createdAt,
        id: obj.id,
        station: obj.station,
        registrationNo: obj.registrationNo,
        status: obj.status,
        completionDate: completionDate,
        job: obj.periodicType?.job,
        runningDifference: obj.runningDifference,
        amount: obj.amount,
      });

      // Color the "Completion Date" cell if data is present
      if (completionDate) {
        row.getCell('completionDate').fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFCCFFCC' }, // Light green color
        };
      }
    });

    // Define colors for different months
    const monthColors = {
      January: 'FFCCCCFF',
      February: 'FFCCFFFF',
      March: 'FFCCFFCC',
      April: 'FFFFFFCC',
      May: 'FFFFCCCC',
      June: 'FFFFCCFF',
      July: 'FFCCFFFF',
      August: 'FFCCFF99',
      September: 'FFFF99CC',
      October: 'FFCC99FF',
      November: 'FF99FFCC',
      December: 'FF99CCFF',
    };

    // Apply colors to "Month" column
    worksheet.getColumn('month').eachCell((cell, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row
      const monthName = cell.value.split(' ')[0];
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: monthColors[monthName] },
      };
    });

    // Style the header row
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFCCCCFF' },
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
    });

    // Format the "Created At" and "Completion Date" columns
    worksheet.getColumn('created_at').numFmt = 'dd-mm-yyyy';
    worksheet.getColumn('completionDate').numFmt = 'dd-mm-yyyy';

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'Completed_Status_Periodic_Report.xlsx';
      link.click();
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Periodic Maintenance" />

      <div className="flex justify-between">
        <div className="flex items-center mb-2"></div>

        <div className="ml-7 mr-auto pt-2 relative text-gray-600 w-90">
          <input
            className="rounded-full border border-slate-300 bg-white h-12 px-5 pr-16 text-md focus:outline-none focus:border-slate-400 w-full dark:border-slate-600 dark:bg-boxdark dark:text-slate-300 dark:focus:border-slate-400"
            type="text"
            name="search"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button type="submit" className="absolute right-0 top-0 mt-5 mr-5">
            <FaSearch />
          </button>
        </div>

        <div className="flex justify-between">
          <div className="flex items-end gap-2">
            <Link
              to="reports"
              className="btn h-[30px] min-h-[30px] text-sm border-slate-200 hover:bg-opacity-70 dark:text-white dark:bg-slate-700 dark:border-slate-700 dark:hover:bg-opacity-70 transition duration-150 ease-in-out rounded-md"
            >
              <span className="text-sm">Status</span>
            </Link>
            <button
              onClick={openModal}
              className="btn h-[30px] min-h-[30px] text-sm border-slate-200 hover:bg-opacity-70 dark:text-white dark:bg-slate-700 dark:border-slate-700 dark:hover:bg-opacity-70 transition duration-150 ease-in-out rounded-md"
            >
              <span className="text-sm">Reports</span>
            </button>
            {adminRole && (
              <Link
                to="parameters"
                className="btn h-[30px] min-h-[30px] text-sm border-slate-200 hover:bg-opacity-70 dark:text-white dark:bg-slate-700 dark:border-slate-700 dark:hover:bg-opacity-70 transition duration-150 ease-in-out rounded-md"
              >
                <span className="text-sm">Parameters</span>
              </Link>
            )}
            <Link
              to="dashboard"
              className="btn h-[30px] min-h-[30px] text-sm border-slate-200 hover:bg-opacity-70 dark:text-white dark:bg-slate-700 dark:border-slate-700 dark:hover:bg-opacity-70 transition duration-150 ease-in-out rounded-md"
            >
              <FaChartSimple />
              Dashboard
            </Link>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="mr-2 btn h-[30px] min-h-[30px] text-sm border-slate-200 hover:bg-opacity-70 dark:text-white dark:bg-slate-700 dark:border-slate-700 dark:hover:bg-opacity-70 transition duration-150 ease-in-out rounded-md"
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
                    onClick={() => exportPDF(vehicle.data)}
                  >
                    Export as PDF
                    <FaFileExport />
                  </button>
                </li>
                <li>
                  <button
                    className="flex justify-between items-center"
                    onClick={() => exportToCsv(vehicle.data)}
                  >
                    Export as CSV
                    <FaFileExport />
                  </button>
                </li>
              </ul>
            </div>

            {showButton && (
              <Link
                to="form"
                className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary mx-2 py-2 px-2.5 text-center font-medium text-white hover:bg-opacity-90 lg:mx-2 lg:px-3"
              >
                <IoMdAddCircle size={18} />
                <span className="text-sm">
                  Add Periodic Maintenance Request
                </span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <PeriodicApprovalTable
        setSortedDataIndex={setSortedData}
        searchTerm={searchTerm}
      />

      {isModalOpen &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-boxdark rounded-lg shadow-lg p-6 relative w-full max-w-4xl mx-4 sm:mx-auto left-20 right-20 flex flex-col items-center">
              <button
                className="hover:text-primary border px-2 py-0.5 rounded-full absolute top-0 right-0 mt-3 mr-3 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-500"
                onClick={closeModal}
              >
                &times;
              </button>
              <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-4 self-start">
                Reports
              </h2>
              <div className="mb-4 flex flex-col items-center sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <div className="flex flex-col items-start">
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
                <div className="flex flex-col items-start">
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
              <div className="mt-7 flex flex-col sm:flex-row gap-4 sm:gap-4 justify-center">
                <button
                  className="inline-flex items-center justify-center gap-1.5 rounded-md bg-yellow-500 py-2 px-2.5 text-center font-medium text-white hover:bg-yellow-600 lg:px-3 mb-4 sm:mb-0"
                  onClick={() => exportToExcel(sortedData)}
                >
                  <span className="text-sm">Periodic Maintenance Report</span>
                </button>
                <button
                  className="inline-flex items-center justify-center gap-1.5 rounded-md bg-red-500 py-2 px-2.5 text-center font-medium text-white hover:bg-red-600 lg:px-3"
                  onClick={() => exportCustomToExcel(sortedData)}
                >
                  <span className="text-sm">
                    Completed Status Periodic Report
                  </span>
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </DefaultLayout>
  );
};

export default PeriodicMaintenance;
