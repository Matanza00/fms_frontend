import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { Link } from 'react-router-dom';
import { RiAddCircleLine } from 'react-icons/ri';
import { useEffect, useState } from 'react';
import VehicleTable from './VehicleTable';
import { useGetVehicleByCompanyIdQuery } from '../../services/vehicleSlice';
import { FaSearch } from 'react-icons/fa';
import { FaFileExport } from 'react-icons/fa6';
import { IoPersonAddOutline } from 'react-icons/io5';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CiExport } from 'react-icons/ci';
import { exportToPDF } from '../../components/ExportPDFCSV/ExportPDFCSV';
import { MdDownload } from 'react-icons/md';

const Vehicles = () => {
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

  const exportPDF = (data) => {
    const columnsToFilter = [
      'id',
      'registrationNo',
      'oddometerReading',
      'make',
      'model',
      'type',
      'size',
      'region',
      'subRegion',
      'station',
    ];
    const columnsToPrint = [
      'ID',
      'Reg No',
      'Oddometer',
      'Make',
      'Model',
      'Type',
      'Size',
      'Region',
      'Subregion',
      'Station',
    ];

    exportToPDF(data, columnsToFilter, columnsToPrint, 'Vehicles');
  };

  const exportToCsv = (data) => {
    if (data.length === 0) {
      console.error('No data provided.');
      return;
    }

    const columnsToFilter = [
      'id',
      'registrationNo',
      'oddometerReading',
      'make',
      'model',
      'type',
      'size',
      'region',
      'subRegion',
      'station',
      'created_at',
    ];

    const columnsToPrint = [
      'ID',
      'Reg No',
      'Oddometer',
      'Make',
      'Model',
      'Type',
      'Size',
      'Region',
      'Subregion',
      'Station',
      'Created At',
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

    data.forEach((obj) => {
      const values = columnsToFilter.map((key) => {
        const escapedValue = ('' + obj[key]).replace(/"/g, '\\"');
        return `"${escapedValue}"`;
      });
      csvRows.push(values.join(','));
    });

    const csvString = csvRows.join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, 'Vehicles_Data.csv');
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // feature detection
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'Vehicles_Data.csv');
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
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Vehicles" />
      <div className="flex justify-between">
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
              Export
              <MdDownload />
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
                  onClick={() => exportToCsv(sortedData)}
                >
                  Export as CSV
                  <FaFileExport />
                </button>
              </li>
            </ul>
          </div>
          {/* <Link
            to="add"
            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 transition duration-150 ease-in-out"
          >
            <span>
              <IoPersonAddOutline />
            </span>
            Add Vehicle
          </Link> */}
        </div>
      </div>

      <VehicleTable
        setSortedDataIndex={setSortedData}
        searchTerm={searchTerm}
      />
    </DefaultLayout>
  );
};

export default Vehicles;
