import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import CompanyTable from '../../components/Tables/CompanyTable';
import { IoPersonAddOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getAllCompanies } from '../../store/companySlice';
import { useEffect } from 'react';

const Companies = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAllCompanies()).then((result) => {});
  }, []);
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Companies" />
      <div className="flex justify-end my-2">
        <Link
          to="add"
          className="inline-flex items-center justify-center gap-2.5 rounded-md bg-primary mx-2 py-2 px-4 text-center font-medium text-white hover:bg-opacity-90 lg:mx-2 lg:px-4"
        >
          <span>
            <IoPersonAddOutline />
          </span>
          Add Company
        </Link>
      </div>
      <CompanyTable />
    </DefaultLayout>
  );
};

export default Companies;
