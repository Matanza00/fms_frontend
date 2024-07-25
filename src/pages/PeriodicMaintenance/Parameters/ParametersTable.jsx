import React from 'react';
import { useGetPeriodicParametersQuery } from '../../../services/periodicSlice';
import Loader from '../../../common/Loader';

const ParametersTable = () => {
  const {
    data: parameters,
    isLoading,
    error,
    isError,
    refetch,
  } = useGetPeriodicParametersQuery();

  console.log(parameters?.data);
  if (isLoading) return <Loader />;

  return (
    <>
      <div className="h-[570px] rounded-sm border border-stroke bg-white my-2 px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto h-[530px] overflow-y-auto">
          <table className="w-full table-auto">
            <thead className="">
              <tr className="bg-gray-2 text-left dark:bg-meta-4 flex flex-1">
                <th className="w-auto py-4 px-4 text-black flex-[0.1] dark:text-white cursor-pointer border">
                  <span className="flex items-center">Sr No.</span>
                </th>
                <th className="w-auto py-4 px-4 text-black flex-[0.3] dark:text-white cursor-pointer border">
                  <span className="flex items-center">Job</span>
                </th>
                <th className="w-auto flex-[0.3] py-4 px-4 text-black dark:text-white cursor-pointer border">
                  <span className="flex items-center">Action</span>
                </th>
                <th className="w-auto flex-[0.3] py-4 px-4 text-black dark:text-white cursor-pointer border">
                  <span className="flex items-center">Parameters</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {parameters?.data?.length > 0 &&
                parameters.data.map((e, i) => (
                  <tr className="py-3 flex flex-1" key={i}>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark border flex-[0.1]">
                      <p className="font-medium text-black dark:text-white">
                        {i + 1}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark border flex-[0.3]">
                      <p className="font-medium text-black dark:text-white">
                        {e.job}
                      </p>
                      <p className="font-medium text-black dark:text-white">
                        {e.notes}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark border flex-[0.3]">
                      {e.isBoth ? (
                        <p className="font-medium text-black dark:text-white">
                          Replace after {e.replaceAfterKms} or Replace after{' '}
                          {e.replaceAfterMonths} Months
                        </p>
                      ) : e.isKm ? (
                        <p className="font-medium text-black dark:text-white">
                          Replace after {e.replaceAfterKms}
                        </p>
                      ) : (
                        <p className="font-medium text-black dark:text-white">
                          Replace after {e.replaceAfterMonths} Months
                        </p>
                      )}
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark border flex-[0.3]">
                      <p className="font-medium text-black dark:text-white">
                        If Not Changed
                      </p>
                      <p className="font-medium text-black dark:text-white">
                        Deduct {e.pointsDeduction} Points
                      </p>
                      {e.isKm &&
                        e.priorityLevels?.length > 0 &&
                        e.priorityLevels.map((priority, priorityIndex) => (
                          <p
                            className="font-medium text-xs text-black dark:text-white"
                            key={priorityIndex}
                          >
                            {priority.minKm} --- {priority.maxKm} --{' '}
                            {priority.label}
                          </p>
                        ))}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ParametersTable;
