import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useGetFuelByCompanyIdQuery } from '../../services/fuelSlice';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';

const Modal = ({ data, title, categoryField }) => {
  const formatText = (text) => {
    return text
      .split(/(?=[A-Z])/)
      .join(' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <dialog id="my_modal_1" className="modal">
      <div className="modal-box max-w-full w-auto">
        <h3 className="font-bold text-lg">{title}</h3>
        <table className="table-auto w-full mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2">Registration No</th>
              <th className="px-4 py-2">Driver Name</th>
              <th className="px-4 py-2">Fuel Type</th>
              <th className="px-4 py-2">Station</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Mode of Fueling</th>
              <th className="px-4 py-2">Quantity of Fuel</th>
              <th className="px-4 py-2">Rate of Fuel</th>
              <th className="px-4 py-2">Card No</th>
              <th className="px-4 py-2">{formatText(categoryField)}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((vehicle, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{vehicle.registrationNo}</td>
                <td className="border px-4 py-2">{vehicle.driverName}</td>
                <td className="border px-4 py-2">{vehicle.fuelType}</td>
                <td className="border px-4 py-2">{vehicle.station}</td>
                <td className="border px-4 py-2">{vehicle.status}</td>
                <td className="border px-4 py-2">{vehicle.amount}</td>
                <td className="border px-4 py-2">{vehicle.modeOfFueling}</td>
                <td className="border px-4 py-2">{vehicle.quantityOfFuel}</td>
                <td className="border px-4 py-2">{vehicle.rateOfFuel}</td>
                <td className="border px-4 py-2">{vehicle.cardNo}</td>
                <td className="border px-4 py-2">
                  {formatText(vehicle[categoryField])}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  );
};

const FuelDashboard = () => {
  const companyId = 25; // Replace with actual company ID
  const [fuelTypeData, setFuelTypeData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [selectedFuelTypeMonth, setSelectedFuelTypeMonth] = useState(
    new Date().getMonth() + 1,
  );
  const [selectedStatusMonth, setSelectedStatusMonth] = useState(
    new Date().getMonth() + 1,
  );
  const [selectedStation, setSelectedStation] = useState('');
  const [stations, setStations] = useState([]);
  const [modalData, setModalData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalCategoryField, setModalCategoryField] = useState('');

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const handleFuelTypeMonthChange = (e) => {
    setSelectedFuelTypeMonth(Number(e.target.value));
  };

  const handleStatusMonthChange = (e) => {
    setSelectedStatusMonth(Number(e.target.value));
  };

  const handleStationChange = (e) => {
    setSelectedStation(e.target.value);
  };

  const { data: fuelData, isLoading } = useGetFuelByCompanyIdQuery({
    companyId,
    page: 1,
    limit: 1000, // Adjust limit as needed
  });

  useEffect(() => {
    if (fuelData && Array.isArray(fuelData.data)) {
      const stationSet = new Set();
      fuelData.data.forEach((request) => {
        if (request.station) {
          stationSet.add(request.station);
        }
      });
      setStations(Array.from(stationSet));
    }
  }, [fuelData]);

  useEffect(() => {
    if (fuelData && Array.isArray(fuelData.data)) {
      const requestTypes = {
        Domestic: { count: 0, vehicles: [] },
        Local: { count: 0, vehicles: [] },
      };

      fuelData.data
        .filter(
          (request) =>
            new Date(request.created_at).getMonth() + 1 ===
              selectedFuelTypeMonth &&
            (selectedStation === '' || request.station === selectedStation),
        )
        .forEach((request) => {
          if (request.requestType === 'Domestic') {
            requestTypes.Domestic.count += 1;
            requestTypes.Domestic.vehicles.push(request);
          } else if (request.requestType === 'Local') {
            requestTypes.Local.count += 1;
            requestTypes.Local.vehicles.push(request);
          }
        });

      const formattedFuelTypeData = Object.entries(requestTypes).map(
        ([type, { count, vehicles }]) => ({
          name: type,
          value: count,
          vehicles,
        }),
      );

      setFuelTypeData(formattedFuelTypeData);
    }
  }, [fuelData, selectedFuelTypeMonth, selectedStation]);

  useEffect(() => {
    if (fuelData && Array.isArray(fuelData.data)) {
      const statusCounts = {
        pending: { count: 0, vehicles: [] },
        approved: { count: 0, vehicles: [] },
        rejected: { count: 0, vehicles: [] },
      };

      fuelData.data
        .filter(
          (request) =>
            new Date(request.created_at).getMonth() + 1 ===
              selectedStatusMonth &&
            (selectedStation === '' || request.station === selectedStation),
        )
        .forEach((request) => {
          const status = request.status.toLowerCase();
          if (statusCounts[status] !== undefined) {
            statusCounts[status].count += 1;
            statusCounts[status].vehicles.push(request);
          }
        });

      const formattedStatusData = Object.entries(statusCounts).map(
        ([status, { count, vehicles }]) => ({
          name: status.charAt(0).toUpperCase() + status.slice(1), // Capitalize the first letter
          value: count,
          vehicles,
        }),
      );

      setStatusData(formattedStatusData);
    }
  }, [fuelData, selectedStatusMonth, selectedStation]);

  if (isLoading) return <p>Loading...</p>;

  const colorMap = {
    Domestic: '#FF6384',
    Local: '#36A2EB',
    Pending: '#FFCE56',
    Approved: '#4BC0C0',
    Rejected: '#FF6384',
  };

  const chartColorMap = {
    Domestic: '#FF6384',
    Local: '#36A2EB',
    Pending: '#FFCE56',
    Approved: '#4BC0C0',
    Rejected: '#FF6384',
  };

  const handlePieClick = (data, title, categoryField) => {
    setModalData(data.vehicles);
    setModalTitle(title);
    setModalCategoryField(categoryField);
    setIsModalOpen(true);
    document.getElementById('my_modal_1').showModal();
  };

  return (
    <DefaultLayout>
      <BreadcrumbNav
        pageName="Fuel Dashboard"
        pageNameprev="Fuel Management" //show the name on top heading
        pagePrevPath="fuel-management" // add the previous path to the navigation
      />
      <div className="flex justify-center mt-10 space-x-4">
        <div className="w-1/2 bg-white rounded-lg shadow-lg p-6 flex flex-col">
          <div className="mb-4 flex justify-between">
            <h6 className="text-xl font-semibold text-black dark:text-white">
              Fuel Request Type
            </h6>
            <div className="flex">
              <select
                className="border rounded p-2 mr-2"
                value={selectedFuelTypeMonth}
                onChange={handleFuelTypeMonthChange}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              <select
                className="border rounded p-2"
                value={selectedStation}
                onChange={handleStationChange}
              >
                <option value="">All Stations</option>
                {stations.map((station, index) => (
                  <option key={index} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={fuelTypeData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                onClick={(data, index) =>
                  handlePieClick(
                    data.payload,
                    'Fuel Request Type',
                    'requestType',
                  )
                }
              >
                {fuelTypeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={chartColorMap[entry.name]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-end space-x-4">
            {['Domestic', 'Local'].map((type, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span
                  className={`block h-3 w-3 rounded-full`}
                  style={{ backgroundColor: colorMap[type] }}
                ></span>
                <p className="text-sm font-medium text-black dark:text-white">
                  {type}
                </p>
                <p className="ml-2 text-sm font-medium text-black dark:text-white">
                  {fuelTypeData.find((data) => data.name === type)?.value || 0}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/2 bg-white rounded-lg shadow-lg p-6 flex flex-col">
          <div className="mb-4 flex justify-between">
            <h6 className="text-xl font-semibold text-black dark:text-white">
              Fuel Request Status
            </h6>
            <div className="flex">
              <select
                className="border rounded p-2 mr-2"
                value={selectedStatusMonth}
                onChange={handleStatusMonthChange}
              >
                {months.map((month) => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
              <select
                className="border rounded p-2"
                value={selectedStation}
                onChange={handleStationChange}
              >
                <option value="">All Stations</option>
                {stations.map((station, index) => (
                  <option key={index} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                onClick={(data, index) =>
                  handlePieClick(data.payload, 'Fuel Request Status', 'status')
                }
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={chartColorMap[entry.name]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 flex justify-end space-x-4">
            {['Pending', 'Approved', 'Rejected'].map((status, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span
                  className={`block h-3 w-3 rounded-full`}
                  style={{ backgroundColor: colorMap[status] }}
                ></span>
                <p className="text-sm font-medium text-black dark:text-white">
                  {status}
                </p>
                <p className="ml-2 text-sm font-medium text-black dark:text-white">
                  {statusData.find((data) => data.name === status)?.value || 0}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        data={modalData}
        title={modalTitle}
        categoryField={modalCategoryField}
      />
    </DefaultLayout>
  );
};

export default FuelDashboard;
