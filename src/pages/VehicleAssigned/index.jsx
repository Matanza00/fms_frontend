import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { Link } from 'react-router-dom';
import { IoPersonAddOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import VehicleTaggingTable from './VehicleTaggingTable';
import { useGetTagDriversQuery } from '../../services/tagDriverSlice';
import { exportToPDF } from '../../components/ExportPDFCSV/ExportPDFCSV';
import { FaFileExport } from 'react-icons/fa6';
import { MdDownload } from 'react-icons/md';
import ExcelJS from 'exceljs';

const VehicleAssigned = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [companyId, setCompanyId] = useState(25); // State to store company ID

  useEffect(() => {}, []);

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
  };

  let [sortedData, setSortedData] = useState([]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const exportPDF = (processedData) => {
    const columnsToFilter = ['index', 'driverName', 'vehicleId', 'station'];
    const columnsToPrint = ['S. No', 'Driver Name', 'Vehicle Number', 'Station'];
    exportToPDF(processedData, columnsToFilter, columnsToPrint, 'Vehicles Assigned');
  };

  const exportToExcel = async (data) => {
    if (data.length === 0) {
      console.error('No data provided.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Vehicles Assigned');

    // Define columns
    worksheet.columns = [
      { header: 'S. No', key: 'index', width: 10 },
      { header: 'Driver Name', key: 'driverName', width: 20 },
      { header: 'Vehicle Number', key: 'vehicleId', width: 20 },
      { header: 'Station', key: 'station', width: 20 },
    ];

    // Group data by station
    const groupedData = data.reduce((acc, item) => {
      if (!acc[item.station]) {
        acc[item.station] = [];
      }
      acc[item.station].push(item);
      return acc;
    }, {});

    // Sort stations alphabetically
    const sortedStations = Object.keys(groupedData).sort();

    let currentRow = 1;
    sortedStations.forEach((station) => {
      // Add station header
      const stationHeaderRow = worksheet.addRow([station]);
      currentRow += 1;

      // Apply styles to station header row
      stationHeaderRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF0000FF' }, // Blue background for station headers
        };
      });

      // Add column headers for the station table
      const columnHeaderRow = worksheet.addRow(['S. No', 'Driver Name', 'Vehicle Number', 'Station']);
      currentRow += 1;

      // Apply styles to column headers row
      columnHeaderRow.eachCell((cell) => {
        cell.font = { bold: true, color: { argb: 'FF000000' } }; // Black color
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFFFFF00' }, // Yellow background
        };
      });

      // Add data rows for the station
      groupedData[station].forEach((item, index) => {
        worksheet.addRow({
          index: index + 1,
          driverName: item.driverName,
          vehicleId: item.vehicleId,
          station: item.station,
        });
      });

      // Increment currentRow to account for added rows and add a gap
      currentRow += groupedData[station].length + 1;
      worksheet.addRow([]);
      currentRow += 1;
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Create blob and download
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Vehicles_Assigned_Data.xlsx';
    link.click();
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Vehicle Assigned" />
      <div className="flex justify justify-between">
        <div className="ml-7 mr-auto pt-2 relative text-gray-600 w-90">
          <input
            className="rounded-full border border-slate-300 bg-white h-12 px-5 pr-16 text-md focus:outline-none focus:border-slate-400 w-full dark:border-slate-600 dark:bg-boxdark dark:text-slate-300 dark:focus:border-slate-400"
            type="text"
            name="search"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearch}
          />
          <button type="submit" className="absolute right-0 top-0 mt-6 mr-5">
            <FaSearch />
          </button>
        </div>

        <div className="flex items-end gap-2">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn h-[30px] min-h-[30px] text-sm border-slate-200 hover:bg-opacity-70 dark:text-white dark:bg-slate-700 dark:border-slate-700 dark:hover:bg-opacity-70 transition duration-150 ease-in-out rounded-md"
            >
              Reports
              {/* <MdDownload /> */}
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52  border border-slate-200 dark:text-white dark:bg-slate-700 dark:border-slate-700"
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
                  onClick={() => exportToExcel(sortedData)}
                >
                  Export as Excel
                  <FaFileExport />
                </button>
              </li>
            </ul>
          </div>
          <Link
            to="add"
            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 transition duration-150 ease-in-out"
          >
            <span>
              <IoPersonAddOutline />
            </span>
            Tag Driver
          </Link>
        </div>
      </div>

      <VehicleTaggingTable
        setSortedDataIndex={setSortedData}
        searchTerm={searchTerm}
      />
    </DefaultLayout>
  );
};

export default VehicleAssigned;
