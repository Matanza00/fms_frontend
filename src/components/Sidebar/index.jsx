import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import SidebarLinkGroup from './SidebarLinkGroup';
import Logo from '../../images/logo/logo.svg';
import SOSLogo from '../../images2/SOS_Logo_removebg.png'; // Add this line to import your image
import { GoOrganization } from 'react-icons/go';
import { HiUserGroup } from 'react-icons/hi2';
import { MdOutlineDashboard, MdLogout } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { resetAuthState } from '../../store/authSlice';
import { GiSlashedShield } from 'react-icons/gi';
import { FaPeopleGroup } from 'react-icons/fa6';
import { IoLocationOutline } from 'react-icons/io5';
import { TbSettingsExclamation, TbSubtask } from 'react-icons/tb';
import { AiFillCar } from 'react-icons/ai';
import { RiBusWifiFill } from 'react-icons/ri';
import { BsFillFuelPumpFill } from 'react-icons/bs';
import { GiAutoRepair } from 'react-icons/gi';
import { CiLogout } from 'react-icons/ci';
import { FiUser } from 'react-icons/fi';
import { FaClockRotateLeft } from 'react-icons/fa6';
import { IoIosWarning } from 'react-icons/io';

const links = [
  {
    id: 'user',
    path: '/users',
    icon: <HiUserGroup className="w-5 h-5" />,
    text: 'Users',
    styleChecker: 'users',
  },
  {
    id: 'role',
    path: '/roles',
    icon: <TbSubtask className="w-5 h-5" />,
    text: 'Roles',
    styleChecker: 'roles',
  },
  {
    id: 'driver',
    path: '/drivers',
    icon: <FaPeopleGroup className="w-5 h-5" />,
    text: 'Drivers',
    styleChecker: 'drivers',
  },
  {
    id: 'vehicle',
    path: '/vehicles',
    icon: <AiFillCar className="w-5 h-5" />,
    text: 'Vehicles',
    styleChecker: 'vehicles',
  },
  {
    id: 'vehicle_assigned',
    path: '/vehicle-tagged',
    icon: <RiBusWifiFill className="w-5 h-5" />,
    text: 'Vehicles Assigned',
    styleChecker: 'vehicle-tagged',
  },
  {
    id: 'fuel',
    path: '/fuel-management',
    icon: <BsFillFuelPumpFill className="w-5 h-5" />,
    text: 'Fuel Management',
    styleChecker: 'fuel-management',
  },
  {
    id: 'periodic',
    path: '/periodic',
    icon: <GiAutoRepair className="w-6 h-6" />,
    text: 'Periodic Maintenance',
    styleChecker: 'periodic',
  },
  {
    id: 'daily',
    path: '/daily',
    icon: <FaClockRotateLeft className="w-5 h-5" />,
    text: 'Daily Maintenance',
    styleChecker: 'daily',
  },
  {
    id: 'emergencyMnt',
    path: '/Emergency-Maintenance',
    icon: <TbSettingsExclamation className="w-5 h-5" />,
    text: 'Emerg Maintenance',
    styleChecker: 'emergencyMnt',
  },
  {
    id: 'dailyMaintenance',
    path: '/daily-maintenance',
    icon: <GiAutoRepair className="w-5 h-5" />,
    text: 'Daily Maintenance',
    styleChecker: 'dailyMaintenance',
  },
];

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const [filteredLinks, setFilteredLinks] = useState([]);
  const trigger = useRef(null);
  const sidebar = useRef(null);

  const permissions = user.Role.rolePermissions.map((e) => e?.module?.name);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );
  let adminRole =
    user.Role.roleName == 'companyAdmin' ||
    user.Role.roleName == 'Maintenance Admin';
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  const logoutHandler = () => {
    localStorage.removeItem('token');
    dispatch(resetAuthState());
    navigate('/');
  };

  useEffect(() => {
    let allLinks = links?.filter((link) => permissions.includes(link.id));
    allLinks.push({
      id: 'daily',
      path: '/daily-maintenance',
      icon: <FaClockRotateLeft className="w-5 h-5" />,
      text: 'Daily Maintenance',
      styleChecker: 'daily',
    });

    {
      adminRole &&
        allLinks.push({
          id: 'emergency',
          path: '/emergency-maintenance',
          icon: <IoIosWarning className="w-6 h-6" />,
          text: 'Emergency Maintenance',
          styleChecker: 'emergency',
        });
    }

    setFilteredLinks(allLinks);
    return () => {};
  }, []);

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink to="/" className="text-white font-black text-4xl tracking-widest flex w-full gap-2 items-center">
          <img src={SOSLogo} alt="SOS Logo" className="w-11 h-11" /> FMS
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden text-white"
        >
          X
        </button>
      </div>
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
          <div>
            <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
              MENU
            </h3>
            <ul className="mb-6 flex flex-col gap-1.5">
              <li>
                <NavLink
                  to="/dashboard"
                  className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                    pathname.includes('dashboard') && 'bg-graydark dark:bg-meta-4'
                  }`}
                >
                  <MdOutlineDashboard className="w-5 h-5" /> Dashboard
                </NavLink>
              </li>
              {filteredLinks?.map((e, i) => (
                <li key={e.id}>
                  <NavLink
                    to={e.path}
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname.includes(e.styleChecker) && 'bg-graydark dark:bg-meta-4'
                    }`}
                  >
                    {e.icon} {e.text}
                  </NavLink>
                </li>
              ))}
            </ul>

            <div
              className="group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 hover:cursor-pointer"
              onClick={logoutHandler}
            >
              <CiLogout className="w-6 h-6" /> Logout
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
