import { CiEdit } from 'react-icons/ci';
import { IoEyeOutline } from 'react-icons/io5';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCompanyAdminNull } from '../../store/companySlice';

const RoleTable = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { companies } = useSelector((state) => state.company);

  const onDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      // Delete the item from the data
      const newData = packageData.filter((item) => item.id !== id);
      setPackageData(newData);
    }
  };

  useEffect(() => {
    dispatch(setCompanyAdminNull());
  }, []);

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto ">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="max-w-[10px] py-4 px-4 font-medium text-black dark:text-white xl:pl-11">
                Id
              </th>
              <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                Email
              </th>
              <th className="min-w-[250px] py-4 px-4 font-medium text-black dark:text-white">
                Name
              </th>
              <th className="py-4 px-4 font-medium text-center text-black dark:text-white">
                No of users
              </th>
              <th className="py-4 px-4 font-medium text-black dark:text-white">
                Created at
              </th>
              <th className="py-4 px-4 font-medium text-center text-black dark:text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {/* {packageData.map((packageItem, key) => ( */}
            {companies?.map((e, key) => (
              <tr key={key}>
                <td className="border-b border-[#eee] py-4 px-4 pl-9 dark:border-strokedark xl:pl-11">
                  <p className="font-medium text-black dark:text-white">
                    {e.id}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                  <p className="font-medium text-black dark:text-white">
                    {e.email}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                  <p className="font-medium text-black dark:text-white">
                    {e.name}
                  </p>
                </td>
                <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                  <p className="font-medium text-center text-black dark:text-white">
                    {e.no_of_users}
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

export default RoleTable;
