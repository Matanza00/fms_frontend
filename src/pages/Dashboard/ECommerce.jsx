// ECommerce.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useGetVehicleByCompanyIdQuery } from '../../services/vehicleSlice';
import { useGetTagDriversQuery } from '../../services/tagDriverSlice';
import { useGetDriverByCompanyIdQuery } from '../../services/driverSlice';
import { useGetFuelByCompanyIdQuery } from '../../services/fuelSlice';
import { useGetPeriodicByCompanyIdQuery } from '../../services/periodicSlice';
import CardDataStats from '../../components/CardDataStats';
import DefaultLayout from '../../layout/DefaultLayout';
import { FaShippingFast } from 'react-icons/fa';
import { TbTruckOff } from 'react-icons/tb';
import VehicleMap from './Map';
import { useSelector } from 'react-redux';

const ECommerce = () => {
  const companyId = 25; // Replace with your actual company ID
  const { user } = useSelector((state) => state.auth);
  const [vehicleLocations, setVehicleLocations] = useState([]);
  const [fuelStatusData, setFuelStatusData] = useState([]);
  const [periodicStatusData, setPeriodicStatusData] = useState([]);
  const [vehicleModelData, setVehicleModelData] = useState([]);
  const [selectedFuelStation, setSelectedFuelStation] = useState('All');
  const [selectedPeriodicStation, setSelectedPeriodicStation] = useState('All');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [modalData, setModalData] = useState(null); // Modal data state
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [selectedStation, setSelectedStation] = useState(user?.station);
  const userStation = user?.station;
  const userRole = user?.role; // Get the user role

  const handleFuelStationChange = (e) => {
    setSelectedFuelStation(e.target.value);
  };

  const handlePeriodicStationChange = (e) => {
    setSelectedPeriodicStation(e.target.value);
  };

  const handleFromDateChange = (e) => {
    setFromDate(e.target.value);
  };

  const handleToDateChange = (e) => {
    setToDate(e.target.value);
  };

  const {
    data: vehicleData,
    error: vehicleError,
    isLoading: vehicleLoading,
  } = useGetVehicleByCompanyIdQuery({
    companyId,
    page: 1,
    limit: 1000, // Increase the limit to fetch all vehicles
    searchTerm: '',
    station: '',
  });

  const {
    data: fuelData,
    error: fuelError,
    isLoading: fuelLoading,
  } = useGetFuelByCompanyIdQuery({
    companyId,
    page: 1,
    limit: 1000,
  });

  const {
    data: periodicData,
    error: periodicError,
    isLoading: periodicLoading,
  } = useGetPeriodicByCompanyIdQuery({
    companyId,
    page: 1,
    limit: 1000,
    searchTerm: '',
  });

  useEffect(() => {
    const initializeStatusCounts = (statuses) => {
      return statuses.reduce((acc, status) => {
        acc[status] = { count: 0, vehicles: [] };
        return acc;
      }, {});
    };

    const statusList = ['Pending', 'Approved', 'Rejected', 'Completed'];

    if (fuelData && fuelData.data) {
      const statusCounts = initializeStatusCounts(statusList);

      fuelData.data
        .filter(
          (fuel) =>
            (!fromDate || new Date(fuel.created_at) >= new Date(fromDate)) &&
            (!toDate || new Date(fuel.created_at) <= new Date(toDate)) &&
            (selectedFuelStation === 'All' ||
              fuel.station === selectedFuelStation),
        )
        .forEach((fuel) => {
          const status =
            fuel.status.charAt(0).toUpperCase() + fuel.status.slice(1);
          if (statusCounts[status] !== undefined) {
            statusCounts[status].count++;
            statusCounts[status].vehicles.push(fuel);
          }
        });

      const formattedData = Object.entries(statusCounts).map(
        ([status, { count, vehicles }]) => ({
          name: status,
          value: count,
          vehicles,
        }),
      );

      setFuelStatusData(formattedData);
    } else {
      const formattedData = statusList.map((status) => ({
        name: status,
        value: 0,
        vehicles: [],
      }));
      setFuelStatusData(formattedData);
    }
  }, [fuelData, fromDate, toDate, selectedFuelStation]);

  useEffect(() => {
    const initializeStatusCounts = (statuses) => {
      return statuses.reduce((acc, status) => {
        acc[status] = { count: 0, vehicles: [] };
        return acc;
      }, {});
    };

    const statusList = ['Pending', 'Approved', 'Rejected', 'Completed'];

    if (periodicData && periodicData.data) {
      const statusCounts = initializeStatusCounts(statusList);

      periodicData.data
        .filter(
          (periodic) =>
            (!fromDate ||
              new Date(periodic.created_at) >= new Date(fromDate)) &&
            (!toDate || new Date(periodic.created_at) <= new Date(toDate)) &&
            (selectedPeriodicStation === 'All' ||
              periodic.station === selectedPeriodicStation),
        )
        .forEach((periodic) => {
          const status =
            periodic.status.charAt(0).toUpperCase() + periodic.status.slice(1);
          if (statusCounts[status] !== undefined) {
            statusCounts[status].count++;
            statusCounts[status].vehicles.push(periodic);
          }
        });

      const formattedData = Object.entries(statusCounts).map(
        ([status, { count, vehicles }]) => ({
          name: status,
          value: count,
          vehicles,
        }),
      );

      setPeriodicStatusData(formattedData);
    } else {
      const formattedData = statusList.map((status) => ({
        name: status,
        value: 0,
        vehicles: [],
      }));
      setPeriodicStatusData(formattedData);
    }
  }, [periodicData, fromDate, toDate, selectedPeriodicStation]);

  useEffect(() => {
    if (vehicleData && vehicleData.data) {
      const filteredVehicles =
        selectedFuelStation === 'All'
          ? vehicleData.data
          : vehicleData.data.filter(
              (vehicle) => vehicle.station === selectedFuelStation,
            );

      const modelCounts = filteredVehicles.reduce((acc, vehicle) => {
        const model = vehicle.model || 'Unknown';
        if (!acc[model]) {
          acc[model] = 0;
        }
        acc[model]++;
        return acc;
      }, {});

      const formattedModelData = Object.entries(modelCounts).map(
        ([model, count]) => ({
          model,
          count,
        }),
      );

      setVehicleModelData(formattedModelData);
    }
  }, [vehicleData, selectedFuelStation]);

  const totalVehicles = vehicleData ? vehicleData.results : 'Error'; // Adjust this based on your actual data structure

  // Group vehicles by station
  const vehiclesByStation = vehicleData
    ? vehicleData.data.reduce((acc, vehicle) => {
        const station = vehicle.station || 'Unknown';
        if (!acc[station]) {
          acc[station] = { vehicles: 0, drivers: 0 };
        }
        acc[station].vehicles++;
        return acc;
      }, {})
    : {};

  const stationOptions = ['All', ...Object.keys(vehiclesByStation)];

  // Fetch total tagged drivers
  const {
    data: driverData,
    error: driverError,
    isLoading: driverLoading,
  } = useGetTagDriversQuery({
    companyId,
    page: 1,
    limit: 1, // Limit to 1 just to get the total count
    searchTerm: '',
    station: '',
  });

  const totalTaggedDrivers = driverData ? driverData.results : 'Error'; // Adjust this based on your actual data structure

  // Fetch total drivers
  const {
    data: allDriverData,
    error: allDriverError,
    isLoading: allDriverLoading,
  } = useGetDriverByCompanyIdQuery({
    companyId,
    page: 1,
    limit: 1000, // Increase the limit to fetch all drivers
    searchTerm: '',
    station: '',
  });

  const totalDrivers = allDriverData ? allDriverData.results : 'Error'; // Adjust this based on your actual data structure

  // Group drivers by station
  const driversByStation = allDriverData
    ? allDriverData.data.reduce((acc, driver) => {
        const station = driver.station || 'Unknown';
        if (!acc[station]) {
          acc[station] = { vehicles: 0, drivers: 0 };
        }
        acc[station].drivers++;
        return acc;
      }, vehiclesByStation)
    : vehiclesByStation;

  // Prepare data for vehicle bar chart
  const vehicleChartData = Object.entries(vehiclesByStation).map(
    ([station, counts]) => ({
      station,
      vehicles: counts.vehicles,
    }),
  );

  // Prepare data for driver bar chart
  const driverChartData = Object.entries(driversByStation).map(
    ([station, counts]) => ({
      station,
      drivers: counts.drivers,
    }),
  );

  // Calculate available vehicles
  const availableVehicles = totalVehicles - totalTaggedDrivers;

  const customMarker = new L.Icon({
    iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-shadow.png',
    shadowSize: [41, 41],
  });

  const colorMap = {
    Pending: 'bg-red-500',
    Approved: 'bg-blue-500',
    Rejected: 'bg-yellow-500',
    Completed: 'bg-green-500',
  };

  const chartColorMap = {
    Pending: '#FF0000', // Red
    Approved: '#0000FF', // Blue
    Rejected: '#FFD700', // Yellow
    Completed: '#00FF00', // Green
  };

  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value, vehicles } = payload[0].payload;
      return (
        <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded shadow-md">
          <p className="label font-semibold">{`${name} : ${value}`}</p>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {vehicles.map((vehicle, index) => (
              <p
                key={index}
                className="text-sm"
              >{`${index + 1}. ${vehicle.registrationNo}`}</p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const handleChartClick = (data, name) => {
    setModalData({ name, vehicles: data.vehicles });
    setIsModalOpen(true);
  };

  const handlePieClick = (data, index, e, name) => {
    e.stopPropagation();
    handleChartClick(data, name);
  };

  const renderFuelTable = (vehicles) => (
    <table className="table-auto w-full">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4 py-2 border">Registration No</th>
          <th className="px-4 py-2 border">Driver Name</th>
          <th className="px-4 py-2 border">Fuel Type</th>
          <th className="px-4 py-2 border">Quantity</th>
          <th className="px-4 py-2 border">Amount</th>
          <th className="px-4 py-2 border">Status</th>
        </tr>
      </thead>
      <tbody>
        {vehicles.map((vehicle, index) => (
          <tr key={index} className="hover:bg-gray-100">
            <td className="border px-4 py-2">{vehicle.registrationNo}</td>
            <td className="border px-4 py-2">{vehicle.driverName}</td>
            <td className="border px-4 py-2">{vehicle.fuelType}</td>
            <td className="border px-4 py-2">{vehicle.quantityOfFuel}</td>
            <td className="border px-4 py-2">{vehicle.amount}</td>
            <td className="border px-4 py-2">{vehicle.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderPeriodicTable = (vehicles) => (
    <table className="table-auto w-full">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4 py-2 border">Registration No</th>
          <th className="px-4 py-2 border">Driver Name</th>
          <th className="px-4 py-2 border">Periodic Type</th>
          <th className="px-4 py-2 border">Quantity</th>
          <th className="px-4 py-2 border">Amount</th>
          <th className="px-4 py-2 border">Status</th>
        </tr>
      </thead>
      <tbody>
        {vehicles.map((vehicle, index) => (
          <tr key={index} className="hover:bg-gray-100">
            <td className="border px-4 py-2">{vehicle.registrationNo}</td>
            <td className="border px-4 py-2">{vehicle.driverName}</td>
            <td className="border px-4 py-2">{vehicle.periodicType.job}</td>
            <td className="border px-4 py-2">{vehicle.quantity}</td>
            <td className="border px-4 py-2">{vehicle.amount}</td>
            <td className="border px-4 py-2">{vehicle.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <DefaultLayout>
      <div>Dashboard</div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Total Drivers"
          total={allDriverLoading ? 'Loading...' : totalDrivers}
          rate="Pakistan"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="stroke-primary size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z"
            />
          </svg>
        </CardDataStats>

        <CardDataStats
          title="Total Vehicles"
          total={vehicleLoading ? 'Loading...' : totalVehicles}
          rate="Pakistan"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="stroke-primary size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
            />
          </svg>
        </CardDataStats>

        <CardDataStats
          title="Vehicle Assigned"
          total={driverLoading ? 'Loading...' : totalTaggedDrivers}
          rate="Pakistan"
        >
          <FaShippingFast className="fill-primary size-5" />
        </CardDataStats>

        <CardDataStats
          title="Available Vehicles"
          total={
            vehicleLoading || driverLoading ? 'Loading...' : availableVehicles
          }
          rate="Pakistan"
        >
          <TbTruckOff className="text-primary size-6" />
        </CardDataStats>
      </div>
      <div className="mt-5 col-span-12 xl:col-span-12 h-125 rounded-sm border border-stroke bg-white p-7.5 shadow-xl dark:border-strokedark dark:bg-boxdark">
        <ResponsiveContainer width="100%" height={400}>
          <div className="ml-5 mb-4">
            <h6 className="text-xl font-semibold text-black dark:text-white">
              Live Vehicle Tracking
            </h6>
          </div>
          <VehicleMap
            selectedStation={selectedStation}
            userStation={userStation}
            userRole={userRole}
            vehicleData={vehicleData?.data || []}
          />
        </ResponsiveContainer>
      </div>

      <div className="mt-4 col-span-12 xl:col-span-12 h-125 rounded-sm border border-stroke bg-white p-7.5 shadow-xl dark:border-strokedark dark:bg-boxdark flex flex-col">
        <div className="ml-5 mb-4 flex justify-between">
          <h6 className="text-xl font-semibold text-black dark:text-white">
            Fuel Request Status
          </h6>
          <div className="flex space-x-2">
            <select
              className="border rounded p-2"
              value={selectedFuelStation}
              onChange={handleFuelStationChange}
            >
              {stationOptions.map((station, index) => (
                <option key={index} value={station}>
                  {station}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
              className="border rounded p-2"
            />
            <input
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              className="border rounded p-2"
            />
          </div>
        </div>
        <div className="flex flex-1 items-center">
          <div className="w-full">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={fuelStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  onClick={(data, index, e) =>
                    handlePieClick(data, index, e, 'Fuel Request Status')
                  }
                >
                  {fuelStatusData.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={chartColorMap[entry.name]}
                    />
                  ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-4">
          {['Pending', 'Approved', 'Rejected', 'Completed'].map((status, index) => (
            <div key={index} className="flex items-center space-x-2">
              <span
                className={`block h-3 w-3 rounded-full ${colorMap[status]}`}
              ></span>
              <p className="text-sm font-medium text-black dark:text-white">
                {status}
              </p>
              <p className="ml-2 text-sm font-medium text-black dark:text-white">
                {fuelStatusData.find((data) => data.name === status)?.value ||
                  0}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 col-span-12 xl:col-span-12 h-125 rounded-sm border border-stroke bg-white p-7.5 shadow-xl dark:border-strokedark dark:bg-boxdark flex flex-col">
        <div className="ml-5 mb-4 flex justify-between">
          <h6 className="text-xl font-semibold text-black dark:text-white">
            Periodic Request Status
          </h6>
          <div className="flex space-x-2">
            <select
              className="border rounded p-2"
              value={selectedPeriodicStation}
              onChange={handlePeriodicStationChange}
            >
              {stationOptions.map((station, index) => (
                <option key={index} value={station}>
                  {station}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={fromDate}
              onChange={handleFromDateChange}
              className="border rounded p-2"
            />
            <input
              type="date"
              value={toDate}
              onChange={handleToDateChange}
              className="border rounded p-2"
            />
          </div>
        </div>
        <div className="flex flex-1 items-center">
          <div className="w-full">
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={periodicStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  onClick={(data, index, e) =>
                    handlePieClick(data, index, e, 'Periodic Request Status')
                  }
                >
                  {periodicStatusData.map((entry) => (
                    <Cell
                      key={`cell-${entry.name}`}
                      fill={chartColorMap[entry.name]}
                    />
                  ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-4 flex justify-end space-x-4">
          {['Pending', 'Approved', 'Rejected', 'Completed'].map(
            (status, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span
                  className={`block h-3 w-3 rounded-full ${colorMap[status]}`}
                ></span>
                <p className="text-sm font-medium text-black dark:text-white">
                  {status}
                </p>
                <p className="ml-2 text-sm font-medium text-black dark:text-white">
                  {periodicStatusData.find((data) => data.name === status)
                    ?.value || 0}
                </p>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="mt-4 col-span-12 xl:col-span-12 h-125 rounded-sm border border-stroke bg-white p-7.5 shadow-xl dark:border-strokedark dark:bg-boxdark">
        <ResponsiveContainer width="100%" height={400}>
          <div className="ml-5 mb-4 flex justify-between">
            <h6 className="text-xl font-semibold text-black dark:text-white">
              Vehicles by Model
            </h6>
            <select
              className="border rounded p-2"
              value={selectedFuelStation}
              onChange={handleFuelStationChange}
            >
              {stationOptions.map((station, index) => (
                <option key={index} value={station}>
                  {station}
                </option>
              ))}
            </select>
          </div>
          <BarChart layout="vertical" data={vehicleModelData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              dataKey="model"
              type="category"
              interval={0}
              tick={{ fontSize: 10 }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#3C50E0" name="Vehicles" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <h3 className="font-bold text-lg">{modalData.name}</h3>
            <div className="py-4">
              {modalData && modalData.name === 'Fuel Request Status' && (
                <>
                  <h4 className="font-semibold mb-2">
                    Fuel Request Status Details
                  </h4>
                  {renderFuelTable(modalData.vehicles)}
                </>
              )}
              {modalData && modalData.name === 'Periodic Request Status' && (
                <>
                  <h4 className="font-semibold mb-2">
                    Periodic Request Status Details
                  </h4>
                  {renderPeriodicTable(modalData.vehicles)}
                </>
              )}
            </div>
            <div className="modal-action">
              <button className="btn" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export default ECommerce;
