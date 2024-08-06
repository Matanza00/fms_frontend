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
  useUpdateDailyRequestMutation,
  useUpdateDailyStatusMutation,
} from '../../services/dailySlice';
import { useGetVehicleByCompanyIdQuery } from '../../services/vehicleSlice';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import DailyMaintenanceRestrictedTable from './DailyMaintenanceRestrictedTable';

const DailyMaintenanceTable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showErrorToast, showSuccessToast } = useToast();

  const { user } = useSelector((state) => state.auth);
  const { station, status } = location.state || {};
  const { registrationNo } = location.state || {};
  const [page, setPage] = useState(100);
  const [limit, setLimit] = useState(1000);
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
  const [UpdateDailyStatus] = useUpdateDailyStatusMutation();

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
    refetch();
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

  const handleStatusUpdate = async (id, value) => {
    try {
      let _data = { status: value };
      await UpdateDailyStatus({ id: id, formData: _data }).unwrap();
      refetch();
      showSuccessToast('Daily Status Updated !');
    } catch (err) {
      console.log(err);
      showErrorToast('An error has occurred while Updating Status');
    }
  };
  const handleStatsUpdate = async (id, value) => {
    try {
      let _data = { stats: value };
      await UpdateDailyStatus({ id: id, formData: _data }).unwrap();
      refetch();
      showSuccessToast('Daily Stats Updated !');
    } catch (err) {
      console.log(err);
      showErrorToast('An error has occurred while Updating Status');
    }
  };

  let adminRole =
    user?.Role?.roleName === 'Maintenance Admin' ||
    user?.Role?.roleName === 'companyAdmin';
  let restrictedRole =
    user.Role.roleName === 'Maintenance Service Manager' ||
    user.Role.roleName === 'Maintenance MTO';

  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'APPROVED', label: 'APPROVED' },
    { value: 'REJECTED', label: 'REJECTED' },
    { value: 'PENDING', label: 'PENDING' },
  ];

  return (
    <>
      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
        <div className="w-full">
          <label className="mb-3 block text-lg  font-bold text-black dark:text-white">
            NON MAINTAINED VEHICLES:
          </label>
        </div>
      </div>
      {adminRole && (
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
                  <th className="border-b py-2 text-left">Faults</th>
                  <th className="border-b py-2 text-left">Status</th>
                  {adminRole && (
                    <th className="border-b py-2 text-left">Update Status</th>
                  )}
                  <th className="border-b py-2 text-left">Stats</th>
                  {/* <th className="border-b py-2 text-left">Maintained Status</th> */}
                  <th className="border-b py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles
                  .filter((item) => item.id > 0)
                  .map((e, i) => (
                    <tr
                      key={i}
                      className={`cursor-pointer hover:font-semibold ${e.totalFaults > 0 ? 'bg-red-100' : 'bg-green-100'}`}
                      onClick={() => handleVehicleClick(e)}
                    >
                      <td className="border-b py-2">{e.id}</td>
                      <td className="border-b py-2">
                        {e.vehicle.registrationNo}
                      </td>
                      <td className="border-b py-2">
                        {e.completionPercentage?.toFixed(2)}%
                      </td>
                      <td
                        className={`border-b text-center py-2 ${e.totalFaults > 0 ? 'text-red-500 font-bold' : 'text-black font-medium'}`}
                      >
                        {e.totalFaults}
                      </td>
                      <td className="border-b py-2">{e?.status}</td>

                      {adminRole && (
                        <td className="border-b py-2">
                          <div className="flex items-center justify-center space-x-3.5">
                            <details
                              className="dropdown dropdown-bottom"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <summary className="m-1 btn h-[30px] min-h-[30px] text-sm dark:text-white dark:bg-slate-700 dark:border-slate-700 dark:hover:bg-opacity-70 transition duration-150 ease-in-out rounded-md">
                                <HiOutlineDotsHorizontal />
                              </summary>
                              <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-24 text-black">
                                <li
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleStatusUpdate(e?.id, 'APPROVED');
                                  }}
                                >
                                  <a>Approve</a>
                                </li>
                                <li
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleStatusUpdate(e?.id, 'REJECTED');
                                  }}
                                >
                                  <a>Reject</a>
                                </li>
                                <li
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    handleStatusUpdate(e?.id, 'PENDING');
                                  }}
                                >
                                  <a>Pending</a>
                                </li>
                              </ul>
                            </details>
                          </div>
                        </td>
                      )}
                      <td className="border-b py-2">
                        {e?.totalFaults > 0 ? 'NOT-MAINTAINED' : 'MAINTAINED'}
                      </td>

                      {/* {adminRole && (
                      <td className="border-b py-2">
                        <div className="flex items-center justify-center space-x-3.5">
                          <details
                            className="dropdown dropdown-bottom"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <summary className="m-1 btn h-[30px] min-h-[30px] text-sm dark:text-white dark:bg-slate-700 dark:border-slate-700 dark:hover:bg-opacity-70 transition duration-150 ease-in-out rounded-md">
                              <HiOutlineDotsHorizontal />
                            </summary>
                            <ul className="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-24 text-black">
                              <li
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleStatsUpdate(e?.id, 'MAINTAINED');
                                }}
                              >
                                <a>Maintain</a>
                              </li>
                              <li
                                onClick={(event) => {
                                  event.stopPropagation();
                                  handleStatsUpdate(e?.id, 'NOT-MAINTAINED ');
                                }}
                              >
                                <a>Not-Maintain</a>
                              </li>
                            </ul>
                          </details>
                        </div>
                      </td>
                    )} */}
                      <td className="border-b py-2">
                        {e.completionPercentage > 0 && (
                          <button
                            className="rounded border border-stroke py-1 px-4 font-medium text-black dark:border-strokedark dark:text-white transition duration-150 ease-in-out hover:border-gray dark:hover:border-white"
                            onClick={(event) => {
                              event.stopPropagation();
                              navigate('/daily-maintenance/view', {
                                state: {
                                  registrationNo: e.vehicle.registrationNo,
                                  // status: e.vehicle.status,
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
      )}

      {restrictedRole && <DailyMaintenanceRestrictedTable />}

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
