import { CiEdit } from 'react-icons/ci';
import { IoEyeOutline } from 'react-icons/io5';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  useDeleteVehicleMutation,
  useGetVehicleByCompanyIdQuery,
} from '../../services/vehicleSlice';
import Loader from '../../common/Loader';
import useToast from '../../hooks/useToast';
import DeleteModal from '../../components/DeleteModal';
import { FaSearch } from 'react-icons/fa';
import { GrNext, GrPrevious } from 'react-icons/gr';
import {
  FcGenericSortingAsc,
  FcGenericSortingDesc,
  FcNext,
  FcPrevious,
} from 'react-icons/fc';
import PaginationComponent from '../../components/Pagination/Pagination';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';
import html2canvas from 'html2canvas';

const VehicleTable = ({ searchTerm, setSortedDataIndex }) => {
  const navigate = useNavigate();
  const { showErrorToast, showSuccessToast } = useToast();
  const { user } = useSelector((state) => state?.auth);
  const [DeleteVehicle] = useDeleteVehicleMutation();
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
    isLoading: isVehiclesLoading,
    refetch,
  } = useGetVehicleByCompanyIdQuery({
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

  const deleteVehicle = async (id) => {
    try {
      await DeleteVehicle(id).unwrap();
      showSuccessToast('Vehicle Deleted Successfully!');
    } catch (err) {
      console?.log(err);
      showErrorToast(`An error has occurred while deleting vehicle`);
    }
  };

  if (isVehiclesLoading) return <Loader />;
  if (isError) return <div>Error occurred while fetching vehicles.</div>;
  if (!sortedData?.length)
    return (
      <div>
        <center>
          <h4 className="font-semibold">No Vehicles Found!</h4>
        </center>
      </div>
    );
  let adminRole = user?.Role?.roleName === 'companyAdmin';

  return (
    <>
      <div className="h-[570px] rounded-sm border border-stroke bg-white my-2 px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
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
                  className="w-auto flex-1 py-4 px-4 text-black dark:text-white cursor-pointer"
                  onClick={() => handleSort('registrationNo')}
                >
                  <span className="flex items-center">
                    Reg No.{' '}
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
                  onClick={() => handleSort('oddometerReading')}
                >
                  <span className="flex items-center">
                    Oddometer{' '}
                    <span className="ml-1">
                      {sortBy === 'oddometerReading' ? (
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
                  onClick={() => handleSort('make')}
                >
                  <span className="flex items-center">
                    Make{' '}
                    <span className="ml-1">
                      {sortBy === 'make' ? (
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
                  onClick={() => handleSort('model')}
                >
                  <span className="flex items-center">
                    Model{' '}
                    <span className="ml-1">
                      {sortBy === 'model' ? (
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
                  onClick={() => handleSort('type')}
                >
                  <span className="flex items-center">
                    Type{' '}
                    <span className="ml-1">
                      {sortBy === 'type' ? (
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
                  onClick={() => handleSort('size')}
                >
                  <span className="flex items-center">
                    Size{' '}
                    <span className="ml-1">
                      {sortBy === 'size' ? (
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
                  onClick={() => handleSort('region')}
                >
                  <span className="flex items-center">
                    Region{' '}
                    <span className="ml-1">
                      {sortBy === 'region' ? (
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
                  onClick={() => handleSort('subRegion')}
                >
                  <span className="flex items-center">
                    Subregion{' '}
                    <span className="ml-1">
                      {sortBy === 'subRegion' ? (
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

                <th className="px-4 py-2 text-center text-black dark:text-white">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData?.map((e, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] px-1 py-2 dark:border-strokedark xl:pl-11">
                    <p className="font-medium text-black dark:text-white">
                      {e?.id}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark xl:pl-11">
                    <p className="font-medium text-black dark:text-white">
                      {e?.registrationNo}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark xl:pl-11">
                    <p className="font-medium text-black dark:text-white">
                      {e?.oddometerReading} kms
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e?.make}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark ">
                    <p className="font-medium text-black dark:text-white">
                      {e?.model}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e?.type}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e?.size}
                    </p>
                  </td>

                  <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e?.region}
                    </p>
                  </td>

                  <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e?.subRegion}
                    </p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e?.station}
                    </p>
                  </td>

                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <div className="flex items-center justify-center space-x-3.5">
                      <button
                        onClick={() => navigate(`view/${e?.registrationNo}`)}
                        className="hover:text-primary"
                      >
                        <IoEyeOutline style={{ fontSize: '20px' }} />
                      </button>
                      {adminRole && (
                        <button
                          onClick={() =>
                            navigate(`update/${e?.registrationNo}`)
                          }
                          className="hover:text-primary"
                        >
                          <CiEdit style={{ fontSize: '20px' }} />
                        </button>
                      )}
                      {/* Open modal on delete button click */}
                      {adminRole && (
                        <button
                          onClick={() => {
                            document.getElementById('delete_modal').showModal();
                            setDeleteId(e?.id);
                          }}
                          className="hover:text-primary"
                        >
                          <RiDeleteBinLine style={{ fontSize: '20px' }} />
                        </button>
                      )}

                      <DeleteModal
                        deleteModule="Vehicle"
                        Id={e?.id}
                        handleDelete={() => deleteVehicle(deleteId)}
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
        isLoading={isVehiclesLoading}
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

export default VehicleTable;
