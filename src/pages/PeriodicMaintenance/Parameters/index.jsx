import React from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import ParametersTable from './ParametersTable';
import { Link } from 'react-router-dom';
import BreadcrumbNav from '../../../components/Breadcrumbs/BreadcrumbNav';

const Parameters = () => {
  return (
    <DefaultLayout>
      <BreadcrumbNav
        pageName="Add a parameter"
        pageNameprev="Periodic Maintenance" //show the name on top heading
        pagePrevPath="periodic" // add the previous path to the navigation
      />
      <div className="flex justify-end">
        <Link
          to="form"
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary mx-2 py-1 px-2.5 text-center font-medium text-white hover:bg-opacity-90 lg:mx-2 lg:px-3"
        >
          <span className="text-sm">Create</span>
        </Link>
      </div>
      <ParametersTable />
    </DefaultLayout>
  );
};

export default Parameters;
