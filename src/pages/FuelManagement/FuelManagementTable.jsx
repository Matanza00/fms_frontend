import { CiEdit } from 'react-icons/ci';
import { IoEyeOutline } from 'react-icons/io5';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

const FuelManagementTable = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [driversToShow, setDriversToShow] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pages, setPages] = useState([]);

  const handlePage = (e) => {
    setPage(parseInt(e.target.textContent));
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };
  const { showErrorToast, showSuccessToast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const {
    data,
    isError,
    error,
    isLoading: getFuelLoading,
  } = useGetFuelByCompanyIdQuery({
    companyId: user?.companyId,
    page,
    limit,
  });

  useEffect(() => {
    if (!getFuelLoading && !isError && data?.data.length > 0) {
      const totalPagesCount = Math.ceil(data.data.length / limit);
      setTotalPages(totalPagesCount);
      const updatedFuel = data.data.slice(startIndex, startIndex + limit);
      setDriversToShow(updatedFuel);
      const updatedPages = Array.from(
        { length: totalPagesCount },
        (_, i) => i + 1,
      );
      setPages(updatedPages);
      setIsLoading(false);
    }
  }, [getFuelLoading, isError, data, limit, startIndex]);

  const navigate = useNavigate();

  const onDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      // Delete the item from the data
      const newData = packageData.filter((item) => item.id !== id);
      setPackageData(newData);
    }
  };

  const tester = () => {
    console.log('trsr');
  };

  return (
    <>
      <div className="h-150 rounded-sm border border-stroke bg-white my-2 px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto h-[550px] overflow-y-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                  S.No
                </th>

                <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                  Vehicle No.
                </th>
                <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                  Driver
                </th>
                <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                  Supervisor
                </th>
                <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                  CC
                </th>
                <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                  Odometer
                </th>

                <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                  Rate
                </th>
                <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                  Litres
                </th>
                <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                  Amount
                </th>
                <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                  Payment Type
                </th>
                <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                  Region
                </th>
                <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                  Filling City
                </th>
                <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                  Filling Station
                </th>

                {/* <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                Reported At
              </th> */}
                <th className="w-auto flex items-center justify-center py-4 px-3 text-black dark:text-white">
                  Actions
                </th>
                <th className="w-auto flex-1 text-center py-4 px-3 text-black dark:text-white">
                  Status
                </th>
                {/* <th className="px-4 py-2 text-center text-black dark:text-white">
                Action
              </th> */}
              </tr>
            </thead>
            <tbody>
              {FuelData.map((e, key) => (
                <tr className="py-3" key={key}>
                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e.sno}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e.vehNo}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e.dName}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e.supervisor}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e.cc1}
                    </p>
                  </td>

                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e.odometer}
                    </p>
                  </td>

                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark ">
                    <p className="font-medium text-black dark:text-white">
                      {e.rate}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e.litres}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e.amount}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e.paymentType}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e.region}
                    </p>
                  </td>

                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e.fillingCity}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e.fillingStation}
                    </p>
                  </td>
                  {/* <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                  <p className="font-medium text-black dark:text-white">
                    {e.reported_at}
                  </p>
                </td> */}
                  <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                    <div className="flex items-center justify-center space-x-3.5">
                      <button
                        onClick={() => navigate(`view/${key}`)}
                        className="hover:text-primary"
                      >
                        <IoEyeOutline style={{ fontSize: '20px' }} />
                      </button>
                      <button
                        // onClick={() => navigate(`fuel-request/${i}`)}
                        // onClick={tester}
                        onClick={() => navigate(`update/${key}`)}
                        className="hover:text-primary"
                      >
                        <CiEdit style={{ fontSize: '20px' }} />
                      </button>

                      {/* Open modal on delete button click */}
                      <button
                        onClick={() =>
                          document.getElementById('delete_modal').showModal()
                        }
                      >
                        <RiDeleteBinLine style={{ fontSize: '20px' }} />
                      </button>
                      <dialog
                        id="delete_modal"
                        className="modal modal-bottom sm:modal-middle "
                      >
                        <div className="modal-box">
                          <h3 className="font-bold text-lg">
                            Delete Confirmation
                          </h3>
                          <p className="py-4">
                            Are you sure you want to delete this driver?
                          </p>
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button
                                type="submit"
                                className="btn transition-all duration-100 bg-red-600 hover:bg-red-800 min-w-7 w-20 text-white mr-3"
                              >
                                Delete
                              </button>
                              <button className="btn">Cancel</button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`badge badge-${e.status.toLowerCase()} ${
                        e.status === 'success'
                          ? 'badge-success'
                          : e.status === 'info'
                            ? 'badge-info text-black'
                            : 'badge-error'
                      }`}
                    >
                      {e.status === 'success'
                        ? 'Approved'
                        : e.status === 'info'
                          ? 'Pending'
                          : 'Declined'}
                    </span>
                    {/* You can customize the badge further using daisyUI's badge classes */}
                  </td>

                  {/* <td className="border px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      e.status === 'Approved'
                        ? 'bg-green-500 text-white'
                        : e.status === 'Pending'
                          ? 'bg-yellow-500 text-black'
                          : 'bg-red-500 text-white'
                    }`}
                  >
                    {e.status}
                  </span>
                </td> */}
                  {/* <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                  <p className="font-medium text-black dark:text-white">
                    {e.created_at}
                  </p>
                </td> */}

                  {/* <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                  <div className="flex items-center justify-center space-x-3.5">
                    <button
                      onClick={() => navigate(`view/${e.id}`)}
                      className="hover:text-primary"
                    >
                      <IoEyeOutline style={{ fontSize: '20px' }} />
                    </button>
                    <button
                      onClick={() => navigate(`form/${e.id}`)}
                      className="hover:text-primary"
                    >
                      <CiEdit style={{ fontSize: '20px' }} />
                    </button>
                    Open modal on delete button click
                    <button
                      onClick={() =>
                        document.getElementById('delete_modal').showModal()
                      }
                    >
                      <RiDeleteBinLine style={{ fontSize: '20px' }} />
                    </button>
                    <dialog
                      id="delete_modal"
                      className="modal modal-bottom sm:modal-middle "
                    >
                      <div className="modal-box">
                        <h3 className="font-bold text-lg">
                          Delete Confirmation
                        </h3>
                        <p className="py-4">
                          Are you sure you want to delete this driver?
                        </p>
                        <div className="modal-action">
                          <form method="dialog">
                            if there is a button in form, it will close the
                            modal
                            <button
                              type="submit"
                              className="btn transition-all duration-100 bg-red-600 hover:bg-red-800 min-w-7 w-20 text-white mr-3"
                            >
                              Delete
                            </button>
                            <button className="btn">Cancel</button>
                          </form>
                        </div>
                      </div>
                    </dialog>
                  </div>
                </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex justify-center">
        <div className=" w-full  flex flex-col justify-between ">
          {/* Container for Rows Per Page Dropdown and Page Numbers */}
          <div className="flex items-center justify-between px-4 py-2">
            {/* Rows Per Page Dropdown */}
            <div className="dropdown inline-block relative">
              <span>Rows per page:</span>
              <select
                value={limit}
                onChange={(e) => {
                  setPage(1);
                  setLimit(parseInt(e.target.value));
                }}
                className=" px-1 ml-2 text-sm border bg-slate-100 border-slate-500 rounded-sm dark:border-slate-600 dark:bg-boxdark dark:text-slate-300 "
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
            {/* Page Navigation Buttons */}
            <div className="flex items-center justify-end flex-grow space-x-2">
              {/* Previous Button */}
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className={`px-2 py-2 rounded-md ${
                  page === 1
                    ? 'bg-slate-200 text-gray-600 cursor-not-allowed  dark:bg-slate-600 dark:text-graydark '
                    : 'bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:bg-blue-600 '
                }`}
              >
                <FcPrevious />
              </button>
              {/* Selectable Page Numbers */}
              <div className="flex space-x-2">
                {/* Render first page */}
                {totalPages > 1 && (
                  <button
                    key={1}
                    onClick={handlePage}
                    className={`px-3 py-1 rounded-md ${
                      1 === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {1}
                  </button>
                )}
                {/* Render ellipsis if necessary */}
                {page > 4 && totalPages > 2 && (
                  <span className="px-3 py-1">...</span>
                )}
                {/* Render pages closer to the current page */}
                {pages
                  .filter(
                    (pageNumber) =>
                      pageNumber > page - 2 && pageNumber < page + 2,
                  )
                  .map((pageNumber) => (
                    <button
                      key={pageNumber}
                      onClick={handlePage}
                      className={`px-3 py-1 rounded-md ${
                        pageNumber === page
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  ))}
                {/* Render ellipsis if necessary */}
                {page < totalPages - 3 && totalPages > 2 && (
                  <span className="px-3 py-1">...</span>
                )}
                {/* Render last page */}
                {totalPages > 1 && (
                  <button
                    key={totalPages}
                    onClick={handlePage}
                    className={`px-3 py-1 rounded-md ${
                      totalPages === page
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {totalPages}
                  </button>
                )}
              </div>
              {/* Next Button */}
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className={`px-2 py-2 rounded-md ${
                  page === totalPages
                    ? 'bg-slate-200 text-gray-600 cursor-not-allowed dark:bg-slate-600 dark:text-graydark'
                    : 'bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:bg-blue-600'
                }`}
              >
                <FcNext />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FuelManagementTable;
