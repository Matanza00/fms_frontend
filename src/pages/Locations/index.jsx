import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { Link } from 'react-router-dom';
import { RiAddCircleLine } from 'react-icons/ri';
import { getAllUsers } from '../../store/userSlice';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
// import VehicleTable from './LocationTable';
import FilterRegionSubregionStation from './FilterRegionSubRegionStation';
import FilterRegionSubRegionStation from './FilterRegionSubRegionStation';
import { RiMapPinAddFill } from 'react-icons/ri';
import LocationTable from '../Locations/LocationTable';

const Locations = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllUsers()).then((result) => {});
  }, []);
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Location" />
      <div className="flex justify-between">
        <div className="flex items-center">
          <FilterRegionSubRegionStation />
        </div>
        <div className="flex justify-end ">
          <Link
            to="add"
            className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary mx-2 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 lg:mx-2 lg:px-4"
          >
            <span>
              <RiMapPinAddFill />
            </span>
            Add Location
          </Link>
        </div>
      </div>

      <LocationTable />
    </DefaultLayout>
  );
};

export default Locations;
