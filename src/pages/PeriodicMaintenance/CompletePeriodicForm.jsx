import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { useSelector } from 'react-redux';
import { addPeriodicRequestSchema } from '../../utils/schemas';
import { useGetRolesByCompanyIdQuery } from '../../services/rolesSlice';
import useToast from '../../hooks/useToast';
import LoadingButton from '../../components/LoadingButton';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { useGetVehicleByCompanyIdQuery } from '../../services/vehicleSlice';
import {
  useUpdatePeriodicRequestMutation,
  useGetOneVehicleDetailsQuery,
  useGetOneVehiclePeriodicTypeDetailsQuery,
  useGetPeriodicParametersQuery,
  useGetPeriodicRequestQuery,
} from '../../services/periodicSlice';
import {
  stationOptions,
  periodicThreshold,
  vendorType,
  indoorVendorName,
} from '../../constants/Data';
import { customStyles } from '../../constants/Styles';
import UploadWidget from '../../components/UploadWidget';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';

const CompletePeriodicForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showErrorToast, showSuccessToast } = useToast();
  const [formValues, setFormValues] = useState({
    completionMeterReading: '',
    completionDate: '',
    completionSupervisor: '',
    completionMeterImage: '',
    completionItemImage: '',
    vendorType: '',
    indoorVendorName: '',
    outdoorVendorName: '',
    outdoorVendorReason: '',
    status: '',
  });

  const { user } = useSelector((state) => state.auth);

  const [UpdatePeriodicRequest, { isLoading }] =
    useUpdatePeriodicRequestMutation();
  const [completionMeterImgUrl, setCompletionMeterImgUrl] = useState('');
  const [completionItemImgUrl, setCompletionItemImgUrl] = useState('');

  const handleSelectVendorChange = (selectedOption, fieldName) => {
    setFormValues((prevState) => ({
      ...prevState,
      [fieldName]: selectedOption.label,
    }));
  };

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    // console.log(name, value);

    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      ...formValues,
      id: parseInt(id), // Ensure ID is included in the payload and is an integer
    };
    formData.completionMeterReading = formValues.completionMeterReading;
    formData.completionDate = new Date(formValues.completionDate).toISOString();
    formData.vendorType = formValues.vendorType;
    formData.indoorVendorName = formValues.indoorVendorName;
    formData.outdoorVendorName = formValues.outdoorVendorName;
    formData.outdoorVendorReason = formValues.outdoorVendorReason;
    formData.completionSupervisor = formValues.completionSupervisor;
    formData.completionMeterImage = completionMeterImgUrl;
    formData.completionItemImage = completionItemImgUrl;
    formData.status = 'completed';

    try {
      if (
        !formData.completionMeterReading ||
        !formData.completionDate ||
        !formData.vendorType ||
        !formData.completionSupervisor ||
        !formData.completionItemImage ||
        !formData.completionMeterImage ||
        (formData.vendorType === 'indoor' && !formData.indoorVendorName) ||
        (formData.vendorType === 'outdoor' &&
          (!formData.outdoorVendorName || !formData.outdoorVendorReason))
      ) {
        showErrorToast('All required fields must be filled out');
        return;
      }
      console.log('Submitting form data:', formData);
      await UpdatePeriodicRequest({ id: id, formData }).unwrap();
      showSuccessToast('Periodic Request Completed Successfully!');
      navigate(-1);
    } catch (err) {
      console.log(err);
      showErrorToast(
        'An error has occurred while completing the periodic request',
      );
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-600">
        <BreadcrumbNav
          pageName="Periodic Maintenance Completion Form"
          pageNameprev="Periodic Maintenance" //show the name on top heading
          pagePrevPath="periodic" // add the previous path to the navigation
        />
        <div className=" gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="text-md text-black dark:text-white font-medium">
                  Periodic Maintenance Completion Information
                </h3>
              </div>

              <div className="p-7">
                <div>
                  {
                    <>
                      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                          <label
                            className="mb-3 block text-md font-medium text-black dark:text-white"
                            htmlFor="completionMeterReading"
                          >
                            Odometer Reading
                          </label>
                          <div className="relative">
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="text"
                              name="completionMeterReading"
                              id="completionMeterReading"
                              placeholder="50,000 km"
                              onChange={handleChangeValue}
                              value={formValues?.completionMeterReading}
                              // disabled
                            />
                          </div>
                        </div>
                        <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                          <label
                            className="mb-3 block text-md font-medium text-black dark:text-white"
                            htmlFor="completionDate"
                          >
                            Date of Periodic Maintenance
                          </label>
                          <div className="relative">
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="datetime-local"
                              name="completionDate"
                              id="completionDate"
                              placeholder="Select Date"
                              onChange={handleChangeValue}
                              value={formValues?.completionDate}
                            />
                          </div>
                        </div>
                        <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                          <label
                            className="mb-3 block text-md font-medium text-black dark:text-white"
                            htmlFor="completionSupervisor"
                          >
                            Supervisor Name
                          </label>
                          <div className="relative">
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="text"
                              name="completionSupervisor"
                              id="completionSupervisor"
                              placeholder="Supervisor Name"
                              onChange={handleChangeValue}
                              value={formValues?.completionSupervisor}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3">
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
                                handleSelectVendorChange(
                                  selectedOption,
                                  'vendorType',
                                )
                              }
                              placeholder="Select Vendor Type"
                            />
                          </div>
                        </div>

                        {formValues.vendorType === 'Indoor' && (
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
                                  handleSelectVendorChange(
                                    selectedOption,
                                    'indoorVendorName',
                                  )
                                }
                                placeholder="Select Indoor Vendor"
                              />
                            </div>
                          </div>
                        )}

                        {formValues.vendorType === 'Outdoor' && (
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
                                onChange={handleChangeValue}
                                value={formValues.outdoorVendorName}
                              />
                            </div>
                          </div>
                        )}

                        {formValues.vendorType === 'Outdoor' && (
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
                                onChange={handleChangeValue}
                                value={formValues.outdoorVendorReason}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                        <div className="w-full sm:w-1/2 md:w-1/3">
                          <label
                            className="mb-3 block text-md font-medium text-black dark:text-white"
                            htmlFor="completionMeter"
                          >
                            Meter Picture
                          </label>
                          <div className="relative">
                            <UploadWidget
                              setImgUrl={setCompletionMeterImgUrl}
                              id="completionMeterImgUrlUploadWidget" // Unique identifier for this instance
                            />
                            {completionMeterImgUrl && (
                              <div className=" flex justify-center items-center border border-blue-200 p-4 bg-slate-200">
                                <img
                                  src={completionMeterImgUrl}
                                  alt="Periodic Completion Meter Image"
                                  className="object-contain h-48 w-48"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="w-full sm:w-1/2 md:w-1/3">
                          <label
                            className="mb-3 block text-md font-medium text-black dark:text-white"
                            htmlFor="completionItem"
                          >
                            Periodic Item Image
                          </label>
                          <div className="relative">
                            <UploadWidget
                              setImgUrl={setCompletionItemImgUrl}
                              id="completionItemImgUrlUploadWidget" // Unique identifier for this instance
                            />
                            {completionItemImgUrl && (
                              <div className=" flex justify-center items-center border border-blue-200 p-4 bg-slate-200">
                                <img
                                  src={completionItemImgUrl}
                                  alt="Periodic Item Image"
                                  className="object-contain h-48 w-48"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  }
                </div>

                <div className="mr-5">
                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black dark:border-strokedark dark:text-white transition duration-150 ease-in-out hover:border-gray dark:hover:border-white "
                      type="button"
                      onClick={() => navigate(-1)}
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
                          onClick={handleSubmit}
                        >
                          Save
                        </button>
                      )}
                    </>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default CompletePeriodicForm;
