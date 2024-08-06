import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { useSelector } from 'react-redux';
import useToast from '../../hooks/useToast';
import { useGetVehicleByCompanyIdQuery } from '../../services/vehicleSlice';
import {
  useGetOneEmergencyRequestQuery,
  useUpdateEmergencyRequestMutation,
} from '../../services/emergencySlice';
import LoadingButton from '../../components/LoadingButton';
import Select from 'react-select';
import {
  stationOptions,
  vendorType,
  indoorVendorName,
  serviceType,
} from '../../constants/Data';
import AsyncSelect from 'react-select/async';
import { customStyles } from '../../constants/Styles';
import MultipleUploadWidget from '../../components/MultipleUploadWidget';
import { addEmergencyRequestSchema } from '../../utils/schemas';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';

const EmergencyProcessForm = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { showErrorToast, showSuccessToast } = useToast();
  const { user } = useSelector((state) => state.auth);

  const [formValues, setFormValues] = useState({
    ...addEmergencyRequestSchema,
  });

  const { data: EmergencyData, isLoading } = useGetOneEmergencyRequestQuery(id);
  const [UpdateEmergencyRequest, { isLoading: updateLoading }] =
    useUpdateEmergencyRequestMutation();
  const [
    emergencyRepairCompletionImgUrls,
    setEmergencyRepairCompletionImgUrls,
  ] = useState([]);
  const [emergencyReceiptImgUrls, setEmergencyReceiptImgUrls] = useState([]);

  useEffect(() => {
    if (EmergencyData) {
      let eData = EmergencyData?.data;
      setFormValues({
        ...formValues,
        station: eData?.station,
        registrationNo: eData?.registrationNo,
        driverName: eData?.driverName,
        aplCardNo: eData?.aplCardNo,
        make: eData?.make,
        gbmsNo: eData?.gbmsNo,
        ce: eData?.ce,
        meterReading: eData?.meterReading,
        rm_omorName: eData?.rm_omorName,
        emergencyRepairRequestImgs: eData?.emergencyRepairRequestImgs,
        emergencyRepairStatementVideos: eData?.emergencyRepairStatementVideos,
        emergencySupervisor: eData?.emergencySupervisor,
        emergencyReceiptImgs: eData?.emergencyReceiptImgs,
        emergencyRepairCompletionImgs: eData?.emergencyRepairCompletionImgs,
        services: eData?.services || [],
        status: eData?.status,
      });

      setEmergencyRepairCompletionImgUrls(
        eData?.emergencyRepairCompletionImgs || [],
      );
      setEmergencyReceiptImgUrls(eData?.emergencyReceiptImgs || []);
    }
  }, [EmergencyData]);

  const { data: vehicles, isLoading: vehicleLoading } =
    useGetVehicleByCompanyIdQuery({
      companyId: user?.companyId,
      station: formValues?.station,
    });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleServiceChange = (index, fieldName, value) => {
    const updatedServices = formValues.services.map((service, i) =>
      i === index ? { ...service, [fieldName]: value } : service,
    );
    setFormValues({
      ...formValues,
      services: updatedServices,
    });
  };

  const handleDelete = (indexToDelete, setImgUrls) => {
    setImgUrls((prevUrls) =>
      prevUrls.filter((url, index) => index !== indexToDelete),
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      ...formValues,
      emergencyRepairCompletionImgs: emergencyRepairCompletionImgUrls,
      emergencyReceiptImgs: emergencyReceiptImgUrls,
    };

    if (areAllFieldsFilled()) {
      formData.status = 'Completed';
    }

    try {
      await UpdateEmergencyRequest({ id, formData }).unwrap();
      showSuccessToast('Request Processed Successfully!');
      navigate(-1);
    } catch (err) {
      showErrorToast(
        'An error has occurred while updating emergency Maintenance Request',
      );
    }
  };

  const areAllFieldsFilled = () => {
    const requiredFields = [
      'station',
      'registrationNo',
      'aplCardNo',
      'make',
      'ce',
      'meterReading',
      'rm_omorName',
      'emergencyRepairRequestImgs',
      'emergencyRepairStatementVideos',
      'emergencySupervisor',
      'emergencyReceiptImgs',
      'emergencyRepairCompletionImgs',
    ];

    // Check main fields
    for (let field of requiredFields) {
      if (!formValues[field]) {
        return false;
      }
    }

    // Check services fields
    for (let service of formValues.services) {
      if (
        !service.serviceType ||
        !service.description ||
        !service.repairCost ||
        !service.vendorType ||
        (service.vendorType === 'Indoor' && !service.indoorVendorName) ||
        (service.vendorType === 'Outdoor' &&
          (!service.outdoorVendorName || !service.outdoorVendorReason))
      ) {
        return false;
      }
    }

    return true;
  };

  const addService = () => {
    setFormValues({
      ...formValues,
      services: [
        ...formValues.services,
        {
          vendorType: 'Indoor',
          indoorVendorName: '',
          outdoorVendorName: '',
          outdoorVendorReason: '',
          description: '',
          repairCost: '',
          serviceType: '',
        },
      ],
    });
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-600">
        <BreadcrumbNav
          pageName="Emergency Maintenance Process Form"
          pageNameprev="Emergency Maintenance" //show the name on top heading
          pagePrevPath="Emergency-Maintenance" // add the previous path to the navigation
        />
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
                          className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                          options={stationOptions}
                          value={
                            formValues?.station
                              ? {
                                  value: formValues?.station,
                                  label: formValues?.station,
                                }
                              : null
                          }
                          isDisabled
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
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                          type="text"
                          name="make"
                          id="make"
                          placeholder="Make"
                          onChange={handleChange}
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
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                          type="text"
                          name="meterReading"
                          id="meterReading"
                          placeholder="50,000 km"
                          onChange={handleChange}
                          value={formValues.meterReading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/1 md:w-1/2 lg:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="driverName"
                      >
                        Driver Name
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
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
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
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
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
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
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                          type="text"
                          name="ce"
                          id="ce"
                          placeholder="Enter CE"
                          onChange={handleChange}
                          value={formValues.ce}
                          disabled
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
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                          type="text"
                          name="rm_omorName"
                          id="rm_omorName"
                          placeholder="Enter RM/OMOR Name"
                          onChange={handleChange}
                          value={formValues.rm_omorName}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/3">
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
                          onChange={handleChange}
                          value={formValues?.emergencySupervisor}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Services */}
                  <div className="mb-5.5 border-2 p-5">
                    <label className="mb-3 block text-md font-bold text-black dark:text-white ">
                      Services
                    </label>
                    {formValues.services.map((service, index) => (
                      <div key={index} className="mb-5.5">
                        <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                          <div className="w-full sm:w-1/2 md:w-1/3">
                            <label className="mb-3 block text-md font-medium text-black dark:text-white">
                              Select Service Type
                            </label>
                            <Select
                              styles={customStyles}
                              className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                              options={serviceType}
                              value={
                                service.serviceType
                                  ? {
                                      value: service.serviceType,
                                      label: service.serviceType,
                                    }
                                  : null
                              }
                              onChange={(selectedOption) =>
                                handleServiceChange(
                                  index,
                                  'serviceType',
                                  selectedOption.value,
                                )
                              }
                              placeholder="Select Service Type"
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
                  {/* PICTURES */}
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="emergencyRepairRequestImgWicdget"
                      >
                        Emergency Repair Images
                      </label>
                      <div className="relative">
                        <ul className="list-disc pl-5">
                          {formValues.emergencyRepairRequestImgs?.map(
                            (url, index) => (
                              <li key={index}>
                                <img
                                  src={url}
                                  alt={`Emergency Repair Image ${index + 1}`}
                                  className="object-contain h-48 w-48 mb-4"
                                />
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="emergencyRepairStatementVideos"
                      >
                        Driver Statement Videos
                      </label>
                      <div className="relative">
                        <ul className="list-disc pl-5">
                          {formValues.emergencyRepairStatementVideos?.map(
                            (url, index) => (
                              <li key={index}>
                                <img
                                  src={url}
                                  alt={`Driver Statement ${index + 1}`}
                                  className="object-contain h-48 w-48 mb-4"
                                />
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="emergencyRepairCompletionImgWidget"
                      >
                        Emergency Completion Images
                      </label>
                      <div className="relative">
                        <MultipleUploadWidget
                          setImgUrls={setEmergencyRepairCompletionImgUrls}
                          id="emergencyRepairCompletionImgWidget"
                        />
                        <ul className="list-disc pl-5">
                          {emergencyRepairCompletionImgUrls.map(
                            (url, index) => (
                              <li key={index}>
                                <div className="relative border border-gray-300 bg-white m-2 p-2">
                                  <button
                                    onClick={() =>
                                      handleDelete(
                                        index,
                                        setEmergencyRepairCompletionImgUrls,
                                      )
                                    }
                                    className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 text-white rounded-full p-1"
                                  >
                                    &#10005;
                                  </button>
                                  <img
                                    src={url}
                                    alt={`Emergency Job Completion Images ${index + 1}`}
                                    className="object-contain h-48 w-48"
                                  />
                                </div>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="emergencyReceiptImgWidget"
                      >
                        Emergency Receipt Images
                      </label>
                      <div className="relative">
                        <MultipleUploadWidget
                          setImgUrls={setEmergencyReceiptImgUrls}
                          id="emergencyReceiptImgWidget"
                        />
                        <ul className="list-disc pl-5">
                          {emergencyReceiptImgUrls.map((url, index) => (
                            <li key={index}>
                              <div className="relative border border-gray-300 bg-white m-2 p-2">
                                <button
                                  onClick={() =>
                                    handleDelete(
                                      index,
                                      setEmergencyReceiptImgUrls,
                                    )
                                  }
                                  className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 text-white rounded-full p-1"
                                >
                                  &#10005;
                                </button>
                                <img
                                  src={url}
                                  alt={`Emergency Receipt Image ${index + 1}`}
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
                        type="submit"
                      >
                        Cancel
                      </button>
                      {areAllFieldsFilled() ? (
                        updateLoading ? (
                          <LoadingButton
                            btnText="Completing..."
                            isLoading={updateLoading}
                          />
                        ) : (
                          <button
                            className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                            type="submit"
                          >
                            Complete
                          </button>
                        )
                      ) : updateLoading ? (
                        <LoadingButton
                          btnText="Updating..."
                          isLoading={updateLoading}
                        />
                      ) : (
                        <button
                          className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                          type="submit"
                        >
                          Update Record
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

export default EmergencyProcessForm;
