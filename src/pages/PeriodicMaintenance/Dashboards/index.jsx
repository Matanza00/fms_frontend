import React, { useEffect, useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { useGetPeriodicByCompanyIdQuery } from '../../../services/periodicSlice';
import BreadcrumbNav from '../../../components/Breadcrumbs/BreadcrumbNav';

const Modal = ({ data, title, categoryField }) => {
  const formatText = (text) => {
    if (!text) return '';
    return text
      .split(/(?=[A-Z])/)
      .join(' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // This will format the date as dd/mm/yyyy
  };

  return (
    <dialog id="my_modal_2" className="modal">
      <div className="modal-box max-w-full w-auto">
        <h3 className="font-bold text-lg">{title}</h3>
        <table className="table-auto w-full mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2">Registration No</th>
              <th className="px-4 py-2">Driver Name</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Station</th>
              <th className="px-4 py-2">Request Type</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">APL Card No</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Completion Date</th>
              <th className="px-4 py-2">{formatText(categoryField)}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((vehicle, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{vehicle.registrationNo}</td>
                <td className="border px-4 py-2">{vehicle.driverName}</td>
                <td className="border px-4 py-2">{vehicle.quantity}</td>
                <td className="border px-4 py-2">{vehicle.station}</td>
                <td className="border px-4 py-2">
                  {formatText(vehicle.requestType)}
                </td>
                <td className="border px-4 py-2">{vehicle.amount}</td>
                <td className="border px-4 py-2">{vehicle.aplCardNo}</td>
                <td className="border px-4 py-2">
                  {formatDate(vehicle.created_at)}
                </td>
                <td className="border px-4 py-2">
                  {formatDate(vehicle.completionDate)}
                </td>
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

function Dashboards() {
  const companyId = 25; // Replace with your actual company ID
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

  const [chartData, setChartData] = useState([]);
  const [jobData, setJobData] = useState([]);
  const [stations, setStations] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [selectedStationForRequestType, setSelectedStationForRequestType] =
    useState('All');
  const [selectedStationForJobType, setSelectedStationForJobType] =
    useState('All');
  const [selectedStatusForJobType, setSelectedStatusForJobType] =
    useState('All');
  const [modalData, setModalData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalCategoryField, setModalCategoryField] = useState('');

  useEffect(() => {
    if (periodicData && periodicData.data) {
      const uniqueStations = [
        'All',
        ...new Set(periodicData.data.map((item) => item.station)),
      ];
      setStations(uniqueStations);

      const uniqueStatuses = [
        'All',
        ...new Set(periodicData.data.map((item) => item.status)),
      ];
      setStatuses(uniqueStatuses);
    }
  }, [periodicData]);

  useEffect(() => {
    if (periodicData && periodicData.data) {
      const filterDataByStation = (data, station) => {
        return station === 'All'
          ? data
          : data.filter((item) => item.station === station);
      };

      const filteredRequestTypeData = filterDataByStation(
        periodicData.data,
        selectedStationForRequestType,
      );
      const statusCounts = filteredRequestTypeData.reduce((acc, periodic) => {
        const status = periodic.status
          ? periodic.status.charAt(0).toUpperCase() + periodic.status.slice(1)
          : 'Unknown';
        if (!acc[status]) {
          acc[status] = { count: 0, vehicles: [] };
        }
        acc[status].count++;
        acc[status].vehicles.push({
          registrationNo: periodic.registrationNo,
          driverName: periodic.driverName,
          quantity: periodic.quantity,
          station: periodic.station,
          requestType: periodic.periodicType.job,
          amount: periodic.amount,
          aplCardNo: periodic.aplCardNo,
          created_at: periodic.created_at,
          completionDate: periodic.completionDate,
          status: periodic.status,
        });
        return acc;
      }, {});

      const formattedRequestTypeData = Object.entries(statusCounts).map(
        ([status, { count, vehicles }]) => ({
          name: status,
          value: count,
          vehicles,
        }),
      );

      setChartData(formattedRequestTypeData);

      const filteredJobTypeData = filterDataByStation(
        periodicData.data,
        selectedStationForJobType,
      );
      const jobCounts = filteredJobTypeData.reduce((acc, periodic) => {
        if (
          selectedStatusForJobType === 'All' ||
          periodic.status === selectedStatusForJobType
        ) {
          const job =
            periodic.periodicType && periodic.periodicType.job
              ? periodic.periodicType.job.charAt(0).toUpperCase() +
                periodic.periodicType.job.slice(1)
              : 'Unknown';
          if (!acc[job]) {
            acc[job] = { count: 0, vehicles: [] };
          }
          acc[job].count++;
          acc[job].vehicles.push({
            registrationNo: periodic.registrationNo,
            driverName: periodic.driverName,
            quantity: periodic.quantity,
            station: periodic.station,
            requestType: periodic.periodicType.job,
            amount: periodic.amount,
            aplCardNo: periodic.aplCardNo,
            created_at: periodic.created_at,
            completionDate: periodic.completionDate,
            status: periodic.status,
          });
        }
        return acc;
      }, {});

      const formattedJobTypeData = Object.entries(jobCounts).map(
        ([job, { count, vehicles }]) => ({
          name: job,
          value: count,
          vehicles,
        }),
      );

      setJobData(formattedJobTypeData);
    }
  }, [
    periodicData,
    selectedStationForRequestType,
    selectedStationForJobType,
    selectedStatusForJobType,
  ]);

  const handleStationChangeForRequestType = (e) => {
    setSelectedStationForRequestType(e.target.value);
  };

  const handleStationChangeForJobType = (e) => {
    setSelectedStationForJobType(e.target.value);
  };

  const handleStatusChangeForJobType = (e) => {
    setSelectedStatusForJobType(e.target.value);
  };

  const chartColorMap = {
    Rejected: '#FF0000', // Red
    Completed: '#00FF00', // Green
    Pending: '#FFD700', // Yellow
    Approved: '#0000FF', // Blue
  };

  const colorMap = {
    Rejected: 'bg-red-500',
    Completed: 'bg-green-500',
    Pending: 'bg-yellow-500',
    Approved: 'bg-blue-500',
  };

  const handlePieClick = (data, title, categoryField) => {
    setModalData(data.vehicles);
    setModalTitle(title);
    setModalCategoryField(categoryField);
    setIsModalOpen(true);
    document.getElementById('my_modal_2').showModal();
  };

  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value, vehicles } = payload[0].payload;
      return (
        <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded shadow-md">
          <p className="label font-semibold">{`${name} : ${value}`}</p>
          <div className="mt-2">
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

  return (
    <DefaultLayout>
      <BreadcrumbNav
        pageName="Periodic Dashboard"
        pageNameprev="Periodic" //show the name on top heading
        pagePrevPath="periodic" // add the previous path to the navigation
      />

      <div className="flex flex-col items-center mt-10 bg-white rounded-lg shadow-lg p-5 w-full">
        <div className="flex flex-col lg:flex-row w-full justify-between gap-6">
          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Periodic Request Type</h2>
              <select
                className="border rounded p-2"
                value={selectedStationForRequestType}
                onChange={handleStationChangeForRequestType}
              >
                {stations.map((station, index) => (
                  <option key={index} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={chartData}
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
                      'Periodic Request Type',
                      'status',
                    )
                  }
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={chartColorMap[entry.name] || '#8884d8'}
                    />
                  ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 flex flex-wrap justify-center space-x-4">
              {chartData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span
                    className={`block h-3 w-3 rounded-full ${colorMap[entry.name]}`}
                  ></span>
                  <p className="text-sm font-medium text-black">{entry.name}</p>
                  <p className="ml-2 text-sm font-medium text-black">
                    {entry.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full lg:w-1/2 bg-white rounded-lg shadow-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Periodic Job Type</h2>
              <div className="flex space-x-4">
                <select
                  className="border rounded p-2"
                  value={selectedStationForJobType}
                  onChange={handleStationChangeForJobType}
                >
                  {stations.map((station, index) => (
                    <option key={index} value={station}>
                      {station}
                    </option>
                  ))}
                </select>
                <select
                  className="border rounded p-2"
                  value={selectedStatusForJobType}
                  onChange={handleStatusChangeForJobType}
                >
                  {statuses.map((status, index) => (
                    <option key={index} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={jobData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{
                    angle: jobData.length > 5 ? -45 : 0,
                    textAnchor: jobData.length > 5 ? 'end' : 'middle',
                  }}
                />
                <YAxis />
                <Tooltip content={renderCustomTooltip} />
                <Legend />
                <Bar
                  dataKey="value"
                  fill="#82ca9d"
                  onClick={(data, index) =>
                    handlePieClick(
                      data.payload,
                      'Periodic Job Type',
                      'requestType',
                    )
                  }
                />
              </BarChart>
            </ResponsiveContainer>
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
}

export default Dashboards;
