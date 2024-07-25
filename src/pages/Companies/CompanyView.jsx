import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { user3 } from '../../images';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  addCompanyAdmin,
  getCompany,
  getCompanyAdmin,
} from '../../store/companySlice';
import { addCompanyAdminSchema } from '../../utils/schemas';
import { TfiEmail, TfiKey, TfiMobile, TfiUser } from 'react-icons/tfi';
import { sendCredentials } from '../../store/authSlice';
import useToast from '../../hooks/useToast';

const CompanyView = () => {
  const { id } = useParams();
  const { showSuccessToast } = useToast();
  const dispatch = useDispatch();
  const [formValues, setFormValues] = useState(addCompanyAdminSchema);
  const company = useSelector((state) => state.company.eachCompany);
  const companyAdmin = useSelector((state) => state.company.companyAdmin);

  useEffect(() => {
    if (id) {
      dispatch(getCompany({ id }));
    }
  }, [dispatch, id]);
  useEffect(() => {
    if (id) {
      dispatch(getCompanyAdmin({ id }));
    }
  }, [dispatch, id]);

  const [isActive, setIsActive] = useState(true);
  const [showDeletedAt, setShowDeletedAt] = useState(false);
  const handleChangeIsActive = () => {
    setIsActive(!isActive);
  };
  const toggleDeletedAt = () => {
    setShowDeletedAt(!showDeletedAt);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };
  const formHandler = (e) => {
    e.preventDefault();
    if (id) {
      let _formValues = { ...formValues };
      _formValues.companyId = id;

      dispatch(addCompanyAdmin({ payload: _formValues }))
        .then((action) => {
          if (addCompanyAdmin.fulfilled.match(action)) {
            if (action.payload) {
              setFormValues(addCompanyAdminSchema);
              showSuccessToast('Comapany Admin Successfully.');
              return;
            } else {
              showErrorToast('Failed to Add Admin.');
            }
          } else {
            showErrorToast('Failed to Add!');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          showErrorToast(error?.message);
        });
    }
  };

  useEffect(() => {
    if (!!companyAdmin) {
      setFormValues({ ...formValues, ...companyAdmin });
    }
  }, [companyAdmin]);

  const sendCredentialsHandler = (userId) => {
    dispatch(sendCredentials({ id: companyAdmin.id })).then(
      showSuccessToast('Credentials Sent Successfully'),
    );
  };

  return (
    <DefaultLayout>
      <div className="flex flex-col bg-gray-100 rounded-lg overflow-hidden shadow-lg">
        <div className="flex justify-between items-end p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold">Company Details</h2>
        </div>

        <div className="flex p-5 bg-brand-primary">
          <div className="flex flex-col gap-1 w-4/5">
            <div className="grid grid-cols-2 gap-1">
              <div className="flex gap-2 my-3">
                <p className="text-sm font-semibold">Company Name:</p>
                <p className="text-sm font-normal">{company?.name}</p>
              </div>
              <div className="flex gap-2 my-3">
                <p className="text-sm font-semibold">ID:</p>
                <p className="text-sm font-normal">{company?.id}</p>
              </div>
              <div className="flex gap-2 my-3">
                <p className="text-sm font-semibold">Email:</p>
                <p className="text-sm font-normal">{company?.email}</p>
              </div>
              <div className="flex gap-2 my-3">
                <p className="text-sm font-semibold">Address:</p>
                <p className="text-sm font-normal">{company?.address}</p>
              </div>
              <div className="flex gap-2 my-3">
                <p className="text-sm font-semibold">No of Users:</p>
                {/* <p className="text-sm font-normal">{data.number_of_users}</p> */}
              </div>
              <div className="flex gap-2 my-3">
                <p className="text-sm font-semibold">Subscription Plan:</p>
                {/* <p className="text-sm font-normal">{data.subscription_plan}</p> */}
              </div>
              <div className="flex gap-2 my-3">
                <p className="text-sm font-semibold">Is Active: </p>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={handleChangeIsActive}
                    className="form-checkbox h-5 w-5 text-indigo-600"
                  />
                  <label htmlFor="isActive" className="ml-2">
                    {isActive ? 'Active' : 'Inactive'}
                  </label>
                </div>
              </div>
              <div className="flex gap-2 my-3">
                <p className="text-sm font-semibold">Created At:</p>
                <p className="text-sm font-normal">
                  {company?.created_at.slice(0, 10)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-1/5 pl-5 border-l border-gray-200">
            <div className="pb-2 border-b border-gray-200">
              <p className="text-lg font-bold text-center">Company Logo</p>
            </div>
            <img
              src={'https://via.placeholder.com/150'}
              alt="Logo"
              className="h-12 w-auto"
            />
          </div>
        </div>

        <div className="bg-brand-primary my-5 px-2 ">
          <div className="flex justify-between items-end p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">Company Admin</h2>
          </div>
          <div className="my-2 px-2">
            <form onSubmit={formHandler}>
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-4">
                      <TfiEmail className="h-5 w-5" />
                    </span>

                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="email"
                      name="email"
                      required
                      id="email"
                      onChange={handleChange}
                      value={formValues.email}
                      placeholder="Enter Admins Email"
                    />
                  </div>
                </div>

                <div className="w-full sm:w-1/2">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="password"
                  >
                    Name
                  </label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-4">
                      <TfiUser className="h-5 w-5" />
                    </span>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="username"
                      required
                      id="username"
                      onChange={handleChange}
                      value={formValues.username}
                      placeholder="Name"
                    />
                  </div>
                </div>
              </div>
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="phone"
                  >
                    Phone
                  </label>
                  <div className="relative">
                    <span className="absolute left-4.5 top-4">
                      <TfiMobile className="h-5 w-5" />
                    </span>

                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      required
                      name="phone"
                      id="phone"
                      onChange={handleChange}
                      value={formValues.phone}
                      placeholder="Enter Phone"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={sendCredentialsHandler}
                  className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                >
                  Send Credentials
                </button>
                {!companyAdmin && (
                  <button
                    type="submit"
                    className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                  >
                    Update
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CompanyView;

// "email": "admin@testcompany.pk",
// "password": "Test@1234",
// "phone": "00000000",
// "username": "Test Admin",
// "companyId": 5
