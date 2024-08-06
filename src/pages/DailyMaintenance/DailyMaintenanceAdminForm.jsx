import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { useSelector } from 'react-redux';
import useToast from '../../hooks/useToast';
import {
  useGetAllDailyReportsQuery,
  useUpdateDailyRequestMutation,
  useGetChecklistDataQuery,
  useUpdateDailyStatusMutation,
} from '../../services/dailySlice';

import { useGetVehicleInfoQuery } from '../../services/vehicleSlice'; // Import the vehicleSlice query
import { useGetAllMaintenanceTeamsQuery } from '../../services/maintenanceTeamSlice';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';
import { formatDateAndTime } from '../../utils/helpers';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';

const DailyMaintenanceAdminForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showErrorToast, showSuccessToast } = useToast();

  const { user } = useSelector((state) => state.auth);
  const { station, status } = location.state || {};

  const { data: vehicleData, isLoading: vehicleLoading } =
    useGetVehicleInfoQuery(status);

  const { data: dailyData, isLoading: dailyLoading } =
    useGetAllDailyReportsQuery({
      station: station?.value,
    });
  const { data: dailyStatus, isLoading: DailyLoading } =
    useGetChecklistDataQuery();
  console.log('dailyStatus', dailyStatus);

  const [vehicles, setVehicles] = useState([]);
  const [selectedCount, setSelectedCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [UpdateDailyStatus] = useUpdateDailyStatusMutation();

  useEffect(() => {
    if (dailyData && dailyData.data && vehicleData) {
      // Filter dailyData based on vehicleData's registrationNo
      const filteredData = dailyData.data.filter((dailyItem) =>
        vehicleData.data.some(
          (vehicle) =>
            vehicle.registrationNo === dailyItem.vehicle.registrationNo,
        ),
      );
      console.log('first', filteredData);
      console.log('Daily', dailyData);
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

  const handleStatusUpdate = async (id, value) => {
    try {
      let _data = { status: value };
      await UpdateDailyStatus({ id: id, formData: _data }).unwrap();
      // refetch();
      showSuccessToast('Fuel Status Updated !');
    } catch (err) {
      console.log(err);
      showErrorToast('An error has occurred while Updating Status');
    }
  };

  const handleVehicleClick = (vehicle) => {
    navigate('/daily-maintenance/checklist', {
      state: {
        registrationNo: vehicle.vehicle.registrationNo,
        status: status,
      },
    });
  };

  let adminRole =
    user?.Role?.roleName === 'Maintenance Admin' ||
    user?.Role?.roleName === 'companyAdmin';

  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'APPROVED', label: 'APPROVED' },
    { value: 'REJECTED', label: 'REJECTED' },
    { value: 'PENDING', label: 'PENDING' },
  ];
  console.log('vehicles', vehicles);
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-600">
        <BreadcrumbNav
          pageName="Daily Maintenance Form"
          pageNameprev="Daily Maintenance" //show the name on top heading
          pagePrevPath="daily-maintenance" // add the previous path to the navigation
        />
        <div className="gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-bold text-xl text-black dark:text-white">
                  Station Vehicles
                </h3>
              </div>
              <div className="p-7">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full">
                    <label className="mb-3 block text-lg underline font-bold text-black dark:text-white">
                      Vehicle in: {station?.label}
                    </label>
                  </div>
                </div>

                <div className="mb-5.5">
                  {dailyLoading || vehicleLoading ? (
                    <p>Loading vehicles...</p>
                  ) : (
                    <table className="min-w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="border-b py-2 text-left">
                            Vehicle Registration No
                          </th>
                          <th className="border-b py-2 text-left">
                            Percentage Inspected
                          </th>
                          <th className="border-b py-2 text-left">
                            Created at
                          </th>
                          <th className="border-b py-2 text-left">
                            Approval Status
                          </th>
                          {adminRole && (
                            <th className="border-b py-2 text-left">
                              Update Status
                            </th>
                          )}
                          <th className="border-b py-2 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {vehicles.map((e, i) => (
                          <tr
                            key={i}
                            className="cursor-pointer hover:font-semibold"
                            onClick={() => handleVehicleClick(e)}
                          >
                            <td className="border-b py-2">
                              {e?.vehicle?.registrationNo}
                            </td>
                            <td className="border-b py-2">
                              {e?.completionPercentage?.toFixed(2)}%
                            </td>
                            <td className="border-b py-2">
                              {formatDateAndTime(e?.vehicle?.created_at)}
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
                              {e?.completionPercentage > 0 && (
                                <button
                                  className="rounded border border-stroke py-1 px-4 font-medium text-black dark:border-strokedark dark:text-white transition duration-150 ease-in-out hover:border-gray dark:hover:border-white"
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    navigate('/daily-maintenance/view', {
                                      state: {
                                        registrationNo:
                                          e?.vehicle?.registrationNo,
                                        status: e?.vehicle?.status,
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
                  )}
                </div>

                <div className="mb-5.5">
                  <p>
                    Percentage of vehicles with maintenance completed:{' '}
                    {((selectedCount / vehicles.length) * 100).toFixed(2)}%
                  </p>
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
              </div>
            </div>
          </div>
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
    </DefaultLayout>
  );
};

export default DailyMaintenanceAdminForm;
