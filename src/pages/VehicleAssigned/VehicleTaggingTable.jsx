import React, { useEffect, useRef } from 'react';
import { CiEdit } from 'react-icons/ci';
import { IoEyeOutline } from 'react-icons/io5';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import useToast from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  useDeleteTaggedDriverMutation,
  useGetTagDriversQuery,
} from '../../services/tagDriverSlice';
import Loader from '../../common/Loader';
import { FaSearch, FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { GrNext, GrPrevious } from 'react-icons/gr';
import { FcNext, FcPrevious } from 'react-icons/fc';
import PaginationComponent from '../../components/Pagination/Pagination';
import DeleteModal from '../../components/DeleteModal';

const VehicleTaggingTable = ({ searchTerm, setSortedDataIndex }) => {
  const { showErrorToast, showSuccessToast } = useToast();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [DeleteTaggedDriver] = useDeleteTaggedDriverMutation();
  const [deleteId, setDeleteId] = useState(null);

  const tableRef = useRef(null);

  const {
    data,
    isError,
    isLoading: isTaggedVehicleLoading,
    refetch,
  } = useGetTagDriversQuery({
    companyId: user?.companyId,
    page,
    limit,
    searchTerm,
    sortBy,
    sortOrder,
    station: user?.station,
  });

  useEffect(() => {
    setPage(1);
    refetch();
  }, [searchTerm, sortBy, sortOrder]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const [processedData, setProcessedData] = useState([]);

  useEffect(() => {
    let d = data?.data.map((item, index) => ({
      ...item,
      index: index + 1,
    }));
    setProcessedData(d);
  }, [data]);

  let [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    let d = processedData?.slice().sort((a, b) => {
      if (sortBy === 'sNo') {
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
    setSortedDataIndex(d);
  }, [processedData]);

  const openModal = (i) => {
    setUserIdToDelete(i);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const onDelete = () => {};
  // Function to handle deletion
  // const onDelete = () => {};

  // const DeleteTaggedDrivers = async (id) => {
  //   try {
  //     await DeleteTaggedDriver(id).unwrap();
  //     showSuccessToast('Tagged Driver Deleted Successfully!');
  //   } catch (err) {
  //     console.log(err);
  //     showErrorToast(`An error has occurred while deleting tagged driver`);
  //   }
  // };

  const toast = useToast();

  if (isTaggedVehicleLoading) return <Loader />;
  if (isError) return <div>Error occurred while fetching Tag Drivers.</div>;
  if (!sortedData?.length)
    return (
      <div>
        <center>
          <h4 className="font-semibold">No Drivers Tagged!</h4>
        </center>
      </div>
    );

    console.log("&&&&&&&&&&&&&&&& SortedData", sortedData);
  return (
    <>
      <div className="h-[570px] rounded-sm border border-stroke bg-white my-2 px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto h-[530px] overflow-y-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th
                  className="w-auto flex-1 py-4 px-4 text-black dark:text-white cursor-pointer"
                  onClick={() => handleSort('sNo')}
                >
                  <span className="flex items-center">
                    S. No{' '}
                    <span>
                      {sortBy === 'sNo' ? (
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
                  onClick={() => handleSort('driverName')}
                >
                  <span className="flex items-center">
                    Driver Name{' '}
                    <span>
                      {sortBy === 'driverName' ? (
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
                  onClick={() => handleSort('vehicleId')}
                >
                  <span className="flex items-center">
                    Vehicle Number{' '}
                    <span>
                      {sortBy === 'vehicleId' ? (
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
                <th className="w-auto flex-1 py-4 px-3 text-center text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((e, i) => (
                <tr key={i}>
                  <td className="border-b border-[#eee] py-4 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <p className="font-medium text-black dark:text-white">
                      {e.index}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e?.driverName}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e?.vehicleId}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e?.station}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center justify-center space-x-3.5">
                      <button
                        onClick={() => navigate(`view/${e.id}`)}
                        className="hover:text-primary"
                      >
                        <IoEyeOutline style={{ fontSize: '20px' }} />
                      </button>
                      <button
                        onClick={() => navigate(`update/${e.id}`)}
                        className="hover:text-primary"
                      >
                        <CiEdit style={{ fontSize: '20px' }} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(e?.id);
                          document.getElementById('delete_modal').showModal();
                        }}
                      >
                        <RiDeleteBinLine style={{ fontSize: '20px' }} />
                      </button>
                      <DeleteModal
                        deleteModule="Tagged Driver"
                        handleDelete={() => DeleteTaggedDriver(deleteId)}
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
        isLoading={isTaggedVehicleLoading}
        isError={isError}
        data={data}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
      />
    </>
  );
};

export default VehicleTaggingTable;
