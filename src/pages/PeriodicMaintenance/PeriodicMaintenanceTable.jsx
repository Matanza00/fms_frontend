import { CiEdit } from 'react-icons/ci';
import { IoEyeOutline } from 'react-icons/io5';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

const PeriodicMaintenanceTable = () => {
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
    <div className="rounded-sm border border-stroke bg-white mb-2 px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
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
                Quantity
              </th>
              <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                Amount
              </th>
              {/* <th className="w-auto flex-1 py-4 px-3 text-black dark:text-white">
                Payment Type
              </th> */}
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PeriodicMaintenanceTable;
