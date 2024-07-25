import Breadcrumb from '../components/Breadcrumbs/Breadcrumb';
import CompanyTable from '../components/Tables/CompanyTable';
import TableOne from '../components/Tables/TableOne';
import TableThree from '../components/Tables/TableThree';
import TableTwo from '../components/Tables/TableTwo';
import DefaultLayout from '../layout/DefaultLayout';

const Tables = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tables" />

      <div className="flex flex-col gap-10">
        <TableOne />
        <TableTwo />
        <TableThree />
        <CompanyTable/>
        
      </div>
    </DefaultLayout>
  );
};

export default Tables;
