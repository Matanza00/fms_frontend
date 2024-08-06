import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { FiUser } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { addUserSchema } from '../../utils/schemas';
import { useGetRolesByCompanyIdQuery } from '../../services/rolesSlice';
import useToast from '../../hooks/useToast';
import {
  useGetUserQuery,
  useUpdateUserMutation,
} from '../../services/usersSlice';
import LoadingButton from '../../components/LoadingButton';
import Loader from '../../common/Loader';
import { customStyles } from '../../constants/Styles';
import { stationOptions } from '../../constants/Data';
import { AiOutlineMail } from 'react-icons/ai';
import { BiSolidPhoneIncoming } from 'react-icons/bi';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';

const UserUpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showErrorToast, showSuccessToast } = useToast();
  const [formValues, setFormValues] = useState({ ...addUserSchema });
  // const [selectedRole, setSelectedRole] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const { data: roles } = useGetRolesByCompanyIdQuery(user?.companyId);
  const { data, isLoading: GetUserLoader } = useGetUserQuery(id);
  const [UpdateUser, { isLoading }] = useUpdateUserMutation();

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleChange = (selectedOption, name) => {
    if (name === 'station') {
      setFormValues((prevState) => ({
        ...prevState,
        [name]: selectedOption.value,
      }));
    } else {
      setFormValues((prevState) => ({
        ...prevState,
        [name]: selectedOption.value,
      }));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const { companyId, id, ...formDataWithoutCompanyId } = formValues;
    const data = { ...formDataWithoutCompanyId };
    delete data?.created_at;
    delete data?.role;

    try {
      await UpdateUser({ userId: id, data }).unwrap();
      showSuccessToast('User Updated Successfully!');
      navigate(-1);
    } catch (err) {
      console.log(err);
      let errorMessage = 'An error has occurred while adding user';
      if (err?.data?.error?.details.length > 0) {
        errorMessage = err?.data?.error?.details
          .map((detail) => detail.message)
          .join(', ');
      } else if (!!err?.data?.message) {
        errorMessage = err?.data?.message;
      }
      console.log('!!!', errorMessage);

      showErrorToast(errorMessage);
    }
  };

  useEffect(() => {
    setFormValues({
      ...formValues,
      ...data?.data,
    });
  }, [data?.data]);

  if (GetUserLoader) return <Loader />;

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-600">
        <BreadcrumbNav
          pageName="Edit User"
          pageNameprev="Users" //show the name on top heading
          pagePrevPath="users" // add the previous path to the navigation
        />

        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-md text-black dark:text-white">
                  User's Information
                </h3>
              </div>
              <div className="p-7">
                <form action="#" onSubmit={handleUpdate}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="station"
                      >
                        Station
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <FiUser />
                        </span>
                        <Select
                          styles={customStyles}
                          options={stationOptions}
                          className="mb-3 w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          name="station"
                          id="station"
                          onChange={(selectedOption) =>
                            handleChange(selectedOption, 'station')
                          }
                          // value={formValues.station}
                          value={
                            formValues.station
                              ? {
                                  value: formValues.station,
                                  label: formValues.station,
                                }
                              : null
                          }
                          placeholder="Select Station"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="emailAddress"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <AiOutlineMail />
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="email"
                          name="email"
                          id="email"
                          placeholder="devidjond45@gmail.com"
                          onChange={handleChangeValue}
                          value={formValues.email}
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="fullName"
                      >
                        Full Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <FiUser />
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="username"
                          id="fullName"
                          placeholder="Devid Jhon"
                          onChange={handleChangeValue}
                          value={formValues.username}
                          // defaultValue="Devid Jhon"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="phoneNumber"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <BiSolidPhoneIncoming />
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="phone"
                          id="phoneNumber"
                          placeholder="+990 3343 7865"
                          onChange={handleChangeValue}
                          value={formValues.phone}
                        />
                      </div>
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="employeeId"
                      >
                        Employee ID
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <FiUser />
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="employeeId"
                          id="employeeId"
                          placeholder="1001"
                          onChange={handleChangeValue}
                          value={formValues.employeeId}
                          // defaultValue="1001"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <label className="mt-9 mb-6 block text-lg font-medium text-black dark:text-white">
                      Role
                    </label>
                    {roles?.data?.map((role) => (
                      <label
                        key={role.id}
                        className="mb-2 block text-md font-medium text-black dark:text-white pl-3 capitalize"
                      >
                        <input
                          type="radio"
                          name="myCheckbox"
                          checked={formValues.roleId === role.id}
                          onChange={() =>
                            setFormValues((prevFormValues) => ({
                              ...prevFormValues,
                              roleId: role.id,
                            }))
                          }
                          className="form-checkbox h-3 w-3 text-indigo-600 transition duration-150 ease-in-out mr-2"
                        />
                        {role.roleName}
                        <br />
                      </label>
                    ))}
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black dark:border-strokedark dark:text-white transition duration-150 ease-in-out hover:border-black dark:hover:border-white "
                      type="submit"
                    >
                      Cancel
                    </button>
                    <>
                      {isLoading ? (
                        <LoadingButton
                          btnText="Updating..."
                          isLoading={isLoading}
                        />
                      ) : (
                        <button
                          className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                          type="submit"
                        >
                          Save
                        </button>
                      )}
                    </>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default UserUpdateForm;
