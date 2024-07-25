// import React, {useEffect, useState} from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { user3 } from '../../images';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { IoMdPerson } from 'react-icons/io';
import { TfiEmail } from 'react-icons/tfi';
import { LuUpload } from 'react-icons/lu';
import { addCompanySchema } from '../../utils/schemas';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addCompany, updateCompany } from '../../store/companySlice';
import { useNavigate, useParams } from 'react-router-dom';
import useToast from '../../hooks/useToast';
import UploadWidget from '../../components/UploadWidget';

const CompanyForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState(addCompanySchema);
  const dispatch = useDispatch();
  const { showErrorToast, showSuccessToast } = useToast();
  const [companyLogoImgUrl, setcompanyLogoImgUrl] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const formHandler = (e) => {
    e.preventDefault();
    if (!id) {
      dispatch(addCompany({ payload: formValues }))
        .then((action) => {
          if (addCompany.fulfilled.match(action)) {
            if (action.payload) {
              setFormValues(addCompanySchema);
              showSuccessToast('Comapany Added Succesfully.');
              navigate(-1);
              return;
            } else {
              showErrorToast('Failed to Add Comapany.');
            }
          } else {
            showErrorToast('Failed to Add!');
          }
        })
        .catch((error) => {
          console.error('Error:', error);
          showErrorToast(error?.message);
        });
    } else if (id) {
      dispatch(updateCompany({ id: id, payload: formValues }))
        .then((response) => {
          showSuccessToast('Comapany Updated Succesfully.');
          navigate(-1);
        })
        .catch((error) => {
          console.error('Error:', error);
          showErrorToast(error?.message);
        });
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-270">
        <Breadcrumb pageName="Company Form" />
        <div className="grid grid-cols-5 gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  Company Information
                </h3>
              </div>
              <div className="p-7">
                <form onSubmit={formHandler}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="name"
                      >
                        Company Name
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <IoMdPerson className="h-5 w-5" />
                        </span>
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="name"
                          id="name"
                          onChange={handleChange}
                          value={formValues.name}
                          placeholder="Enter Company Name"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="subscriptionType"
                      >
                        Subscription Type
                      </label>
                      <select
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        name="subscriptionType"
                        id="subscriptionType"
                        defaultValue="basic" // Set the default value to 'basic'
                      >
                        <option value="basic">Basic</option>
                        <option value="platinum">Platinum</option>
                        <option value="premium">Premium</option>
                      </select>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white"
                        htmlFor="noOfUsers"
                      >
                        No. Of Users
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        // className="w-full sm:w-1/3 rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text" // Set type to text
                        pattern="\d*" // Allow only numbers
                        name="noOfUsers"
                        id="noOfUsers"
                        placeholder="0"
                        defaultValue="0"
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="email"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <TfiEmail className="h-5 w-5" />
                      </span>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 pl-11.5 pr-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="email"
                        name="email"
                        id="email"
                        placeholder="company@gmail.com"
                        onChange={handleChange}
                        value={formValues.email}
                      />
                    </div>
                  </div>

                  <div className="mb-5.5">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="address"
                    >
                      Address
                    </label>
                    <input
                      className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                      type="text"
                      name="address"
                      id="address"
                      placeholder="123 Main St, City, Country"
                      onChange={handleChange}
                      value={formValues.address}
                    />
                  </div>

                  <div className="flex justify-end gap-4.5">
                    <button className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white">
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-span-5 xl:col-span-2">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-black dark:text-white">
                  {' '}
                  Company Logo
                </h3>
              </div>
              <div className="p-7">
                <form action="#">
                  <div className="mb-5.5 flex justify-center gap-5.5 sm:flex-row">
                    <div className="w-full">
                      <UploadWidget
                        setImgUrl={setcompanyLogoImgUrl}
                        id="companyLogoImgUrlUploadWidget" // Unique identifier for this instance
                      />
                      {companyLogoImgUrl && (
                        <div className=" flex justify-left items-center border border-blue-200 p-4 bg-slate-200">
                          <img
                            src={companyLogoImgUrl}
                            alt="CompanyLogo"
                            className="object-contain max-x-full max-w-full"
                          />
                        </div>
                      )}
                      {/* </div> */}
                    </div>
                  </div>
                  {/* 
                  <div className="flex justify-end gap-4.5">
                    <div className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white">
                      Cancel
                    </div>
                    <div className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90">
                      Save
                    </div>
                  </div> */}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};
export default CompanyForm;
