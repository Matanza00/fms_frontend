import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useSelector } from 'react-redux';
import {
  useGetRolesAndPermissionsByCompanyIdQuery,
  useUpdateRolePermissionsMutation,
} from '../../services/rolesSlice';
import { produce } from 'immer';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';

const RoleUpdate = () => {
  const companyId = useSelector((state) => state.auth.user.companyId);
  const { data, isError, isLoading } =
    useGetRolesAndPermissionsByCompanyIdQuery(companyId);
  const [updatedRoles, setUpdatedRoles] = useState([]);

  useEffect(() => {
    setUpdatedRoles(data?.data);
  }, [data]);

  // Function to handle role updates
  const handleRoleUpdate = async (roleId) => {
    const updatedRolePermissions = updatedRoles[roleId];
    const roleIndex = updatedRoles.findIndex((role) => role.id === roleId);
    console.log(updatedRoles[roleIndex]);
    let _data = updatedRoles[roleIndex];
    await updateRolePermissionsMutation({
      roleId,
      data: _data,
    });
    // Optional: Add logic to handle success or error response from the API
  };

  // Mutation hook for updating role permissions
  const [updateRolePermissionsMutation, { isLoading: isUpdatingRole }] =
    useUpdateRolePermissionsMutation();

  // Function to update the updatedRoles state when checkboxes are changed
  const handleCheckboxChange = (roleId, permissionId, type, value) => {
    setUpdatedRoles((prevState) => {
      return produce(prevState, (draftState) => {
        const roleIndex = draftState.findIndex((role) => role.id === roleId);
        if (roleIndex !== -1) {
          const permissionIndex = draftState[
            roleIndex
          ].rolePermissions.findIndex(
            (permission) => permission.id === permissionId,
          );
          if (permissionIndex !== -1) {
            draftState[roleIndex].rolePermissions[permissionIndex][type] =
              value;
          }
        }
      });
    });
  };

  return (
    <DefaultLayout>
      <BreadcrumbNav
        pageName="Update Roles"
        pageNameprev="Roles" //show the name on top heading
        pagePrevPath="roles" // add the previous path to the navigation
      />
      <div className="flex text-white  flex-col bg-gray-200 p-4 rounded-lg shadow-lg min-h-180 ">
        {!isLoading &&
          data &&
          !!updatedRoles?.length &&
          updatedRoles?.map((role, index) => (
            <div
              key={index}
              tabIndex={0}
              className="text-black border-2 border-base-300 rounded-lg bg-white  px-4 py-2 capitalize mb-2 dark:bg-boxdark dark:text-white"
            >
              <div className="flex justify-between items-center">
                <div className=" text-md font-medium ">{role?.roleName}</div>
                <button
                  className="border rounded-md bg-slate-400 text-white px-3  py-1 mt-2 "
                  onClick={() => handleRoleUpdate(role.id)}
                  disabled={isUpdatingRole}
                >
                  Update Role
                </button>
              </div>

              <div className="">
                {!!role?.rolePermissions.length &&
                  role?.rolePermissions?.map((permission, permIndex) => (
                    <div key={permIndex} className="grid grid-cols-3">
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
                                checked={permission[permType]}
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    role.id,
                                    permission.id,
                                    permType,
                                    e.target.checked,
                                  )
                                }
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

export default RoleUpdate;
