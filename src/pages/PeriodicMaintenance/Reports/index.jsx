import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import { useGetPeriodicReportsQuery } from '../../../services/periodicSlice';
import { useSelector } from 'react-redux';
import BreadcrumbNav from '../../../components/Breadcrumbs/BreadcrumbNav';

const Reports = () => {
  const { data: periodicReports, isLoading } = useGetPeriodicReportsQuery();
  const user = useSelector((state) => state.auth.user);
  const [display, setDisplay] = useState({
    maintained: false,
    nonMaintained: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedStation, setSelectedStation] = useState('');
  const [uniqueStations, setUniqueStations] = useState([]);

  const handleVehicleClick = (registrationNo, station) => {
    // setSelectedVehicle({ registrationNo, station });
  };

  useEffect(() => {
    if (periodicReports) {
      const stations = [
        ...new Set(
          periodicReports.data.map(
            (vehicle) => vehicle.lastMaintenance.station,
          ),
        ),
      ];
      setUniqueStations(stations);
    }
  }, [periodicReports]);

  const maintainedVehicles =
    periodicReports?.data?.filter((vehicle) => {
      return !(vehicle.isDue || vehicle.isPreAlert || vehicle.isOverdueAlert);
    }) || [];

  const nonMaintainedVehicles =
    periodicReports?.data?.filter((vehicle) => {
      return vehicle.isDue || vehicle.isPreAlert || vehicle.isOverdueAlert;
    }) || [];

  const nonMaintainedByJobType = nonMaintainedVehicles.reduce(
    (acc, vehicle) => {
      const job = vehicle.job;
      const station = vehicle.lastMaintenance.station;
      if (!acc[job]) {
        acc[job] = {};
      }
      if (!acc[job][station]) {
        acc[job][station] = [];
      }
      acc[job][station].push(vehicle);
      return acc;
    },
    {},
  );

  const maintainedVehiclesCount = maintainedVehicles.length;
  const nonMaintainedVehiclesCount = nonMaintainedVehicles.length;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const periodicTypeCounts = Object.entries(nonMaintainedByJobType).map(
    ([job, stations]) => {
      const count = Object.values(stations).reduce(
        (sum, vehicles) => sum + vehicles.length,
        0,
      );
      return { job, count };
    },
  );

  const openModal = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
    setSelectedStation('');
  };

  const handleStationChange = (e) => {
    setSelectedStation(e.target.value);
  };

  const filteredVehicles =
    selectedJob && selectedStation
      ? nonMaintainedByJobType[selectedJob][selectedStation] || []
      : selectedJob
        ? Object.values(nonMaintainedByJobType[selectedJob]).flat()
        : [];

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-600">
        <BreadcrumbNav
          pageName="Periodic Reports"
          pageNameprev="Periodic" //show the name on top heading
          pagePrevPath="periodic" // add the previous path to the navigation
        />

        <div className="dashboard-container">
          <div className="flex justify-center gap-10">
            <div
              className="h-36 rounded-lg bg-green-400 px-20 flex justify-center items-center cursor-pointer"
              onClick={() =>
                setDisplay({ maintained: true, nonMaintained: false })
              }
            >
              <div>
                <p className="text-white text-xl font-semibold">
                  Total Maintained: {maintainedVehiclesCount}
                </p>
              </div>
            </div>
            <div
              className="h-36 rounded-lg bg-red-500 px-20 flex justify-center items-center cursor-pointer"
              onClick={() =>
                setDisplay({ maintained: false, nonMaintained: true })
              }
            >
              <div>
                <p className="text-white text-xl font-semibold">
                  Total Non-Maintained: {nonMaintainedVehiclesCount}
                </p>
              </div>
            </div>
          </div>

          {display.maintained && (
            <div className="my-24 grid grid-cols-1 md:grid-cols-2 gap-6">
              {maintainedVehicles.map((vehicle) => (
                <div
                  className="bg-green-200 rounded-lg p-4 cursor-pointer"
                  key={vehicle.registrationNo}
                  onClick={() =>
                    handleVehicleClick(
                      vehicle.registrationNo,
                      vehicle.lastMaintenance.station,
                    )
                  }
                >
                  <p className="font-semibold text-lg text-black">
                    {vehicle.registrationNo} - {vehicle.lastMaintenance.station}
                  </p>
                </div>
              ))}
            </div>
          )}

          {display.nonMaintained && (
            <div className="my-24 grid grid-cols-1 md:grid-cols-2 gap-6">
              {periodicTypeCounts.map(({ job, count }) => (
                <div key={job}>
                  <div
                    className="bg-red-200 rounded-lg p-4 cursor-pointer flex justify-between items-center"
                    onClick={() => openModal(job)}
                  >
                    <h4 className="font-semibold text-2xl text-black">{job}</h4>
                    <p className="text-lg text-black">Count: {count}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="modal modal-open">
              <div className="modal-box">
                <h3 className="font-bold text-lg">{selectedJob} Vehicles</h3>
                <div className="my-4">
                  <label htmlFor="station-select" className="block mb-2">
                    Select Station:
                  </label>
                  <select
                    id="station-select"
                    className="select select-bordered w-full max-w-xs"
                    value={selectedStation}
                    onChange={handleStationChange}
                  >
                    <option value="">All Stations</option>
                    {uniqueStations.map((station) => (
                      <option key={station} value={station}>
                        {station}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="overflow-x-auto">
                  <table className="table w-full">
                    <thead>
                      <tr>
                        <th>Registration No</th>
                        <th>Station</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVehicles.map((vehicle) => (
                        <tr
                          key={vehicle.registrationNo}
                          className="cursor-pointer"
                          onClick={() =>
                            handleVehicleClick(
                              vehicle.registrationNo,
                              vehicle.lastMaintenance.station,
                            )
                          }
                        >
                          <td>{vehicle.registrationNo}</td>
                          <td>{vehicle.lastMaintenance.station}</td>
                          <td
                            className={
                              vehicle.isDue
                                ? 'text-yellow-500'
                                : vehicle.isPreAlert
                                  ? 'text-blue-500'
                                  : 'text-red-500'
                            }
                          >
                            {vehicle.isDue
                              ? 'Due'
                              : vehicle.isPreAlert
                                ? 'Pre-Alert'
                                : 'Overdue'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="modal-action">
                  <button className="btn" onClick={closeModal}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

export default Reports;
