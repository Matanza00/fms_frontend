import { CiEdit } from 'react-icons/ci';
import { IoEyeOutline } from 'react-icons/io5';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { respondPeriodicRequestSchema } from '../../utils/schemas';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { useSelector } from 'react-redux';
import Loader from '../../common/Loader';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import useToast from '../../hooks/useToast';
import {
  useGetPeriodicByCompanyIdQuery,
  useUpdatePeriodicRequestMutation,
} from '../../services/periodicSlice';
import PeriodicPaginationComponent from '../../components/Pagination/periodicPagination';
import {
  stationOptions,
  periodicThreshold,
  vendorType,
  indoorVendorName,
} from '../../constants/Data';
import { MdOutlineDoneOutline } from 'react-icons/md';

const PeriodicApprovalTable = ({ searchTerm, setSortedDataIndex }) => {
  const navigate = useNavigate();
  const { showErrorToast, showSuccessToast } = useToast();
  const { user } = useSelector((state) => state?.auth);
  const [formValues, setFormValues] = useState({
    ...respondPeriodicRequestSchema,
  });

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const [filterType, setFilterType] = useState('date');
  const [filterDate, setFilterDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState(null);
  const [periodicTypeFilter, setPeriodicTypeFilter] = useState(null);
  const [stationFilter, setStationFilter] = useState(null);
  const [indoorVendorFilter, setIndoorVendorFilter] = useState(null); // New filter state
  const [selectedRows, setSelectedRows] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const tableRef = useRef(null);
  const {
    data: periodicData,
    isLoading: isPeriodicLoading,
    error,
    isError,
    refetch,
  } = useGetPeriodicByCompanyIdQuery({
    companyId: user?.companyId,
    page,
    limit,
    searchTerm,
    sortBy,
    sortOrder,
    statusFilter,
    periodicTypeFilter,
    stationFilter,
    indoorVendorFilter, // Pass the new filter state to the query
  });

  useEffect(() => {
    setPage(1);
    setSelectedRows([]); // Clear selected rows
    refetch();
  }, [
    searchTerm,
    sortBy,
    sortOrder,
    statusFilter,
    periodicTypeFilter,
    stationFilter,
    indoorVendorFilter, // Refetch when indoorVendorFilter changes
  ]);

  let [sortedData, setSortedData] = useState([]);
  useEffect(() => {
    console.log('Applying filters:');
    console.log('Status Filter:', statusFilter);
    console.log('Periodic Type Filter:', periodicTypeFilter);
    console.log('Station Filter:', stationFilter);
    console.log('Indoor Vendor Filter:', indoorVendorFilter);

    if (!!periodicData?.data?.length) {
      let d = periodicData?.data?.slice().sort((a, b) => {
        if (sortOrder === 'asc') {
          return a[sortBy] < b[sortBy] ? -1 : 1;
        } else {
          return a[sortBy] > b[sortBy] ? -1 : 1;
        }
      });

      if (filterDate) {
        d = filterDataByDate(filterType, filterDate, d);
      }

      if (statusFilter) {
        d = d.filter(
          (item) =>
            item.status &&
            item.status.toLowerCase() === statusFilter.toLowerCase(),
        );
      }

      if (periodicTypeFilter) {
        d = d.filter(
          (item) =>
            item.periodicType &&
            item.periodicType.job.toLowerCase() ===
              periodicTypeFilter.toLowerCase(),
        );
      }

      if (stationFilter) {
        d = d.filter(
          (item) =>
            item.station &&
            item.station.toLowerCase() === stationFilter.toLowerCase(),
        );
      }

      if (indoorVendorFilter && indoorVendorFilter !== '') {
        d = d.filter(
          (item) =>
            item.indoorVendorName &&
            item.indoorVendorName.toLowerCase() ===
              indoorVendorFilter.toLowerCase(),
        );
      }
      if (indoorVendorFilter && indoorVendorFilter !== '') {
        d = d.filter(
          (item) =>
            item.indoorVendorName &&
            item.indoorVendorName.toLowerCase() ===
              indoorVendorFilter.toLowerCase(),
        );
      }

      setSortedData(d);
      setSortedDataIndex(d);
    }
  }, [
    periodicData,
    sortBy,
    sortOrder,
    filterDate,
    statusFilter,
    periodicTypeFilter,
    stationFilter,
    indoorVendorFilter,
  ]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const [UpdatePeriodicRequest, { isLoading: updateLoading }] =
    useUpdatePeriodicRequestMutation();

  const handleStatusUpdate = async (id, value) => {
    const formData = {
      ...formValues,
      id: parseInt(id), // Ensure ID is included in the payload and is an integer
      status: value, // Ensure status is included in the payload
    };

    try {
      await UpdatePeriodicRequest({ id, formData }).unwrap();
      refetch();
      showSuccessToast('Periodic Status Updated!');
    } catch (err) {
      console.log(err);
      showErrorToast('An error has occurred while Updating Status');
    }
  };

  const handleRowSelection = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const handleSelectAll = () => {
    if (selectedRows.length === sortedData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(sortedData.map((item) => item.id));
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    try {
      await Promise.all(
        selectedRows.map((id) =>
          UpdatePeriodicRequest({ id: id, formData: { status } }).unwrap(),
        ),
      );
      refetch();
      showSuccessToast(`Selected Periodics have been ${status}!`);
      setSelectedRows([]);
    } catch (err) {
      console.log(err);
      showErrorToast('An error has occurred while updating statuses');
    }
  };

  const filterDataByDate = (type, date, data) => {
    let filtered = [...data];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (type === 'date') {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.created_at);
        return (
          itemDate.getDate() === day &&
          itemDate.getMonth() + 1 === month &&
          itemDate.getFullYear() === year
        );
      });
    } else if (type === 'month') {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.created_at);
        return (
          itemDate.getMonth() + 1 === month && itemDate.getFullYear() === year
        );
      });
    } else if (type === 'year') {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.created_at);
        return itemDate.getFullYear() === year;
      });
    }

    return filtered;
  };

  const statusOptions = [
    { value: '', label: 'All' },
    { value: 'APPROVED', label: 'APPROVED' },
    { value: 'REJECTED', label: 'REJECTED' },
    { value: 'PENDING', label: 'PENDING' },
    { value: 'COMPLETED', label: 'COMPLETED' },
  ];

  const periodicTypeOptions = [
    { value: '', label: 'All' },
    // Add more periodic type options dynamically or statically
  ];

  if (periodicData?.data) {
    periodicData.data.forEach((item) => {
      if (
        item.periodicType &&
        !periodicTypeOptions.find(
          (option) => option.value === item.periodicType.job,
        )
      ) {
        periodicTypeOptions.push({
          value: item.periodicType.job,
          label: item.periodicType.job,
        });
      }
    });
  }

  const indoorVendorOptions = [
    { value: '', label: 'All' },
    // Add more indoor vendor options dynamically or statically
  ];

  if (periodicData?.data) {
    periodicData.data.forEach((item) => {
      if (
        item.indoorVendorName &&
        !indoorVendorOptions.find(
          (option) => option.value === item.indoorVendorName,
        )
      ) {
        indoorVendorOptions.push({
          value: item.indoorVendorName,
          label: item.indoorVendorName,
        });
      }
    });
  }

  let adminRole = user?.Role?.roleName === 'companyAdmin';
  let regionalRole = user?.Role?.roleName === 'regionalAdmin';
  let statusRole =
    user?.Role?.roleName === 'companyAdmin' ||
    user?.Role?.roleName === 'Maintenance Admin';

  console.log('periodicData ----->', periodicData);
  const handleDateChange = (date, type) => {
    setFilterType(type);
    setFilterDate(date);
  };

  return (
    <>
      <div className="mb-4 mt-4">
        <div className="flex flex-wrap space-x-4">
          <div className="flex-1 min-w-[150px]">
            <DatePicker
              selected={filterDate}
              onChange={(date) => handleDateChange(date, 'date')}
              dateFormat="yyyy-MM-dd"
              className="p-2 border rounded w-full"
              placeholderText="Select Date"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <DatePicker
              selected={filterDate}
              onChange={(date) => handleDateChange(date, 'month')}
              dateFormat="MM/yyyy"
              showMonthYearPicker
              className="p-2 border rounded w-full"
              placeholderText="Select Month"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <DatePicker
              selected={filterDate}
              onChange={(date) => handleDateChange(date, 'year')}
              dateFormat="yyyy"
              showYearPicker
              className="p-2 border rounded w-full"
              placeholderText="Select Year"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <Select
              options={statusOptions}
              onChange={(selectedOption) =>
                setStatusFilter(selectedOption.value || null)
              }
              className="ml-2 border rounded w-full"
              placeholder="Status"
            />
          </div>
          <div className="flex-1 min-w-[150px]">
            <Select
              options={periodicTypeOptions}
              onChange={(selectedOption) =>
                setPeriodicTypeFilter(selectedOption.value || null)
              }
              className="ml-1 border rounded w-full"
              placeholder="Periodic Type"
            />
          </div>
          {statusRole && (
            <div className="flex-1 min-w-[150px]">
              <Select
                options={stationOptions}
                onChange={(selectedOption) =>
                  setStationFilter(selectedOption.value || null)
                }
                className="ml-1 border rounded w-full"
                placeholder="Station"
              />
            </div>
          )}
          <div className="flex-1 min-w-[150px]">
            <Select
              options={indoorVendorName}
              onChange={(selectedOption) =>
                setIndoorVendorFilter(selectedOption.value || null)
              }
              className="ml-1 border rounded w-full"
              placeholder="Indoor Vendor"
            />
          </div>
        </div>
        {adminRole && (
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => handleBulkStatusUpdate('APPROVED')}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Approve Selected
            </button>
            <button
              onClick={() => handleBulkStatusUpdate('REJECTED')}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Reject Selected
            </button>
          </div>
        )}
      </div>
      <div className="h-[570px] rounded-sm border border-stroke bg-white my-2 px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto h-[530px] overflow-y-auto">
          <table ref={tableRef} className="w-full table-auto ">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                {adminRole && (
                  <th className="py-4 px-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.length === sortedData.length}
                      onChange={handleSelectAll}
                    />
                  </th>
                )}
                <th
                  className="flex-1 py-4 px-4 text-black dark:text-white cursor-pointer abc"
                  onClick={() => handleSort('id')}
                  style={{ minWidth: '140px' }}
                >
                  <span className="flex items-center">
                    Request ID{' '}
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
                  className="w-auto flex-1 py-4 px-4 text-black dark:text-white cursor-pointer"
                  onClick={() => handleSort('registrationNo')}
                >
                  <span className="flex items-center">
                    Vehicle No.{' '}
                    <span className="ml-1">
                      {sortBy === 'registrationNo' ? (
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
                  className="w-auto flex-1 py-4 px-4 text-black dark:text-white cursor-pointer"
                  onClick={() => handleSort('periodicType')}
                >
                  <span className="flex items-center">Periodic Type </span>
                </th>
                <th
                  className="w-auto flex-1 py-4 px-4 text-black dark:text-white cursor-pointer"
                  onClick={() => handleSort('runningDifference')}
                >
                  <span className="flex items-center">
                    Running Difference{' '}
                    <span className="ml-1">
                      {sortBy === 'runningDifference' ? (
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
                  className="w-auto flex-1 py-4 px-4 text-black dark:text-white cursor-pointer"
                  onClick={() => handleSort('status')}
                >
                  <span className="flex items-center">
                    Due Status{' '}
                    <span className="ml-1">
                      {sortBy === 'status' ? (
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
                  className="w-auto flex-1 py-4 px-4 text-black dark:text-white cursor-pointer"
                  onClick={() => handleSort('amount')}
                >
                  <span className="flex items-center">
                    Amount{' '}
                    <span className="ml-1">
                      {sortBy === 'amount' ? (
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
                  className="w-auto flex-1 py-4 px-4 text-black dark:text-white cursor-pointer"
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
                <th
                  className="w-auto flex-1 py-4 px-4 text-black dark:text-white cursor-pointer"
                  onClick={() => handleSort('dueStatus')}
                >
                  <span className="flex items-center">
                    Status{' '}
                    <span className="ml-1">
                      {sortBy === 'status' ? (
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
                {adminRole && (
                  <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                    Approval
                  </th>
                )}

                <th className="w-auto flex items-center justify-center py-4 px-3 text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.length > 0 ? (
                sortedData.map((e, key) => (
                  <tr className="py-3" key={key}>
                    {adminRole && (
                      <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(e.id)}
                          onChange={() => handleRowSelection(e.id)}
                        />
                      </td>
                    )}
                    <td className="border-b border-[#eee] py-4 px-10 dark:border-strokedark">
                      <p className="font-medium text-black dark:text-white">
                        {e?.id}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                      <p className="font-medium text-black dark:text-white">
                        {e?.registrationNo}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                      <p className="font-medium text-black dark:text-white">
                        {e?.periodicType?.job}
                      </p>
                    </td>

                    <td className="border-b border-[#eee] py-4 px-15 dark:border-strokedark  ">
                      <p className="font-medium text-black dark:text-white">
                        {e?.runningDifference}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark ">
                      <p className="font-medium text-black dark:text-white">
                        {e?.dueStatus}
                      </p>
                    </td>

                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark ">
                      <p className="font-medium text-black dark:text-white">
                        {e?.amount}
                      </p>
                    </td>

                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                      <p className="font-medium text-black dark:text-white">
                        {e?.station}
                      </p>
                    </td>

                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                      <p className="font-medium text-black dark:text-white uppercase">
                        {e?.status}
                      </p>
                    </td>

                    {adminRole && (
                      <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                        {e?.status.toLowerCase() !== 'completed' ? (
                          <div className="flex items-center justify-center space-x-3.5">
                            <details className="dropdown dropdown-bottom ">
                              <summary className="m-1 btn h-[30px] min-h-[30px] text-sm dark:text-white dark:bg-slate-700 dark:border-slate-700 dark:hover:bg-opacity-70 transition duration-150 ease-in-out rounded-md">
                                <HiOutlineDotsHorizontal />
                              </summary>
                              <ul className="p-2  shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-24  text-black">
                                <li
                                  onClick={() =>
                                    handleStatusUpdate(e?.id, 'Approved')
                                  }
                                >
                                  <a>Approve</a>
                                </li>
                                <li
                                  onClick={() =>
                                    handleStatusUpdate(e?.id, 'Rejected')
                                  }
                                >
                                  <a>Reject</a>
                                </li>
                                <li
                                  onClick={() =>
                                    handleStatusUpdate(e?.id, 'Pending')
                                  }
                                >
                                  <a>Pending</a>
                                </li>
                              </ul>
                            </details>
                          </div>
                        ) : (
                          <div className="h-[30px] min-h-[30px]"></div> // Placeholder for alignment
                        )}
                      </td>
                    )}

                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex items-center justify-center space-x-3.5">
                        <button
                          onClick={() =>
                            navigate(`view/${e?.id}`, { state: { data: e } })
                          }
                          className="hover:text-primary"
                          title="View"
                        >
                          <IoEyeOutline style={{ fontSize: '20px' }} />
                        </button>
                        {(e?.status.toLowerCase() === 'pending' ||
                          e?.status.toLowerCase() === 'rejected') && (
                          <button
                            onClick={() =>
                              navigate(`update/${e?.id}`, {
                                state: { data: e },
                              })
                            }
                            className="hover:text-primary"
                            title="Update"
                          >
                            <CiEdit style={{ fontSize: '20px' }} />
                          </button>
                        )}
                        {e?.status.toLowerCase() === 'approved' && (
                          <button
                            onClick={() =>
                              navigate(`complete/${e?.id}`, {
                                state: { data: e },
                              })
                            }
                            className="hover:text-primary"
                            title="Complete"
                          >
                            <MdOutlineDoneOutline
                              style={{ fontSize: '20px' }}
                            />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="text-center py-4">
                    No Periodic Records Found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <PeriodicPaginationComponent
        isLoading={isPeriodicLoading}
        isError={isError}
        data={periodicData}
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
      />
    </>
  );
};

export default PeriodicApprovalTable;
