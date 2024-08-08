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
import { stationOptions, periodicThreshold } from '../../constants/Data';
import { customStyles } from '../../constants/Styles';
import UploadWidget from '../../components/UploadWidget';
import { formatDateAndTime, formatDateForInput } from '../../utils/helpers';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';

const UpdatePeriodicForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showErrorToast, showSuccessToast } = useToast();
  const [isOdometerMalfunctioned, setIsOdometerMalfunctioned] = useState(false);
  const [formValues, setFormValues] = useState({ ...addPeriodicRequestSchema });

  const { user } = useSelector((state) => state.auth);
  const { data: roles } = useGetRolesByCompanyIdQuery(user?.companyId);
  const [UpdatePeriodicRequest, { isLoading }] =
    useUpdatePeriodicRequestMutation();
  const { data: parameters } = useGetPeriodicParametersQuery();
  const { data: periodicData, refetch } = useGetPeriodicRequestQuery(id);
  const [periodicType, setPeriodicType] = useState([]);
  const [completionMeterImgUrl, setCompletionMeterImgUrl] = useState('');
  const [completionItemImgUrl, setCompletionItemImgUrl] = useState('');

  useEffect(() => {
    if (parameters) {
      const _periodicType = parameters?.data?.map((e) => ({
        value: e?.id,
        label: e?.job,
      }));
      setPeriodicType(_periodicType);
    }
  }, [parameters]);

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

  const {
    data: periodicTypeDetails,
    refetch: periodicTypeRefetch,
    isError: isPeriodicTypeDetailsError,
    error: periodicTypeDetailsError,
  } = useGetOneVehiclePeriodicTypeDetailsQuery(
    {
      vehicleNo: formValues?.registrationNo,
      periodicType: formValues?.periodicType,
    },
    { skip: true },
  );

  const vehicleLoadOptions = (inputValue, callback) => {
    if (!inputValue) {
      callback([]);
      return;
    }
    if (vehicles && vehicles.data) {
      const filteredOptions = vehicles.data
        .filter((vehicle) =>
          vehicle.registrationNo
            .toLowerCase()
            .includes(inputValue.toLowerCase()),
        )
        .map((vehicle) => ({
          value: vehicle.id,
          label: vehicle.registrationNo,
        }));
      callback(filteredOptions);
    } else {
      callback([]);
    }
  };

  const handleNormalSelectChange = (selectedOption, name) => {
    setFormValues({
      ...formValues,
      [name]: selectedOption.value,
    });
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
      companyId: parseInt(user?.companyId),
      id: parseInt(id), // Ensure ID is included in the payload and is an integer
    };
    if (formData.lastDateOfChange === '-') {
      delete formData.lastDateOfChange;
    }
    if (formData.lastChangedMeterReading === '-') {
      delete formData.lastChangedMeterReading;
    }
    if (formData.lastDateOfChange) {
      formData.lastDateOfChange = new Date(
        formData.lastDateOfChange,
      ).toISOString();
    }

    // Transform the periodicType to periodicTypeId
    if ('periodicType' in formData) {
      formData.periodicTypeId = formData.periodicType;
      delete formData.periodicType;
    }

    // Convert quantity to integer
    if ('quantity' in formData) {
      formData.quantity = parseInt(formData.quantity);
    }

    console.log('Form data', formData); // Log formData to check the payload

    try {
      await UpdatePeriodicRequest({ id, formData });
      showSuccessToast('Periodic Request Sent Successfully!');
      navigate(-1);
    } catch (err) {
      console.log(err);
      showErrorToast('An error has occurred while sending Periodic request');
    }
  };

  useEffect(() => {
    if (periodicData) {
      const periodicTypeLabel = parameters?.data?.find(
        (param) => param.id === periodicData.data.periodicTypeId,
      )?.job;

      const _formValues = {
        ...formValues,
        ...periodicData?.data,
        periodicType: periodicData.data.periodicTypeId,
        periodicTypeLabel: periodicTypeLabel,
      };

      setFormValues(_formValues);
    }
  }, [periodicData, id, parameters]);

  useEffect(() => {
    if (vehicleDetails) {
      setFormValues((prevState) => ({
        ...prevState,
        driverName: vehicleDetails?.data?.name,
        gbmsNo: vehicleDetails?.data?.employeeId,
        make: vehicleDetails?.data?.make,
        meterReading: periodicData?.data?.oddometerReading,
        aplCardNo: vehicleDetails?.data?.cardNumber,
      }));
    }
  }, [vehicleDetails]);

  useEffect(() => {
    if (periodicTypeDetails) {
      const lastRecord =
        periodicTypeDetails?.data[periodicTypeDetails?.data?.length - 1];

      setFormValues((prevState) => ({
        ...prevState,
        lastChangedMeterReading: lastRecord?.meterReading || '-',
        lastDateOfChange: lastRecord?.created_at,
      }));
    }
  }, [periodicTypeDetails]);

  useEffect(() => {
    if (
      !isNaN(formValues.meterReading) &&
      !isNaN(formValues.lastChangedMeterReading)
    ) {
      if (
        formValues.lastChangedMeterReading &&
        formValues.lastChangedMeterReading
      ) {
        let _runningDifference =
          formValues.meterReading - formValues.lastChangedMeterReading;
        _runningDifference = Math.max(0, _runningDifference);
        setFormValues((prevState) => ({
          ...prevState,
          runningDifference: _runningDifference,
        }));
      }
    }
  }, [formValues.lastChangedMeterReading, formValues.meterReading]);

  const getSelectedOption = (value, options) =>
    options.find((option) => option.value === value) || null;

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-600">
        <BreadcrumbNav
          pageName="Periodic Maintenance Update Form"
          pageNameprev="Periodic Maintenance" //show the name on top heading
          pagePrevPath="periodic" // add the previous path to the navigation
        />
        <div className=" gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="text-md text-black dark:text-white font-medium">
                  Periodic Maintenance Update Information
                </h3>
              </div>

              <div className="p-7">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2 md:w-1/3">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="station"
                    >
                      Station
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                        type="text"
                        name="station"
                        id="station"
                        value={formValues?.station}
                        readOnly
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
                        onChange={handleChangeValue}
                        value={formValues.make}
                        disabled
                      />
                    </div>
                  </div>

                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="current_odo"
                    >
                      Current Meter Reading (Auto)
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                        type="text"
                        name="currentOddometerReading"
                        id="current_odo"
                        placeholder="Odometer Reading"
                        onChange={handleChangeValue}
                        value={vehicleDetails?.data?.oddometerReading}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  {/* Odometer Malfunction Radio Button */}
                  <div className="w-full sm:w-1/2 md:w-1/3">
                    <label className="block text-md font-medium text-black dark:text-white">
                      Odometer Malfunctioned?
                    </label>
                    <div className="mt-2">
                      <label className="inline-flex items-center mr-6">
                        <input
                          type="radio"
                          name="odometerMalfunctioned"
                          checked={isOdometerMalfunctioned}
                          onChange={() => setIsOdometerMalfunctioned(true)}
                          className="form-radio"
                        />
                        <span className="ml-2">Yes</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="odometerMalfunctioned"
                          checked={!isOdometerMalfunctioned}
                          onChange={() => setIsOdometerMalfunctioned(false)}
                          className="form-radio"
                        />
                        <span className="ml-2">No</span>
                      </label>
                    </div>
                  </div>

                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="meterReading"
                    >
                      Current Meter Reading (Manually)
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
                        disabled={formValues.status === 'approved'}
                      />
                    </div>
                  </div>

                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
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
                        placeholder="Enter Driver Name"
                        value={formValues?.driverName}
                        disabled
                      />
                    </div>
                  </div>

                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="gbmsNo"
                    >
                      Employee Id.
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                        type="text"
                        name="gbmsNo"
                        id="gbmsNo"
                        placeholder="Enter Driver GBMS No."
                        onChange={handleChangeValue}
                        value={formValues?.gbmsNo}
                        disabled
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
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
                        placeholder="0203020392011"
                        value={formValues?.aplCardNo}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2 md:w-1/3">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="periodicType"
                    >
                      Periodic Type
                    </label>
                    <div className="relative">
                      <Select
                        styles={customStyles}
                        className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                        options={periodicType}
                        value={getSelectedOption(
                          formValues.periodicType,
                          periodicType,
                        )}
                        onChange={(selectedOption) =>
                          handleNormalSelectChange(
                            selectedOption,
                            'periodicType',
                          )
                        }
                        placeholder="Select Periodic Type"
                        isDisabled
                      />
                    </div>
                  </div>

                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="lastDateOfChange"
                    >
                      Last Date of Change
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                        type="text"
                        name="lastDateOfChange"
                        id="lastDateOfChange"
                        placeholder="Last Date Of Change"
                        onChange={handleChangeValue}
                        value={formatDateAndTime(formValues?.lastDateOfChange)}
                        disabled
                      />
                    </div>
                  </div>

                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-small text-black dark:text-white"
                      htmlFor="meterReading"
                    >
                      Last Changed Meter Reading
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                        type="text"
                        name="meterReading"
                        id="meterReading"
                        placeholder="Last Record Reading"
                        value={formValues?.lastChangedMeterReading}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white truncate"
                      htmlFor="runningDifference"
                      title={`Last Odo Reading  change`}
                    >
                      Odometer Running Difference
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                        type="text"
                        name="runningDifference"
                        id="runningDifference"
                        placeholder="50000"
                        value={formValues?.runningDifference}
                        disabled
                      />
                    </div>
                  </div>

                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="amount"
                    >
                      Amount
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary "
                        type="number"
                        name="amount"
                        id="amount"
                        placeholder="Enter periodic item price"
                        onChange={handleChangeValue}
                        value={formValues.amount}
                        disabled={formValues.status === 'approved'}
                      />
                    </div>
                  </div>

                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="dueStatus"
                    >
                      Due Status
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                        type="text"
                        name="dueStatus"
                        id="dueStatus"
                        placeholder="Not Due"
                        value={formValues.dueStatus}
                        disabled
                      />
                    </div>
                  </div>

                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="quantity"
                    >
                      Quantity
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="number"
                        name="quantity"
                        id="quantity"
                        placeholder="Enter Quantity"
                        onChange={handleChangeValue}
                        value={formValues.quantity}
                        disabled={formValues.status === 'approved'}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="extras"
                    >
                      Extras
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="extras"
                        id="extras"
                        placeholder="Enter Oil Filter Type etc etc"
                        onChange={handleChangeValue}
                        value={formValues.extras}
                        disabled={formValues.status === 'approved'}
                      />
                    </div>
                  </div>
                </div>

                {formValues.status === 'approved' && (
                  <div>
                    <>
                      <div className="border-b border-stroke py-4 dark:border-strokedark mb-7">
                        <h3 className="text-lg text-black dark:text-white font-semibold">
                          Completion Information
                        </h3>
                      </div>

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
                              value={formValues.completionMeterReading}
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
                              type="date"
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
                  </div>
                )}

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

export default UpdatePeriodicForm;
