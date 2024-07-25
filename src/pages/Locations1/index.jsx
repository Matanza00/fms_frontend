import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { Link } from 'react-router-dom';
import { RiMapPinAddFill } from 'react-icons/ri';
import { useEffect } from 'react';
import LocationTable from './LocationTable';

const Locations = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Locations" />
      <div className="flex justify-end">
        <Link
          to="add"
          className="inline-flex items-center justify-center gap-2.5 
          rounded-md bg-primary mx-2 py-2 px-4 text-center font-medium text-white
          hover:bg-opacity-90 lg:mx-2 lg:px-4"
        >
          <span>
            <RiMapPinAddFill />
          </span>
          Add Region
        </Link>
      </div>
      <LocationTable />
    </DefaultLayout>
  );
};

export default Locations;
