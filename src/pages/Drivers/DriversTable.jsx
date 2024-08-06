import React, { useRef } from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import { IoEyeOutline } from 'react-icons/io5';
import { CiEdit } from 'react-icons/ci';
import { RiDeleteBinLine } from 'react-icons/ri';
import { GrNext, GrPrevious } from 'react-icons/gr';
import { useSelector } from 'react-redux';
import useToast from '../../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CONSTANTS from '../../utils/constants';
import {
  useGetDriverByCompanyIdQuery,
  useDeleteDriverMutation,
} from '../../services/driverSlice';
import DeleteModal from '../../components/DeleteModal';
import Loader from '../../common/Loader';
import PaginationComponent from '../../components/Pagination/Pagination';
// import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import html2canvas from 'html2canvas';
// import htmlDocx from 'html-docx-js';

const DriversTable = ({ searchTerm, setSortedDataIndex }) => {
  const navigate = useNavigate();
  const { showErrorToast, showSuccessToast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const [DeleteDriver] = useDeleteDriverMutation();
  const [deleteId, setDeleteId] = useState(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const tableRef = useRef(null);

  const {
    data,
    isError,
    error,
    isLoading: isDriversLoading,
    refetch,
  } = useGetDriverByCompanyIdQuery({
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

  let [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    let d = data?.data.slice().sort((a, b) => {
      if (sortOrder === 'asc') {
        return a[sortBy] < b[sortBy] ? -1 : 1;
      } else {
        return a[sortBy] > b[sortBy] ? -1 : 1;
      }
    });

    setSortedData(d);
    setSortedDataIndex(d);
  }, [data]);

  if (isDriversLoading) return <Loader />;
  if (isError) return <div>Error occurred while fetching drivers.</div>;
  if (!sortedData?.length)
    return (
      <div>
        <center>
          <h4 className="font-semibold">No Drivers Found!</h4>
        </center>
      </div>
    );
  return (
    <>
      <div
        id="table-container"
        className="h-[570px] rounded-sm border border-stroke bg-white my-2 px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
      >
        <div className="max-w-full overflow-x-auto h-[530px] overflow-y-auto">
          <table ref={tableRef} className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th
                  className="w-auto flex-1 py-4 px-4 text-black dark:text-white cursor-pointer"
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
                <th
                  className="w-auto flex-1 py-4 px-3 text-black dark:text-white cursor-pointer"
                  onClick={() => handleSort('employeeId')}
                >
                  <span className="flex items-center">
                    Employee Id{' '}
                    <span className="ml-1">
                      {sortBy === 'employeeId' ? (
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
                  onClick={() => handleSort('name')}
                >
                  <span className="flex items-center">
                    Driver Name{' '}
                    <span className="ml-1">
                      {sortBy === 'name' ? (
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
                  onClick={() => handleSort('joiningDate')}
                >
                  <span className="flex items-center">
                    Joining Date{' '}
                    <span className="ml-1">
                      {sortBy === 'joiningDate' ? (
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
                    <span className="ml-1">
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
                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e?.id}
                    </p>
                  </td>

                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e?.employeeId}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e?.name}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e?.joiningDate.slice(0, 10)}
                    </p>
                  </td>

                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e.station}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center justify-center space-x-3.5">
                      <button
                        onClick={() => navigate(`view/${e?.id}`)}
                        className="hover:text-primary"
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PaginationComponent
        isLoading={isDriversLoading}
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

export default DriversTable;
