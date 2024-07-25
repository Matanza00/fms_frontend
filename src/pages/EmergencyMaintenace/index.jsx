import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { Link, useNavigate } from 'react-router-dom';
import { RiAddCircleLine } from 'react-icons/ri';
import { getAllUsers } from '../../store/userSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import FilterRegionSubregionStation from './FilterRegionSubRegionStation';
import EmergencyTable from './EmergencyTable';
import { FaChartSimple } from 'react-icons/fa6';
// import FilterRegionSubRegionStation from './FilterRegionSubRegionStation';

const EmergencyMnt = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getAllUsers()).then((result) => {});
  }, []);
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Emergency Maintenance" />
      <div className="flex justify-end items-end mb-4 gap-3">
      
        <Link
                to="dashboard"
                className="btn h-[30px] min-h-[30px] text-sm border-slate-200 hover:bg-opacity-70 dark:text-white dark:bg-slate-700 dark:border-slate-700 dark:hover:bg-opacity-70 transition duration-150 ease-in-out rounded-md"
              >
                {' '}
                <span>
                  <FaChartSimple />
                </span>
                Dashboard
              </Link>
        <button
          className="bg-red-500 text-white py-2 px-4 rounded"
          onClick={() => navigate('/Emergency-Maintenance/add')}
        >
          Emergency Maintenance Request
        </button>
        
      </div>
      {/* <div className="flex justify-end ">
          <Link
          to="add"
          className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary mx-2 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 lg:mx-2 lg:px-4"
          >
          <span>
          <RiAddCircleLine />
          </span>
          Create Incident Record
          </Link>
          </div> */}

      <EmergencyTable />
    </DefaultLayout>
  );
};

export default EmergencyMnt;
