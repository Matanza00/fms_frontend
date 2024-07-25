import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { useSelector } from 'react-redux';
import useToast from '../../hooks/useToast';
import PaginationComponent from '../../components/Pagination/Pagination';
import {
  useGetAllDailyReportsQuery,
  useGetChecklistDataQuery,
} from '../../services/dailySlice';
import { useGetVehicleByCompanyIdQuery } from '../../services/vehicleSlice';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';

const DailyMaintenanceTable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showErrorToast, showSuccessToast } = useToast();

  const { user } = useSelector((state) => state.auth);
  const { station, status } = location.state || {};
  const { registrationNo } = location.state || {};
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const {
    data: dailyCLData,
    isLoading,
    error,
  } = useGetChecklistDataQuery({
    registrationNo,
  });
  const {
    data: vehicleData,
    isError: vehicleError,
    isLoading: VehiclesLoading,
    refetch,
  } = useGetVehicleByCompanyIdQuery({
    companyId: user?.companyId,
    page,
    limit,
    sortBy,
    sortOrder,
    station: user?.station,
  });

  const {
    data: dailyData,
    isLoading: dailyLoading,
    isError: dailyError,
  } = useGetAllDailyReportsQuery({
    station: station?.value,
  });
  useEffect(() => {
    setPage(1);
    refetch();
  }, [sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  useEffect(() => {
    if (dailyData && dailyData.data && vehicleData) {
      const filteredData = dailyData.data
        .filter((dailyItem) =>
          vehicleData.data.some(
            (vehicle) =>
              vehicle.registrationNo === dailyItem.vehicle.registrationNo,
          ),
        )
        .map((dailyItem) => ({
          ...dailyItem,
          id: dailyItem.id, // Ensure id is mapped correctly
        }));
      setVehicles(filteredData);
    }
  }, [dailyData, vehicleData]);

  useEffect(() => {
    const totalSelected = vehicles.reduce(
      (acc, e) => acc + (e?.completionPercentage > 0 ? 1 : 0),
      0,
    );
    setSelectedCount(totalSelected);
  }, [vehicles]);

  const handleVehicleClick = (vehicle) => {
    navigate('/daily-maintenance/checklist', {
      state: {
        registrationNo: vehicle.vehicle.registrationNo,
        status: status,
      },
    });
  };

  if (dailyLoading || VehiclesLoading) {
    return <p>Loading vehicles...</p>;
  }

  if (dailyError || vehicleError) {
    return (
      <div>Error occurred while fetching data. Please try again later.</div>
    );
  }

  return (
    <>
      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
        <div className="w-full">
          <label className="mb-3 block text-lg  font-bold text-black dark:text-white">
            NON MAINTAINED VEHICLES: {station?.label}
          </label>
        </div>
      </div>

      <div className="h-[570px] rounded-sm border border-stroke bg-white mb-2 px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto h-[530px] overflow-y-auto">
          <table className="w-full table-auto">
            <thead>
              <tr>
                <th
                  className="border-b py-2 text-left"
                  onClick={() => handleSort('id')}
                >
                  <span className="flex items-center">
                    ID{' '}
                    <span className="ml-1">
                      {sortBy === 'id' ? (
                        sortOrder === 'asc' ? (
                          <FaSortUp />
                        ) : (
                          <FaSortDown />
                        )
                      ) : (
                        <FaSort />
                      )}
                    </span>
                  </span>
                </th>
                <th className="border-b py-2 text-left">
                  Vehicle Registration No
                </th>
                <th className="border-b py-2 text-left">
                  Percentage Inspected
                </th>
                <th className="border-b py-2 text-left">Remarks</th>
                <th className="border-b py-2 text-left">Status</th>
                <th className="border-b py-2 text-left">Approval</th>
                <th className="border-b py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((e, i) => (
                <tr
                  key={i}
                  className={`cursor-pointer hover:font-semibold ${e.totalFaults > 0 ? 'bg-red-100' : 'bg-white'}`}
                  onClick={() => handleVehicleClick(e)}
                >
                  <td className="border-b py-2">{e.id}</td>
                  <td className="border-b py-2">{e.vehicle.registrationNo}</td>
                  <td className="border-b py-2">
                    {e.completionPercentage?.toFixed(2)}%
                  </td>
                  <td
                    className={`border-b text-center py-2 ${e.totalFaults > 0 ? 'text-red-500 font-bold' : 'text-black font-medium'}`}
                  >
                    {e.totalFaults}
                  </td>
                  <td className="border-b py-2">
                    {e.completionPercentage?.toFixed(2)}%
                  </td>
                  <td className="border-b py-2">{e.dailyCLData}</td>
                  <td className="border-b py-2">
                    {e.completionPercentage > 0 && (
                      <button
                        className="rounded border border-stroke py-1 px-4 font-medium text-black dark:border-strokedark dark:text-white transition duration-150 ease-in-out hover:border-gray dark:hover:border-white"
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate('/daily-maintenance/view', {
                            state: {
                              registrationNo: e.vehicle.registrationNo,
                              status: e.vehicle.status,
                            },
                          });
                        }}
                      >
                        View
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mr-5">
        <div className="flex justify-end gap-4.5">
          <button
            className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black dark:border-strokedark dark:text-white transition duration-150 ease-in-out hover:border-gray dark:hover:border-white"
            type="button"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded shadow-lg p-8 w-96">
            <p>{modalMessage}</p>
            <div className="mt-4 flex justify-end">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <PaginationComponent
        isLoading={VehiclesLoading}
        isError={vehicleError}
        data={vehicleData}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
      />
    </>
  );
};

export default DailyMaintenanceTable;
