import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { useSelector } from 'react-redux';
import useToast from '../../hooks/useToast';
import { useGetDailyReportsQuery } from '../../services/dailySlice';
import {
  useGetVehicleByCompanyIdQuery,
  useGetVehicleInfoQuery,
} from '../../services/vehicleSlice'; // Import the vehicleSlice query
import { useGetAllMaintenanceTeamsQuery } from '../../services/maintenanceTeamSlice';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa6';

function DailyMaintenanceRestrictedTable() {
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

  const {
    data: vehicleData,
    isError: vehicleError,
    isLoading: vehicleLoading,
    refetch,
  } = useGetVehicleByCompanyIdQuery({
    companyId: user?.companyId,
    page,
    limit,
    sortBy,
    sortOrder,
    station: user?.station,
  });

  const { data: dailyData, isLoading: dailyLoading } = useGetDailyReportsQuery({
    userId: user.id,
    station: station?.value,
  });

  const [selectedCount, setSelectedCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
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
      // Filter dailyData based on vehicleData's registrationNo
      const filteredData = dailyData.data.filter((dailyItem) =>
        vehicleData.data.some(
          (vehicle) =>
            vehicle.registrationNo === dailyItem.vehicle.registrationNo,
        ),
      );
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
  console.log('Data-=---', dailyData?.data);
  return (
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
              <th className="border-b py-2 text-left">Percentage Inspected</th>
              <th className="border-b py-2 text-left">Faults</th>
              <th className="border-b py-2 text-left">Status</th>
              <th className="border-b py-2 text-left">Stats</th>
              {/* <th className="border-b py-2 text-left">Maintained Status</th> */}
              <th className="border-b py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dailyData?.data
              .filter((item) => item.id > 0)
              .map((e, i) => (
                <tr
                  key={i}
                  className={`cursor-pointer hover:font-semibold ${e.totalFaults > 0 ? 'bg-red-100' : 'bg-green-100'}`}
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
                  <td className="border-b py-2">{e?.status}</td>
                  <td className="border-b py-2">
                    {e?.totalFaults > 0 ? 'NOT-MAINTAINED' : 'MAINTAINED'}
                  </td>

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
  );
}

export default DailyMaintenanceRestrictedTable;
