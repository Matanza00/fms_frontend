import React, { useEffect, useState } from 'react';
import { FiUser } from 'react-icons/fi';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useParams } from 'react-router-dom';
import { useGetUserQuery } from '../../services/usersSlice';
import Loader from '../../common/Loader';
import roleValue from '../../utils/helpers';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';

const UserView = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useGetUserQuery(id);
  const role = roleValue(data?.data?.role?.roleName);

  if (isLoading) return <Loader />;
  if (isError)
    return (
      <div>{`Error occurred while fetching user with this id: ${id}.`}</div>
    );
  if (!data?.data) return <div> No User Found!</div>;
  console.log('User data---->', data);

  return (
    <DefaultLayout>
      <BreadcrumbNav
        pageName="View User"
        pageNameprev="Users" //show the name on top heading
        pagePrevPath="users" // add the previous path to the navigation
      />
      <div className="flex flex-col bg-gray-100 rounded-lg overflow-hidden shadow-lg">
        <div className="flex justify-between items-end p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Employee Details</h2>
        </div>

        <div className="flex p-5 bg-brand-primary">
          <div className="flex flex-col gap-1 w-4/5">
            <div className="grid grid-cols-2 gap-1">
              <div>
                <p className="text-md font-semibold">Station:</p>
                <p className="text-md mb-5 font-normal">
                  {data?.data?.station}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Role:</p>
                <p className="text-md mb-5 font-normal">{role}</p>
              </div>
              <div>
                <p className="text-md font-semibold">Employee Name:</p>
                <p className="text-md mb-5 font-normal">
                  {data?.data?.username}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Employee ID:</p>
                <p className="text-md mb-5 font-normal">
                  {data?.data?.employeeId ?? 'none'}
                </p>
              </div>
              <div>
                <p className="text-md font-semibold">Email:</p>
                <p className="text-md mb-5 font-normal">{data?.data?.email}</p>
              </div>

              <div>
                <p className="text-md font-semibold">Created At:</p>
                <p className="text-md mb-5 font-normal">
                  {data?.data?.created_at?.slice(0, 10)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UserView;
