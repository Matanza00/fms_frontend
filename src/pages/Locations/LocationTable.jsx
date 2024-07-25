import { CiEdit } from 'react-icons/ci';
import { IoEyeOutline } from 'react-icons/io5';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';

const VehicleData = [
  {
    id: 1,
    station: 'Skardu',
    subregion: 'GB',
    region: 'Northern Region',
    created_at: '2024-04-01',
  },
  {
    id: 2,
    station: 'Quetta',
    subregion: 'Balochistan',
    region: 'Southern Region',
    created_at: '2024-04-01',
  },
  {
    id: 3,
    station: 'Islamabad',
    subregion: 'Islamabad Capital Territory',
    region: 'Central Region',
    created_at: '2024-04-01',
  },
  {
    id: 4,
    station: 'South Waziristan',
    subregion: 'FATA',
    region: 'Western Region',
    created_at: '2024-04-01',
  },
  {
    id: 5,
    station: 'Abbottabad',
    subregion: 'Khyber Pakhtunkhwa',
    region: 'Northern Region',
    created_at: '2024-04-01',
  },
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
    <div className="rounded-sm border border-stroke bg-white my-2 px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="px-1 py-2 text-black dark:text-white pl-10">Id</th>
              <th className="px-4 py-2 text-black dark:text-white pl-10">
                Station
              </th>
              <th className="px-4 py-2 text-black dark:text-white">
                Subregion
              </th>
              <th className="px-4 py-2 text-black dark:text-white">Region</th>
              <th className="px-4 py-2 text-black dark:text-white">
                Created at
              </th>
              <th className="px-4 py-2 text-center text-black dark:text-white">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {VehicleData.map((e, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] px-1 py-2 dark:border-strokedark xl:pl-11">
                  <p className="font-medium text-black dark:text-white">
                    {e.id}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark xl:pl-11">
                  <p className="font-medium text-black dark:text-white">
                    {e.station}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark">
                  <p className="font-medium text-black dark:text-white">
                    {e.subregion}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark ">
                  <p className="font-medium text-black dark:text-white">
                    {e.region}
                  </p>
                </td>
                <td className="border-b border-[#eee] px-4 py-2 dark:border-strokedark">
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
                      onClick={() => navigate(`update/${e.id}`)}
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
  );
};

export default LocationTable;
