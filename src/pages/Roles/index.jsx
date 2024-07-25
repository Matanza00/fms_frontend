import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useSelector } from 'react-redux';
import { useGetRolesAndPermissionsByCompanyIdQuery } from '../../services/rolesSlice';
import { useNavigate } from 'react-router-dom';

const Roles = () => {
  const companyId = useSelector((state) => state.auth.user.companyId);
  const { data, isError, isLoading } =
    useGetRolesAndPermissionsByCompanyIdQuery(companyId);
  const navigate = useNavigate();
  // Function to check permission
  const hasPermission = (permissions, type) => permissions[type];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Roles" />
      {!isLoading && (
        <div className="flex justify-end my-2">
          <button
            className="mr-3 btn text-white bg-primary border border-none"
            onClick={() => navigate('update')}
          >
            Update Roles
          </button>
        </div>
      )}
      <div className="flex text-white  flex-col bg-gray-200  rounded-lg shadow-lg  ">
        {!isLoading &&
          data &&
          data.data?.map((role, index) => (
            <div
              key={index}
              tabIndex={0}
              className="text-black collapse collapse-plus border border-base-300 bg-gray-300 rounded-lg dark:text-white mb-2"
            >
              <input type="checkbox" readOnly />
              <div className="collapse-title text-md font-medium">
                {role?.roleName}
              </div>
              <div className="collapse-content">
                {role?.rolePermissions?.map((permission, permIndex) => (
                  <div key={permIndex} className="grid grid-cols-2">
                    <h3 className="font-semibold ml-7">
                      {permission?.module.name}
                    </h3>
                    <div className="flex flex-row gap-5">
                      {['list', 'write', 'delete', 'update', 'read'].map(
                        (permType, typeIndex) => (
                          <label
                            key={typeIndex}
                            className="inline-flex items-center mt-3 mr-10"
                          >
                            <input
                              type="checkbox"
                              className="form-checkbox mr-2"
                              checked={hasPermission(permission, permType)}
                              readOnly
                            />
                            <span>
                              {permType.charAt(0).toUpperCase() +
                                permType.slice(1)}
                            </span>
                          </label>
                        ),
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>
    </DefaultLayout>
  );
};

export default Roles;
