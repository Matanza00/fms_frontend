import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { useSelector } from 'react-redux';
import { addEmergencyRequestSchema } from '../../utils/schemas';
import { useGetRolesByCompanyIdQuery } from '../../services/rolesSlice';
import useToast from '../../hooks/useToast';
import { useAddCompanyUserMutation } from '../../services/usersSlice';
import { useGetVehicleByCompanyIdQuery } from '../../services/vehicleSlice';
import { useGetTagDriversFromVehicleQuery } from '../../services/tagDriverSlice';
import { useGetOneVehicleDetailsQuery } from '../../services/periodicSlice';
import { useAddEmergencyRequestMutation } from '../../services/emergencySlice';

import LoadingButton from '../../components/LoadingButton';
import DeleteModal from '../../components/DeleteModal';
import Select from 'react-select';
import {
  stationOptions,
  vendorType,
  indoorVendorName,
} from '../../constants/Data';
import AsyncSelect from 'react-select/async';
import UploadWidget from '../../components/UploadWidget';
import { customStyles } from '../../constants/Styles';

const EmergencyMntForm = () => {
  const location = useLocation();
  const { registrationNo } = location.state || {};
  const { data: periodicVehicle, isLoading } =
    useGetOneVehicleDetailsQuery(registrationNo);

  const navigate = useNavigate();
  const { showErrorToast, showSuccessToast } = useToast();
  const [formValues, setFormValues] = useState({
    ...addEmergencyRequestSchema,
  });
  const [selectedRole, setSelectedRole] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const [emergencyRepairRequestImgUrl, setEmergencyRepairRequestImgUrl] =
    useState('');

  const [
    emergencyRepairStatementVideoUrl,
    setEmergencyRepairStatementVideoUrlUrl,
  ] = useState('');
  const [AddEmergencyRequest, { isLoading: emergencyLoading }] =
    useAddEmergencyRequestMutation();

  const { data: vehicles, isLoading: vehicleLoading } =
    useGetVehicleByCompanyIdQuery({
      companyId: user?.companyId,
      station: formValues?.station,
    });

  const {
    data: vehicleDetails,
    isError: isVehicleDetailsError,
    error: vehicleDetailsError,
  } = useGetOneVehicleDetailsQuery(formValues?.registrationNo);

  const vehicleLoadOptions = (inputValue, callback) => {
    if (!inputValue) {
      callback([]);
      return;
    }

    if (vehicles && vehicles.data) {
      const filteredOptions = vehicles.data.map((vehicle) => ({
        value: vehicle.id,
        label: vehicle.registrationNo,
      }));
      callback(filteredOptions);
    } else {
      callback();
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleNormalSelectChange = (selectedOption, name) => {
    setFormValues({
      ...formValues,
      [name]: selectedOption.value,
    });
  };

  const handleSelectChange = (fieldName, selectedOption) => {
    setFormValues((prevState) => ({
      ...prevState,
      [fieldName]: selectedOption.label,
    }));
  };

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      ...formValues,
      emergencyRepairRequestImg: emergencyRepairRequestImgUrl,
      emergencyRepairStatementVideo: emergencyRepairStatementVideoUrl,

      // companyId: parseInt(user?.companyId),
    };
    // console.log('formData', formData);

    try {
      await AddEmergencyRequest(formData).unwrap();
      showSuccessToast('Emergency Request Added Successfully!');
      navigate(-1);
    } catch (err) {
      console.log(err);
      showErrorToast(
        'An error has occurred while generating emergency Maintenance Request',
      );
    }
  };

  useEffect(() => {
    setFormValues({
      ...formValues,
      driverName: vehicleDetails?.data?.name,
      gbmsNo: vehicleDetails?.data?.employeeId,
      make: vehicleDetails?.data?.make,
      meterReading: vehicleDetails?.data?.oddometerReading,
      aplCardNo: vehicleDetails?.data?.cardNumber,
    });
  }, [vehicleDetails]);

  const currentDate = new Date().toISOString().slice(0, 10);
  const [dateValue, setDateValue] = useState(currentDate);

  console.log('formvalues', formValues);

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-600">
        <Breadcrumb pageName="Emergency Maintenance Form" />
        <div className=" gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="p-7">
                <form action="#" onSubmit={handleSubmit}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="station"
                      >
                        Station
                      </label>
                      <div className="relative">
                        <Select
                          styles={customStyles}
                          className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          options={stationOptions}
                          value={
                            formValues?.station
                              ? {
                                  value: formValues?.station,
                                  label: formValues?.station,
                                }
                              : null
                          }
                          onChange={(selectedOption) =>
                            handleNormalSelectChange(selectedOption, 'station')
                          }
                          placeholder="Select Station"
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="registrationNo"
                      >
                        Vehicle Number
                      </label>
                      <div className="relative">
                        <AsyncSelect
                          styles={customStyles}
                          className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          loadOptions={vehicleLoadOptions}
                          value={
                            formValues.registrationNo
                              ? {
                                  value: formValues.registrationNo,
                                  label: formValues.registrationNo,
                                }
                              : null
                          }
                          onChange={(selectedOption) =>
                            handleSelectChange('registrationNo', selectedOption)
                          }
                          isLoading={vehicleLoading}
                          isDisabled={vehicleLoading}
                          placeholder="Select a Vehicle..."
                        />
                      </div>
                    </div>
                    <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="make"
                      >
                        Make
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="make"
                          id="make"
                          placeholder="Make"
                          onChange={handleChangeValue}
                          value={formValues.make}
                          disabled
                        />
                      </div>
                    </div>

                    <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="meterReading"
                      >
                        Current Odometer Reading
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="meterReading"
                          id="meterReading"
                          placeholder="50,000 km"
                          onChange={handleChangeValue}
                          value={formValues.meterReading}
                          // disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    {/* <div className="w-full sm:w-1/1 md:w-1/2 lg:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="issueDate"
                      >
                        Issue Date
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="date"
                          name="issueDate"
                          id="issueDate"
                          placeholder="Issue Date"
                          onChange={handleChange}
                          value={formValues.issueDate}
                        />
                      </div>
                    </div> */}

                    <div className="w-full sm:w-1/1 md:w-1/2 lg:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="driverName"
                      >
                        Driver Name
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="driverName"
                          id="driverName"
                          placeholder="Driver Name"
                          onChange={handleChange}
                          value={formValues.driverName}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/1 md:w-1/2 lg:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="gbmsNo"
                      >
                        GBMS No.
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="gbmsNo"
                          id="gbmsNo"
                          placeholder="GBMS No."
                          onChange={handleChange}
                          value={formValues.gbmsNo}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="aplCardNo"
                      >
                        APL Card No.
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="aplCardNo"
                          id="aplCardNo"
                          placeholder="APL Card No."
                          onChange={handleChange}
                          value={formValues.aplCardNo}
                          disabled
                        />
                      </div>
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="ce"
                      >
                        CE
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="ce"
                          id="ce"
                          placeholder="Enter CE"
                          onChange={handleChange}
                          value={formValues.ce}
                          // disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="rm_omorName"
                      >
                        RM/OMOR Controller
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="rm_omorName"
                          id="rm_omorName"
                          placeholder="Enter RM/OMOR Name"
                          onChange={handleChange}
                          value={formValues.rm_omorName}
                          // disabled
                        />
                      </div>
                    </div>
                    {/* <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="cost"
                      >
                        Emergency Request Cost
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-4.5 flex items-center text-black dark:text-white">
                          Rs.
                        </span>
                        <input
                          className="pl-16.5 w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="number"
                          name="cost"
                          id="cost"
                          placeholder="Enter Cost "
                        />
                      </div>
                    </div> */}

                    {/* <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="emergencySupervisor"
                      >
                        Emergency Supervisor Name
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="emergencySupervisor"
                          id="emergencySupervisor"
                          placeholder="Supervisor Name"
                        />
                      </div>
                    </div> */}
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    {/* <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="vendorType"
                      >
                        Select Vendor Type
                      </label>
                      <div className="relative">
                        <Select
                          styles={customStyles}
                          className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          options={vendorType}
                          value={
                            formValues?.vendorType
                              ? {
                                  value: formValues?.vendorType,
                                  label: formValues?.vendorType,
                                }
                              : null
                          }
                          onChange={(selectedOption) =>
                            handleSelectChange(selectedOption, 'vendorType')
                          }
                          placeholder="Select Vendor Type"
                        />
                      </div>
                    </div> */}

                    {/* {formValues.vendorType === 'Indoor' && (
                      <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3">
                        <label
                          className="mb-3 block text-md font-medium text-black dark:text-white"
                          htmlFor="indoorVendorName"
                        >
                          Select Indoor Vendor
                        </label>
                        <div className="relative">
                          <Select
                            styles={customStyles}
                            className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            options={indoorVendorName}
                            value={
                              formValues?.indoorVendorName
                                ? {
                                    value: formValues?.indoorVendorName,
                                    label: formValues?.indoorVendorName,
                                  }
                                : null
                            }
                            onChange={(selectedOption) =>
                              handleSelectChange(
                                selectedOption,
                                'indoorVendorName',
                              )
                            }
                            placeholder="Select Indoor Vendor"
                          />
                        </div>
                      </div>
                    )} */}

                    {/* {formValues.vendorType === 'Outdoor' && (
                      <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3">
                        <label
                          className="mb-3 block text-md font-medium text-black dark:text-white"
                          htmlFor="vendorName"
                        >
                          Outdoor Vendor Name
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="outdoorVendorName"
                            id="outdoorVendorName"
                            placeholder="Outdoor Vendor Name"
                            onChange={handleChange}
                            value={formValues.outdoorVendorName}
                          />
                        </div>
                      </div>
                    )} */}

                    {/* {formValues.vendorType === 'Outdoor' && (
                      <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3">
                        <label
                          className="mb-3 block text-md font-medium text-black dark:text-white"
                          htmlFor="outdoorVendorReason"
                        >
                          Outdoor Vendor Reason
                        </label>
                        <div className="relative">
                          <input
                            className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                            type="text"
                            name="outdoorVendorReason"
                            id="outdoorVendorReason"
                            placeholder="Reason for Selecting Outside Vendor"
                            onChange={handleChange}
                            value={formValues.outdoorVendorReason}
                          />
                        </div>
                      </div>
                    )} */}
                  </div>
                  {/* <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="emergencyJob"
                      >
                        Emergency Job
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="emergencyJob"
                          id="emergencyJob"
                          placeholder="Enter Emergency Job"
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="description"
                      >
                        Description
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          type="text"
                          name="description"
                          id="description"
                          placeholder="Enter Description"
                        />
                      </div>
                    </div>
                  </div> */}

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="emergencyRepairRequestImgWidget"
                      >
                        Emergency Repair Image
                      </label>
                      <div className="relative">
                        <UploadWidget
                          setImgUrl={setEmergencyRepairRequestImgUrl}
                          id="emergencyRepairRequestImgWidget" // Unique identifier for this instance
                          accept="image/*"
                        />
                        {emergencyRepairRequestImgUrl && (
                          <div className="flex justify-center items-center border border-blue-200 p-4 bg-slate-200">
                            <img
                              src={emergencyRepairRequestImgUrl}
                              alt="Emergency Job Image"
                              className="object-contain h-48 w-48"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="emergencyRepairStatementVideoWidget"
                      >
                        Driver Statement Video
                      </label>
                      <div className="relative">
                        <UploadWidget
                          setImgUrl={setEmergencyRepairStatementVideoUrlUrl}
                          id="emergencyRepairStatementVideoWidget" // Unique identifier for this instance
                          accept="video/*"
                        />
                        {emergencyRepairStatementVideoUrl && (
                          <div className="flex justify-center items-center border border-blue-200 p-4 bg-slate-200">
                            <video
                              src={emergencyRepairStatementVideoUrl}
                              alt="Upload Driver Statement"
                              className="object-contain h-48 w-48"
                              controls
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mr-5">
                    <div className="flex justify-end gap-4.5">
                      <button
                        className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black dark:border-strokedark dark:text-white transition duration-150 ease-in-out hover:border-gray dark:hover:border-white "
                        type="submit"
                      >
                        Cancel
                      </button>
                      <>
                        {isLoading ? (
                          <LoadingButton
                            btnText="Adding..."
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

export default EmergencyMntForm;
