import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { useGetEmergencyrequestQuery } from '../../../services/emergencySlice';

const Modal = ({ data, title, categoryField }) => {
  const formatText = (text) => {
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
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box max-w-full w-auto">
        <h3 className="font-bold text-lg">{title}</h3>
        <table className="table-auto w-full mt-4">
          <thead>
            <tr>
              <th className="px-4 py-2">Registration No</th>
              <th className="px-4 py-2">Driver Name</th>
              <th className="px-4 py-2">Station</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">APL Card No</th>
              <th className="px-4 py-2">Created At</th>
              <th className="px-4 py-2">Repair Cost</th>
              <th className="px-4 py-2">{formatText(categoryField)}</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">{item.registrationNo}</td>
                <td className="border px-4 py-2">{item.driverName}</td>
                <td className="border px-4 py-2">{item.station}</td>
                <td className="border px-4 py-2">{item.status}</td>
                <td className="border px-4 py-2">{item.aplCardNo}</td>
                <td className="border px-4 py-2">{formatDate(item.created_at)}</td>
                <td className="border px-4 py-2">{item.repairCost}</td>
                <td className="border px-4 py-2">{formatText(item[categoryField])}</td>
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

function EmergencyDashboard() {
  const { data: emergencyData, error: emergencyError, isLoading: emergencyLoading } = useGetEmergencyrequestQuery({
    page: 1,
    limit: 1000,
  });

  const [vendorTypeData, setVendorTypeData] = useState([]);
  const [indoorVendorData, setIndoorVendorData] = useState([]);
  const [stations, setStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState('All');
  const [modalData, setModalData] = useState([]);
  const [modalTitle, setModalTitle] = useState('');
  const [modalCategoryField, setModalCategoryField] = useState('');

  useEffect(() => {
    if (emergencyData && emergencyData.data) {
      const uniqueStations = ['All', ...new Set(emergencyData.data.map(item => item.station))];
      setStations(uniqueStations);
    }
  }, [emergencyData]);

  useEffect(() => {
    if (emergencyData && emergencyData.data) {
      const filteredData = selectedStation === 'All'
        ? emergencyData.data
        : emergencyData.data.filter(item => item.station === selectedStation);

      const vendorTypeCounts = filteredData.reduce((acc, item) => {
        const vendorType = item.vendorType ? item.vendorType : 'Unknown';
        if (!acc[vendorType]) {
          acc[vendorType] = { count: 0, items: [] };
        }
        acc[vendorType].count++;
        acc[vendorType].items.push(item);
        return acc;
      }, {});

      const formattedVendorTypeData = Object.entries(vendorTypeCounts).map(([vendorType, { count, items }]) => ({
        name: vendorType,
        value: count,
        items,
      }));

      setVendorTypeData(formattedVendorTypeData);

      const indoorVendorCounts = filteredData.reduce((acc, item) => {
        const indoorVendor = item.indoorVendorName ? item.indoorVendorName : 'Unknown';
        if (!acc[indoorVendor]) {
          acc[indoorVendor] = { count: 0, items: [] };
        }
        acc[indoorVendor].count++;
        acc[indoorVendor].items.push(item);
        return acc;
      }, {});

      const formattedIndoorVendorData = Object.entries(indoorVendorCounts)
        .filter(([indoorVendor]) => indoorVendor !== 'Unknown')
        .map(([indoorVendor, { count, items }]) => ({
          name: indoorVendor,
          value: count,
          items,
        }));

      setIndoorVendorData(formattedIndoorVendorData);
    }
  }, [emergencyData, selectedStation]);

  const handleStationChange = (e) => {
    setSelectedStation(e.target.value);
  };

  const chartColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28FF9', '#F95F62'];

  const handlePieClick = (data, title, categoryField) => {
    setModalData(data.items);
    setModalTitle(title);
    setModalCategoryField(categoryField);
    document.getElementById('my_modal_3').showModal();
  };

  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const { name, value } = payload[0].payload;
      return (
        <div className="custom-tooltip bg-white p-2 border border-gray-300 rounded shadow-md">
          <p className="label font-semibold">{`${name} : ${value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Emergency Maintenance Dashboard" />

      <div className="flex flex-col items-center mt-10 bg-white rounded-lg shadow-lg p-5 w-full">
        <div className="flex w-full space-x-4">
          <div className="w-1/2 bg-white rounded-lg shadow-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Vendor Type Distribution</h2>
              <select 
                className="border rounded p-2" 
                value={selectedStation} 
                onChange={handleStationChange}
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
                  data={vendorTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  onClick={(data, index) => handlePieClick(data.payload, 'Vendor Type Distribution', 'vendorType')}
                >
                  {vendorTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 flex flex-wrap justify-center space-x-4">
              {vendorTypeData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="block h-3 w-3 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }}></span>
                  <p className="text-sm font-medium text-black">
                    {entry.name}
                  </p>
                  <p className="ml-2 text-sm font-medium text-black">
                    {entry.value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="w-1/2 bg-white rounded-lg shadow-lg p-5">
            <h2 className="text-xl font-semibold mb-4">Indoor Vendor Distribution</h2>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={indoorVendorData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  onClick={(data, index) => handlePieClick(data.payload, 'Indoor Vendor Distribution', 'indoorVendorName')}
                >
                  {indoorVendorData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                  ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} />
              </PieChart>
            </ResponsiveContainer>

            <div className="mt-4 flex flex-wrap justify-center space-x-4">
              {indoorVendorData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <span className="block h-3 w-3 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }}></span>
                  <p className="text-sm font-medium text-black">
                    {entry.name}
                  </p>
                  <p className="ml-2 text-sm font-medium text-black">
                    {entry.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal data={modalData} title={modalTitle} categoryField={modalCategoryField} />
    </DefaultLayout>
  );
}

export default EmergencyDashboard;
