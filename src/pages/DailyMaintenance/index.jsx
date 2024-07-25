import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Select from 'react-select';
import { useSelector } from 'react-redux';
import { customStyles } from '../../constants/Styles';
import { stationOptions } from '../../constants/Data';
import { MdOutlineFactCheck, MdOutlineLibraryAddCheck } from 'react-icons/md';
import { IoMdAddCircle } from 'react-icons/io';
import { FaRegEye } from 'react-icons/fa';
import DailyMaintenanceTables from './DailyMaintenanceTable';

const DailyMaintenance = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [formValues, setFormValues] = useState({ station: null });
  const [showButton, setShowButton] = useState(true);

  const handleNormalSelectChange = (selectedOption) => {
    setFormValues({
      ...formValues,
      station: selectedOption,
    });
  };

  let ma_role = user.Role.roleName === 'Maintenance Admin';
  let sm_mto_role =
    user.Role.roleName === 'Maintenance Service Manager' ||
    user.Role.roleName === 'Maintenance MTO';

  const handleCheckInClick = () => {
    if (ma_role) {
      navigate('admin-form', {
        state: { status: 'CHECKED_OUT', station: formValues.station },
      });
    }
    if (sm_mto_role) {
      navigate('form', {
        state: { status: 'CHECKED_OUT', station: formValues.station },
      });
    }
    console.log('sm_mto_', sm_mto_role);
  };

  const handleCheckOutClick = () => {
    if (ma_role) {
      navigate('admin-form', {
        state: { status: 'CHECKED_IN', station: formValues.station },
      });
    }
    if (sm_mto_role) {
      navigate('form', {
        state: { status: 'CHECKED_IN', station: formValues.station },
      });
    }
  };
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Daily Maintenance" />
      <div className="mb-5 w-full max-w-xs">
        <label
          className="mb-3 block text-md font-medium text-black dark:text-white"
          htmlFor="stationOptions"
        >
          Station
        </label>
        <Select
          styles={customStyles}
          className="border border-stroke w-full rounded bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
          options={stationOptions}
          value={formValues.station}
          onChange={handleNormalSelectChange}
          placeholder="Select Station"
        />
      </div>

      <div className="flex justify-center mt-5 space-x-5">
        <button
          onClick={handleCheckInClick}
          disabled={!formValues.station}
          className={`inline-flex items-center justify-center gap-4 rounded-md py-3 px-6 text-center font-medium text-white lg:px-4 ${
            formValues.station
              ? 'bg-primary hover:bg-opacity-90'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          style={{ width: '150px' }} // Added fixed width to maintain layout
        >
          <MdOutlineFactCheck size={22} />
          <span className="text-base">Check In</span>
        </button>
        <button
          onClick={handleCheckOutClick}
          disabled={!formValues.station}
          className={`inline-flex items-center justify-center gap-3 rounded-md py-2 px-4 text-center font-medium text-white lg:px-4 ${
            formValues.station
              ? 'bg-primary hover:bg-opacity-90'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          style={{ width: '150px' }} // Added fixed width to maintain layout
        >
          <MdOutlineLibraryAddCheck size={22} />
          <span className="text-base">Check Out</span>
        </button>
      </div>

      <div className="flex justify-end gap-2 mb-4">
        <Link
          to="maintenance-team"
          className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 transition duration-150 ease-in-out"
        >
          <FaRegEye size={18} />
          <span className="text-sm">View Maintenance Teams</span>
        </Link>
        {showButton && user?.Role?.roleName === 'Maintenance Admin' && (
          <>
            <Link
              to="create-team"
              className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 transition duration-150 ease-in-out"
            >
              <IoMdAddCircle size={18} />
              <span className="text-sm">Create Team</span>
            </Link>
          </>
        )}
      </div>

      <DailyMaintenanceTables />
    </DefaultLayout>
  );
};

export default DailyMaintenance;
