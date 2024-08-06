import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CiEdit } from 'react-icons/ci';
import { IoEyeOutline } from 'react-icons/io5';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import {
  useGetAllMaintenanceTeamsQuery,
  useDeleteMaintenanceTeamMutation,
} from '../../services/maintenanceTeamSlice';
import Loader from '../../common/Loader';
import useToast from '../../hooks/useToast';
import PaginationComponent from '../../components/Pagination/Pagination';
import DeleteModal from '../../components/DeleteModal';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';

const MaintenanceTeamsTable = () => {
  const { showErrorToast, showSuccessToast } = useToast();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const { data, error, isLoading, refetch } = useGetAllMaintenanceTeamsQuery();
  const [deleteMaintenanceTeam] = useDeleteMaintenanceTeamMutation();
  // const [deleteId, setDeleteId] = useState(null);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const [processedData, setProcessedData] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (data) {
      let d = data.data.map((item, index) => ({
        ...item,
        index: index + 1,
      }));
      setProcessedData(d);
    }
  }, [data]);

  let [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    let d = processedData?.slice().sort((a, b) => {
      if (sortBy === 'index') {
        if (sortOrder === 'asc') {
          return a.index - b.index;
        } else {
          return b.index - a.index;
        }
      } else {
        if (sortOrder === 'asc') {
          return a[sortBy] < b[sortBy] ? -1 : 1;
        } else {
          return a[sortBy] > b[sortBy] ? -1 : 1;
        }
      }
    });
    setSortedData(d);
  }, [processedData, sortBy, sortOrder]);

  const handleDelete = async () => {
    try {
      await deleteMaintenanceTeam(deleteId).unwrap();
      showSuccessToast('Team deleted successfully!');
      setShowDeleteModal(false);
      refetch();
    } catch (err) {
      showErrorToast('Failed to delete the team. Please try again.');
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const closeModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  return (
    <DefaultLayout>
      <BreadcrumbNav
        pageName="Maintenance Teams"
        pageNameprev="Daily Maintenance" //show the name on top heading
        pagePrevPath="daily-maintenance" // add the previous path to the navigation
      />
      {isLoading ? (
        <Loader />
      ) : error ? (
        <div>Error occurred while fetching maintenance teams.</div>
      ) : !sortedData?.length ? (
        <div>
          <center>
            <h4 className="font-semibold">No Maintenance Teams Found!</h4>
          </center>
        </div>
      ) : (
        <>
          <div className="h-[570px] rounded-sm border border-stroke bg-white my-2 px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className="max-w-full overflow-x-auto h-[530px] overflow-y-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="bg-gray-2 text-left dark:bg-meta-4">
                    <th
                      className="w-auto flex-1 py-4 px-4 text-black dark:text-white cursor-pointer"
                      onClick={() => handleSort('index')}
                    >
                      <span className="flex items-center">
                        S. No{' '}
                        <span>
                          {sortBy === 'index' ? (
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
                    <th
                      className="w-auto flex-1 py-4 px-3 text-black dark:text-white cursor-pointer"
                      onClick={() => handleSort('station')}
                    >
                      <span className="flex items-center">
                        Station{' '}
                        <span>
                          {sortBy === 'station' ? (
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
                    <th
                      className="w-auto flex-1 py-4 px-3 text-black dark:text-white cursor-pointer"
                      onClick={() => handleSort('mto')}
                    >
                      <span className="flex items-center">
                        MTO{' '}
                        <span>
                          {sortBy === 'mto' ? (
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
                    <th
                      className="w-auto flex-1 py-4 px-3 text-black dark:text-white cursor-pointer"
                      onClick={() => handleSort('serviceManager')}
                    >
                      <span className="flex items-center">
                        Service Manager{' '}
                        <span>
                          {sortBy === 'serviceManager' ? (
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
                    <th
                      className="w-auto flex-1 py-4 px-3 text-black dark:text-white cursor-pointer"
                      onClick={() => handleSort('vehicles')}
                    >
                      <span className="flex items-center">
                        Vehicle Count{' '}
                        <span>
                          {sortBy === 'vehicles' ? (
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
                    <th className="w-auto flex-1 py-4 px-3 text-center text-black dark:text-white">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((team, i) => (
                    <tr key={i}>
                      <td className="border-b border-[#eee] py-4 px-4 pl-9 dark:border-strokedark xl:pl-11">
                        <p className="font-medium text-black dark:text-white">
                          {team.index}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                        <p className="font-medium text-black dark:text-white">
                          {team.station}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                        <p className="font-medium text-black dark:text-white">
                          {team?.mto?.username}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                        <p className="font-medium text-black dark:text-white">
                          {team?.serviceManager?.username}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                        <p className="font-medium text-black dark:text-white">
                          {team.teamVehicles.length}
                        </p>
                      </td>
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        <div className="flex items-center justify-center space-x-3.5">
                          <button
                            onClick={() => navigate(`view/${team.teamId}`)}
                            className="hover:text-primary"
                          >
                            <IoEyeOutline style={{ fontSize: '20px' }} />
                          </button>
                          <button
                            onClick={() => navigate(`update/${team.teamId}`)}
                            className="hover:text-primary"
                          >
                            <CiEdit style={{ fontSize: '20px' }} />
                          </button>
                          {/* <button
                            onClick={() => {
                              setDeleteId(team?.teamId);
                              document
                                .getElementById('delete_modal')
                                .showModal();
                            }}
                            className="hover:text-primary"
                          >
                            <RiDeleteBinLine style={{ fontSize: '20px' }} />
                          </button> */}

                          <DeleteModal
                            deleteModule="MaintenanceTeam"
                            // Id={e?.id}
                            handleDelete={() => deleteMaintenanceTeam(deleteId)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <PaginationComponent
            isLoading={isLoading}
            isError={error}
            data={data}
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
          />
        </>
      )}
      <DeleteModal
        showModal={showDeleteModal}
        handleClose={closeModal}
        handleConfirm={handleDelete}
      />
    </DefaultLayout>
  );
};

export default MaintenanceTeamsTable;
