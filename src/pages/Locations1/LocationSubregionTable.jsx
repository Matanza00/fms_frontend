import { CiEdit } from 'react-icons/ci';
import { IoEyeOutline } from 'react-icons/io5';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';

const hardcodedUserData = [
  {
    id: 1,
    name: 'Northern Region',
    total_subregion: 3,
    created_at: '2024-04-01',
  },
  {
    id: 2,
    name: 'Southern Region',
    total_subregion: 2,
    created_at: '2024-04-01',
  },
  {
    id: 3,
    name: 'Eastern Region',
    total_subregion: 1,
    created_at: '2024-04-01',
  },
  {
    id: 4,
    name: 'Western Region',
    total_subregion: 1,
    created_at: '2024-04-01',
  },
  {
    id: 5,
    name: 'Central Region',
    total_subregion: 1,
    created_at: '2024-04-01',
  },
  // Add more hardcoded user data as needed
];

const LocationTable = () => {
  const navigate = useNavigate();

  const onDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      // Delete the item from the data
      const newData = packageData.filter((item) => item.id !== id);
      setPackageData(newData);
    }
  };

  return (
    <DefaultLayout>
      {/* <div className="mx-auto max-w-600"> */}
      <div className="rounded-sm border border-stroke bg-white my-2 px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="max-w-[10px] py-4 px-4  text-black dark:text-white pl-10">
                  Id
                </th>
                {/* <th className="min-w-[200px] py-4 px-4 text-black dark:text-white">
                Email
              </th> */}
                <th className="min-w-[250px] py-4 px-4  text-black dark:text-white">
                  Name
                </th>
                <th className="py-4 px-4 text-black dark:text-white">
                  Total Subregion
                </th>
                {/* <th className="py-4 px-4 text-black dark:text-white">Phone</th>
              <th className="py-4 px-4 text-black dark:text-white">Role</th> */}
                <th className="py-4 px-4 text-black dark:text-white">
                  Created at
                </th>
                <th className="py-4 px-4 text-center text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {hardcodedUserData.map((e, key) => (
                <tr key={key}>
                  <td className="border-b border-[#eee] py-4 px-4 pl-9 dark:border-strokedark xl:pl-11">
                    <p className="font-medium text-black dark:text-white">
                      {e.id}
                    </p>
                  </td>

                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e.name}
                    </p>
                  </td>

                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark ">
                    <p className="font-medium text-black dark:text-white pl-12">
                      {e.total_subregion}
                    </p>
                  </td>

                  <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                    <p className="font-medium text-black dark:text-white">
                      {e.created_at}
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
                        onClick={() => navigate(`form/${e.id}`)}
                        className="hover:text-primary"
                      >
                        <CiEdit style={{ fontSize: '20px' }} />
                      </button>

                      <button
                        onClick={() => onDelete(e.id)}
                        className="hover:text-primary"
                      >
                        <RiDeleteBinLine style={{ fontSize: '20px' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default LocationTable;
