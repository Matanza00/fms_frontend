import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetVehicleQuery } from '../../services/vehicleSlice';
import {
  useAddDailyRequestMutation,
  useUpdateDailyByRequestMutation,
  useGetChecklistDataQuery,
} from '../../services/dailySlice'; // Corrected import
import { useGetTagDriversFromVehicleQuery } from '../../services/tagDriverSlice';
import { useGetOneVehicleDetailsQuery } from '../../services/periodicSlice';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import UploadWidget from '../../components/UploadWidget';
import { customStyles } from '../../constants/Styles';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';
import LoadingButton from '../../components/LoadingButton';
import useToast from '../../hooks/useToast';
import DefaultLayout from '../../layout/DefaultLayout';
import {
  stationOptions,
  vendorType,
  indoorVendorName,
  serviceType,
} from '../../constants/Data';
import { addDailyRequestProcessSchema } from '../../utils/schemas';
import MultipleUploadWidget from '../../components/MultipleUploadWidget';

const DailyProcessForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showErrorToast, showSuccessToast } = useToast();
  const [totalFaults, setTotalFaults] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [UpdateDailyByRequest, { isLoading: updateLoading }] =
    useUpdateDailyByRequestMutation();
  const [dailyRepairRequestImgUrls, setDailyRepairRequestImgUrls] = useState(
    [],
  );
  const [dailyStatementVideoUrls, setDailyRepairStatementVideoUrls] = useState(
    [],
  );
  const [dailyRepairCompletionImgUrls, setDailyRepairCompletionImgUrls] =
    useState([]);
  const [dailyReceiptImgUrls, setDailyReceiptImgUrls] = useState([]);

  const booleanFields = [
    'vehicleInspection',
    'engineOil',
    'transmissionFluid',
    'coolant',
    'brakeFluid',
    'windshieldWasherFluid',
    'tireInspection',
    'headlights',
    'taillights',
    'brakeLights',
    'turnLights',
    'hazardLights',
    'brakes',
    'brakeFluidLevel',
    'battery',
    'interiorCleanliness',
    'registrationDocument',
    'insuranceDocument',
    'permitDocument',
    'firstAidKit',
    'fireExtinguisher',
    'reflectiveTriangles',
    'fuelLevel',
  ];

  const {
    data: tagDriverByVehicle,
    isError: isDriverTaggedError,
    error: tagDriverError,
    refetch: refetchTagDrivers,
  } = useGetTagDriversFromVehicleQuery(id);

  const registrationNo = id;
  const {
    data: getChecklistData,
    isLoading,
    error,
  } = useGetChecklistDataQuery({
    registrationNo,
  });

  const [formValues, setFormValues] = useState({
    ...addDailyRequestProcessSchema,
    dailyServices: [],
  });

  useEffect(() => {
    if (getChecklistData) {
      const filteredData = {};
      booleanFields.forEach((field) => {
        if (getChecklistData.data[field] === false) {
          filteredData[field] = getChecklistData.data[field];
        }
      });

      const faults = Object.keys(filteredData);
      setTotalFaults(faults);
    }
  }, [getChecklistData]);

  useEffect(() => {
    const newDailyServices = totalFaults.map((fault) => ({
      id: null, // New field to track existing services
      vendorType: 'Indoor',
      indoorVendorName: '',
      outdoorVendorName: '',
      outdoorVendorReason: '',
      description: '',
      repairCost: '',
      serviceType: fault,
    }));

    setFormValues((prevValues) => ({
      ...prevValues,
      dailyServices: newDailyServices,
    }));
  }, [totalFaults]);

  const addService = () => {
    setFormValues((prevValues) => ({
      ...prevValues,
      dailyServices: [
        ...prevValues.dailyServices,
        {
          id: null,
          vendorType: 'Indoor',
          indoorVendorName: '',
          outdoorVendorName: '',
          outdoorVendorReason: '',
          description: '',
          repairCost: '',
          serviceType: '',
        },
      ],
    }));
  };

  const handleDelete = (indexToDelete, setImgUrls) => {
    setImgUrls((prevUrls) =>
      prevUrls.filter((url, index) => index !== indexToDelete),
    );
  };

  const { data: vehicleData, isLoading: vehicleLoading } =
    useGetVehicleQuery(id);

  const [addDailyRequest, { isLoading: submitLoading }] =
    useAddDailyRequestMutation();

  useEffect(() => {
    if (vehicleData && vehicleData.data) {
      const vehicle = vehicleData.data;
      let dData = vehicle?.data;
      setFormValues((prevState) => ({
        ...prevState,
        station: vehicle.station,
        registrationNo: vehicle.registrationNo,
        make: vehicle.make,
        meterReading: vehicle.oddometerReading,
        gbmsNo: tagDriverByVehicle?.data?.driver?.employeeId,
        aplCardNo: tagDriverByVehicle?.data?.cardNo,
        driverName: tagDriverByVehicle?.data?.driver?.name,
        dailyRepairRequestImgs: dailyRepairRequestImgUrls,
        dailyRepairStatementVideos: dailyStatementVideoUrls,
        dailyRepairCompletionImgs: dailyRepairCompletionImgUrls,
        dailyReceiptImgs: dailyReceiptImgUrls,
      }));
    }
  }, [vehicleData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleSelectChange = (fieldName, selectedOption) => {
    setFormValues((prevState) => ({
      ...prevState,
      [fieldName]: selectedOption.value,
    }));
  };

  const handleServiceChange = (index, fieldName, value) => {
    const updatedDailyServices = formValues.dailyServices.map((service, i) =>
      i === index ? { ...service, [fieldName]: value } : service,
    );
    setFormValues({
      ...formValues,
      dailyServices: updatedDailyServices,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      ...formValues,
      dailyRepairRequestImgs: dailyRepairRequestImgUrls,
      dailyRepairStatementVideos: dailyStatementVideoUrls,
      dailyRepairCompletionImgs: dailyRepairCompletionImgUrls,
      dailyReceiptImgs: dailyReceiptImgUrls,
    };

    try {
      await UpdateDailyByRequest({
        id: getChecklistData?.data?.id,
        formData: formData,
      }).unwrap();
      showSuccessToast('Daily Process Added Successfully!');
      navigate(-1);
    } catch (err) {
      console.log('Error during submission:', err);
      showErrorToast('An error has occurred while adding daily process.');
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-600">
        <BreadcrumbNav
          pageName="Daily Maintenance Process Form"
          pageNameprev="Daily Maintenance"
          pagePrevPath="daily-maintenance"
        />
        <div className="gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="p-7">
                <form onSubmit={handleSubmit}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <label className="mb-3 block text-md font-medium text-black dark:text-white">
                        Station
                      </label>
                      <Select
                        styles={customStyles}
                        className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        options={stationOptions}
                        value={
                          formValues.station
                            ? {
                                value: formValues.station,
                                label: formValues.station,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleSelectChange('station', selectedOption)
                        }
                      />
                    </div>

                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <label className="mb-3 block text-md font-medium text-black dark:text-white">
                        Vehicle Number
                      </label>
                      <AsyncSelect
                        styles={customStyles}
                        disabled
                        className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                        value={
                          formValues.registrationNo
                            ? {
                                value: formValues.registrationNo,
                                label: formValues.registrationNo,
                              }
                            : null
                        }
                        isDisabled
                      />
                    </div>

                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <label className="mb-3 block text-md font-medium text-black dark:text-white">
                        Make
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="make"
                        placeholder="Make"
                        onChange={handleChange}
                        value={formValues.make}
                      />
                    </div>

                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <label className="mb-3 block text-md font-medium text-black dark:text-white">
                        Current Odometer Reading
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="meterReading"
                        placeholder="50,000 km"
                        onChange={handleChange}
                        value={formValues.meterReading}
                      />
                    </div>
                  </div>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <label className="mb-3 block text-md font-medium text-black dark:text-white">
                        Driver Name
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="driverName"
                        placeholder="Driver Name"
                        onChange={handleChange}
                        value={formValues.driverName}
                      />
                    </div>

                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <label className="mb-3 block text-md font-medium text-black dark:text-white">
                        GBMS No.
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="gbmsNo"
                        placeholder="GBMS No."
                        onChange={handleChange}
                        value={formValues.gbmsNo}
                      />
                    </div>

                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <label className="mb-3 block text-md font-medium text-black dark:text-white">
                        APL Card No.
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="aplCardNo"
                        placeholder="APL Card No."
                        onChange={handleChange}
                        value={formValues.aplCardNo}
                      />
                    </div>
                  </div>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <label className="mb-3 block text-md font-medium text-black dark:text-white">
                        Supervisor Name
                      </label>
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="dailySupervisor"
                        placeholder="Supervisor Name"
                        onChange={handleChange}
                        value={formValues.dailySupervisor || undefined}
                      />
                    </div>
                  </div>
                  <div className="mb-5.5 border-2 p-5">
                    <label className="mb-3 block text-md font-bold text-black dark:text-white ">
                      dailyServices
                    </label>

                    {formValues.dailyServices.map((service, index) => (
                      <div key={index} className="mb-5.5">
                        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                          <div className="w-full sm:w-1/2 md:w-1/3">
                            <label className="mb-3 block text-md font-medium text-black dark:text-white">
                              Daily Jobs
                            </label>
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="text"
                              value={service.serviceType}
                              placeholder="Daily jobs"
                            />
                          </div>

                          <div className="w-full sm:w-1/2 md:w-1/3">
                            <label className="mb-3 block text-md font-medium text-black dark:text-white">
                              Repair Amount
                            </label>
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="number"
                              value={service.repairCost}
                              onChange={(e) =>
                                handleServiceChange(
                                  index,
                                  'repairCost',
                                  e.target.value,
                                )
                              }
                              placeholder="Enter Repair Cost"
                            />
                          </div>

                          <div className="w-full sm:w-1/2 md:w-1/3">
                            <label className="mb-3 block text-md font-medium text-black dark:text-white">
                              Description
                            </label>
                            <input
                              className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              type="text"
                              value={service.description}
                              onChange={(e) =>
                                handleServiceChange(
                                  index,
                                  'description',
                                  e.target.value,
                                )
                              }
                              placeholder="Enter Description"
                            />
                          </div>
                        </div>

                        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                          <div className="w-full sm:w-1/2 md:w-1/3">
                            <label className="mb-3 block text-md font-medium text-black dark:text-white">
                              Select Vendor Type
                            </label>
                            <Select
                              styles={customStyles}
                              className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              options={vendorType}
                              value={{
                                value: service.vendorType,
                                label: service.vendorType,
                              }}
                              onChange={(selectedOption) =>
                                handleServiceChange(
                                  index,
                                  'vendorType',
                                  selectedOption.value,
                                )
                              }
                              placeholder="Select Vendor Type"
                            />
                          </div>

                          {service.vendorType === 'Indoor' && (
                            <div className="w-full sm:w-1/2 md:w-1/3">
                              <label className="mb-3 block text-md font-medium text-black dark:text-white">
                                Select Indoor Vendor
                              </label>
                              <Select
                                styles={customStyles}
                                className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                options={indoorVendorName}
                                value={
                                  service.indoorVendorName
                                    ? {
                                        value: service.indoorVendorName,
                                        label: service.indoorVendorName,
                                      }
                                    : null
                                }
                                onChange={(selectedOption) =>
                                  handleServiceChange(
                                    index,
                                    'indoorVendorName',
                                    selectedOption.value,
                                  )
                                }
                                placeholder="Select Indoor Vendor"
                              />
                            </div>
                          )}

                          {service.vendorType === 'Outdoor' && (
                            <>
                              <div className="w-full sm:w-1/2 md:w-1/3">
                                <label className="mb-3 block text-md font-medium text-black dark:text-white">
                                  Outdoor Vendor Name
                                </label>
                                <input
                                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                  type="text"
                                  value={service.outdoorVendorName}
                                  onChange={(e) =>
                                    handleServiceChange(
                                      index,
                                      'outdoorVendorName',
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Outdoor Vendor Name"
                                />
                              </div>

                              <div className="w-full sm:w-1/2 md:w-1/3">
                                <label className="mb-3 block text-md font-medium text-black dark:text-white">
                                  Outdoor Vendor Reason
                                </label>
                                <input
                                  className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                                  type="text"
                                  value={service.outdoorVendorReason}
                                  onChange={(e) =>
                                    handleServiceChange(
                                      index,
                                      'outdoorVendorReason',
                                      e.target.value,
                                    )
                                  }
                                  placeholder="Reason for Selecting Outside Vendor"
                                />
                              </div>
                            </>
                          )}
                        </div>
                        <hr className="border-t-2 border-gray-300 my-8"></hr>
                      </div>
                    ))}

                    <button
                      type="button"
                      className="mt-3 rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                      onClick={addService}
                    >
                      Add Service
                    </button>
                  </div>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="emergencyRepairRequestImgWidget"
                      >
                        Daily Repair Image
                      </label>
                      <div className="relative">
                        <MultipleUploadWidget
                          setImgUrls={setDailyRepairRequestImgUrls}
                          id="dailyRepairRequestImgWidget"
                        />
                        {dailyRepairRequestImgUrls.length > 0 && (
                          <div className="flex flex-wrap justify-center items-center border border-blue-200 p-4 bg-slate-200">
                            {dailyRepairRequestImgUrls.map((url, index) => (
                              <div
                                key={index}
                                className="relative border border-gray-300 bg-white m-2 p-2"
                              >
                                <button
                                  onClick={() =>
                                    handleDelete(
                                      index,
                                      setDailyRepairRequestImgUrls,
                                    )
                                  }
                                  className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 text-white rounded-full p-1"
                                >
                                  &#10005;
                                </button>
                                <img
                                  src={url}
                                  alt={`Daily Job Image ${index + 1}`}
                                  className="object-contain h-48 w-48"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="emergencyRepairStatementVideoWidget"
                      >
                        Daily Driver Statement Video
                      </label>
                      <div className="relative">
                        <MultipleUploadWidget
                          setImgUrls={setDailyRepairStatementVideoUrls}
                          id="dailyRepairStatementVideoWidget"
                        />
                        {dailyStatementVideoUrls.length > 0 && (
                          <div className="flex flex-wrap justify-center items-center border border-blue-200 p-4 bg-slate-200">
                            {dailyStatementVideoUrls.map((url, index) => (
                              <div
                                key={index}
                                className="relative border border-gray-300 bg-white m-2 p-2"
                              >
                                <button
                                  onClick={() =>
                                    handleDelete(
                                      index,
                                      setDailyRepairStatementVideoUrls,
                                    )
                                  }
                                  className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 text-white rounded-full p-1"
                                >
                                  &#10005;
                                </button>
                                <img
                                  src={url}
                                  alt={`Emergency Job Image ${index + 1}`}
                                  className="object-contain h-48 w-48"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="emergencyRepairCompletionImgWidget"
                      >
                        Daily Completion Images
                      </label>
                      <div className="relative">
                        <MultipleUploadWidget
                          setImgUrls={setDailyRepairCompletionImgUrls}
                          id="dailyRepairCompletionImgWidget"
                        />
                        <ul className="list-disc pl-5">
                          {dailyRepairCompletionImgUrls.map((url, index) => (
                            <li key={index}>
                              <div className="relative border border-gray-300 bg-white m-2 p-2">
                                <button
                                  onClick={() =>
                                    handleDelete(
                                      index,
                                      setDailyRepairCompletionImgUrls,
                                    )
                                  }
                                  className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 text-white rounded-full p-1"
                                >
                                  &#10005;
                                </button>
                                <img
                                  src={url}
                                  alt={`Daily Job Completion Images ${index + 1}`}
                                  className="object-contain h-48 w-48"
                                />
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="dailyReceiptImgWidget"
                      >
                        Daily Receipt Images
                      </label>
                      <div className="relative">
                        <MultipleUploadWidget
                          setImgUrls={setDailyReceiptImgUrls}
                          id="dailyReceiptImgWidget"
                        />
                        <ul className="list-disc pl-5">
                          {dailyReceiptImgUrls.map((url, index) => (
                            <li key={index}>
                              <div className="relative border border-gray-300 bg-white m-2 p-2">
                                <button
                                  onClick={() =>
                                    handleDelete(index, setDailyReceiptImgUrls)
                                  }
                                  className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 text-white rounded-full p-1"
                                >
                                  &#10005;
                                </button>
                                <img
                                  src={url}
                                  alt={`Daily Receipt Image ${index + 1}`}
                                  className="object-contain h-48 w-48"
                                />
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mr-5">
                    <div className="flex justify-end gap-4.5">
                      <button
                        className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black dark:border-strokedark dark:text-white transition duration-150 ease-in-out hover:border-gray dark:hover:border-white"
                        type="button"
                        onClick={() => navigate(-1)}
                      >
                        Cancel
                      </button>
                      {submitLoading ? (
                        <LoadingButton
                          btnText="Submitting..."
                          isLoading={submitLoading}
                        />
                      ) : (
                        <button
                          className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                          type="submit"
                        >
                          Submit
                        </button>
                      )}
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

export default DailyProcessForm;
