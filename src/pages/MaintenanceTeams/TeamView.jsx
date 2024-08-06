import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetOneMaintenanceTeamQuery } from '../../services/maintenanceTeamSlice';
import Loader from '../../common/Loader';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';

const TeamView = () => {
  const { teamId } = useParams();
  const { data, error, isLoading } = useGetOneMaintenanceTeamQuery(teamId);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <div>Error occurred while fetching team details.</div>;
  }

  const team = data?.data;

  return (
    <DefaultLayout>
      <BreadcrumbNav
        pageName="Team Details"
        pageNameprev="Maintenance Teams" //show the name on top heading
        pagePrevPath="daily-maintenance/maintenance-team" // add the previous path to the navigation
      />
      <div className="max-w-full mx-auto p-4">
        <div className="rounded-sm border border-stroke bg-white my-2 px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <h2 className="text-2xl font-bold mb-4">Team Details</h2>
          <div className="mb-4">
            <strong>Team ID:</strong> {team?.teamId}
          </div>
          <div className="mb-4">
            <strong>Station:</strong> {team?.station}
          </div>
          <div className="mb-4">
            <strong>MTO:</strong> {team?.mto?.username} (ID: {team?.mto?.id})
          </div>
          <div className="mb-4">
            <strong>Service Manager:</strong> {team?.serviceManager?.username}{' '}
            (ID: {team?.serviceManager?.id})
          </div>
          <div className="mb-4">
            <strong>Total Vehicles Assigned:</strong>{' '}
            {team?.teamVehicles.length}
          </div>
          <h3 className="text-xl font-semibold mb-2">Assigned Vehicles</h3>
          <div className="max-w-full overflow-x-auto">
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-2 text-left dark:bg-meta-4">
                  <th className="py-4 px-4 text-black dark:text-white border">
                    S. No
                  </th>
                  <th className="py-4 px-4 text-black dark:text-white border">
                    Registration No
                  </th>
                  <th className="py-4 px-4 text-black dark:text-white border">
                    Model
                  </th>
                  <th className="py-4 px-4 text-black dark:text-white border">
                    Status (Check-In / Check-Out)
                  </th>
                </tr>
              </thead>
              <tbody>
                {team?.teamVehicles?.map((teamVehicle, index) => (
                  <tr key={index}>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                      {index + 1}
                    </td>

                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                      {teamVehicle.vehicle.registrationNo}
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                      {teamVehicle?.vehicle?.model}
                    </td>
                    <td className="border-b border-[#eee] py-4 px-4 dark:border-strokedark">
                      {teamVehicle?.vehicle?.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default TeamView;
