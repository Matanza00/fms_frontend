import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { useSelector } from 'react-redux';
import { addFuelRequestSchema } from '../../utils/schemas';
import { useGetRolesByCompanyIdQuery } from '../../services/rolesSlice';
import useToast from '../../hooks/useToast';
import LoadingButton from '../../components/LoadingButton';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { useGetVehicleByCompanyIdQuery } from '../../services/vehicleSlice';
import { useGetTagDriversFromVehicleQuery } from '../../services/tagDriverSlice';
import { useGetOneVehicleDetailsQuery } from '../../services/periodicSlice';
import {
  useAddFuelRequestMutation,
  useGetFuelCardNoQuery,
  useGetFuelRequestQuery,
} from '../../services/fuelSlice';
import { modeOfFueling, requestType } from '../../constants/Data';
import { customStyles } from '../../constants/Styles';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';
import { formatDateAndTime } from '../../utils/helpers';

const FuelRequestForm = () => {
  const navigate = useNavigate();

  const { showErrorToast, showSuccessToast } = useToast();
  const [isOdometerMalfunctioned, setIsOdometerMalfunctioned] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [formValues, setFormValues] = useState({
    ...addFuelRequestSchema,
    station: user?.station, // Pre-fill the station with the user's station
    currentFuelingDate: new Date().toISOString().split('T')[0], // Pre-fill the current date
  });
  const [errors, setErrors] = useState({});

  const [selectedRole, setSelectedRole] = useState(null);
  const { data: roles, refetch: refetchRoles } = useGetRolesByCompanyIdQuery(
    user?.companyId,
  );
  const [fuelReceipImgUrl, setfuelReceipImgUrl] = useState('');
  const [allVehicle, setAllVehicle] = useState([]);

  const [AddFuelRequest, { isLoading }] = useAddFuelRequestMutation();
  const {
    data: vehicles,
    isLoading: vehicleLoading,
    refetch: refetchVehicles,
  } = useGetVehicleByCompanyIdQuery({
    companyId: user?.companyId,
    station: formValues?.station,
  });
  console.log('New Vehicles', vehicles?.data);

  const {
    data: tagDriverByVehicle,
    isError: isDriverTaggedError,
    error: tagDriverError,
    refetch: refetchTagDrivers,
  } = useGetTagDriversFromVehicleQuery(formValues?.registrationNo);

  const {
    data: vehicleDetails,
    isError: isVehicleDetailsError,
    error: vehicleDetailsError,
    refetch: refetchVehicleDetails,
  } = useGetOneVehicleDetailsQuery(formValues?.registrationNo);

  const { data: cardNo, refetch: refetchFuelCardNo } = useGetFuelCardNoQuery({
    vehicleId: formValues.registrationNo,
    cardType: formValues.modeOfFueling,
  });
  console.log('cardNo', cardNo);

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

  useEffect(() => {
    if (vehicles?.data?.length > 0) {
      const filteredOptions = vehicles?.data.map((vehicle) => ({
        value: vehicle.id,
        label: vehicle.registrationNo,
      }));
      setAllVehicle(filteredOptions);
    }
  }, [vehicles?.data]);

  const handleNormalSelectChange = (selectedOption, name) => {
    setFormValues({
      ...formValues,
      [name]: selectedOption.label,
    });
  };

  const handleSelectChange = (fieldName, selectedOption) => {
    if (fieldName == 'registrationNo') {
      setFormValues((prevState) => ({
        ...prevState,
        registrationNo: '',
        cardNo: '',
        driverName: '',
        gbmsNo: '',
        modeOfFueling: '',
        currentOddometerReading: '', //manual reading
        currentOddometerReadingAuto: '',
        // currentOddometerReadingManual: '',
        previousOddometerReading: '',
        // perviousFuelingDate: '',
        quantityOfFuel: '',
        previousFuelQuantity: '',
        rateOfFuel: '',
        amount: '',
        fuelAverage: '',
        fuelReceipt: '',
        odometerImg: '',
        requestType: '',
        fuelType: '',
        lastCreatedAt: '',
      }));
    }
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

  const validationConfig = {
    station: {
      required: true,
      message: 'Station is required.',
    },
    registrationNo: {
      required: true,
      message: 'Vehicle number is required.',
    },
    currentOddometerReading: {
      required: () => !isOdometerMalfunctioned,
      message:
        'Current Odometer Reading is required when odometer is functioning.',
    },
    currentFuelingDate: {
      required: true,
      message: 'Current Fueling Date is required.',
    },
    modeOfFueling: {
      required: true,
      message: 'Mode of Fueling is required.',
    },
    rateOfFuel: {
      required: true,
      message: 'Rate of Fuel is required.',
    },
    quantityOfFuel: {
      required: true,
      message: 'Quantity of Fuel is required.',
    },
    requestType: {
      required: true,
      message: 'Request Type is required.',
    },
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.entries(validationConfig).forEach(([key, { required, message }]) => {
      if (
        (typeof required === 'function' ? required() : required) &&
        !formValues[key]
      ) {
        newErrors[key] = message;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showErrorToast('Please fill in all required fields.');
      return;
    }

    const formData = {
      ...formValues,
      fuelReceipt: fuelReceipImgUrl,
      companyId: parseInt(user?.companyId),
      currentFuelingDate: new Date(formValues.currentFuelingDate).toISOString(),
    };

    try {
      await AddFuelRequest(formData).unwrap();
      showSuccessToast('Fuel Request Sent Successfully!');
      navigate(-1);
    } catch (err) {
      showErrorToast('An error has occurred while sending fuel request');
    }
  };

  useEffect(() => {
    let _amount = formValues.rateOfFuel * formValues.quantityOfFuel;
    setFormValues({ ...formValues, amount: _amount });
  }, [formValues.rateOfFuel, formValues.quantityOfFuel]);

  useEffect(() => {
    let _average =
      (formValues?.currentOddometerReading -
        tagDriverByVehicle?.data?.lastFuelChangedOddoReading) /
      tagDriverByVehicle?.data?.lastFuelChangedQuantity;
    setFormValues({
      ...formValues,
      driverName: tagDriverByVehicle?.data?.driver?.name,
      gbmsNo: tagDriverByVehicle?.data?.driverId,
      fuelType: tagDriverByVehicle?.data?.vehicle?.fuelType,
      make: tagDriverByVehicle?.data?.vehicle?.make,
      previousOddometerReading:
        tagDriverByVehicle?.data?.lastFuelChangedOddoReading,
      previousFuelQuantity: tagDriverByVehicle?.data?.lastFuelChangedQuantity,
      lastCreatedAt: tagDriverByVehicle?.data?.lastCreatedAt,
      fuelAverage: _average,
      //
    });
  }, [tagDriverByVehicle]);

  useEffect(() => {
    if (
      !!formValues.currentOddometerReading &&
      formValues.currentOddometerReading >
        tagDriverByVehicle?.data?.lastFuelChangedOddoReading
    ) {
      let _average =
        (formValues?.currentOddometerReading -
          tagDriverByVehicle?.data?.lastFuelChangedOddoReading) /
        parseInt(tagDriverByVehicle?.data?.lastFuelChangedQuantity);
      setFormValues({
        ...formValues,
        fuelAverage: _average,
      });
    }
    refetchRoles();
    refetchVehicles();
    refetchTagDrivers();
    refetchVehicleDetails();
    refetchFuelCardNo();
  }, [formValues?.currentOddometerReading, tagDriverByVehicle]);

  useEffect(() => {
    if (
      formValues.modeOfFueling === 'PSO' ||
      formValues.modeOfFueling === 'APL'
    ) {
      setFormValues({
        ...formValues,
        cardNo: cardNo?.data?.cardNumber,
      });
    } else if (
      formValues.modeOfFueling === 'Cash' ||
      formValues.modeOfFueling === 'Credit'
    ) {
      setFormValues({
        ...formValues,
        cardNo: '',
      });
    }
  }, [cardNo, formValues.modeOfFueling]);

  useEffect(() => {
    if (vehicleDetails?.data?.oddometerReading) {
      setFormValues((prevValues) => ({
        ...prevValues,
        currentOddometerReadingAuto: vehicleDetails.data.oddometerReading,
      }));
    }
  }, [vehicleDetails]);

  if (isDriverTaggedError) {
    if (!!formValues.registrationNo) {
      showErrorToast(tagDriverError?.data?.message);
    }
  }
  console.log('formValues?.driverName', formValues?.driverName);
  console.log('formValues?.', formValues);

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-600">
        <BreadcrumbNav
          pageName="Add Fuel Request"
          pageNameprev="Fuel Management" //show the name on top heading
          pagePrevPath="fuel-management" // add the previous path to the navigation
        />

        <div className=" gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-md text-black dark:text-white">
                  Fuel Request Information
                </h3>
              </div>
              <div className="p-7">
                {/*********************** INPUT FIELDS *************************************/}
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
                      {/* <AsyncSelect
                        styles={customStyles}
                        className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        loadOptions={vehicleLoadOptions}
                        value={
                          formValues?.registrationNo
                            ? {
                                value: formValues?.registrationNo,
                                label: formValues?.registrationNo,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleSelectChange('registrationNo', selectedOption)
                        }
                        isLoading={vehicleLoading}
                        isDisabled={vehicleLoading}
                        placeholder="Select a Vehicle..."
                      /> */}

                      <Select
                        styles={customStyles}
                        className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        options={allVehicle}
                        value={
                          formValues?.registrationNo
                            ? {
                                value: formValues?.registrationNo,
                                label: formValues?.registrationNo,
                              }
                            : null
                        }
                        onChange={(selectedOption) => {
                          console.log('selected option: ' + selectedOption);
                          handleSelectChange('registrationNo', selectedOption);
                        }}
                        placeholder="Select Vehicle"
                      />
                    </div>
                  </div>

                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="current_odo_auto"
                    >
                      Current Meter Reading (Auto)
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                        type="text"
                        name="currentOddometerReadingAuto"
                        id="current_odo_auto"
                        placeholder="Odometer Reading"
                        onChange={handleChangeValue}
                        value={formValues?.currentOddometerReadingAuto}
                        disabled
                      />
                    </div>
                  </div>

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
                </div>

                <div className="mb-5.5 flex flex-col  gap-5.5 sm:flex-row">
                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="current_odo_manual"
                    >
                      Current Meter Reading (Manually)
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="currentOddometerReading"
                        id="current_odo_manual"
                        placeholder="Odometer Reading"
                        onChange={handleChangeValue}
                        value={formValues?.currentOddometerReading}
                      />
                    </div>
                  </div>

                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="previousOddometerReading"
                    >
                      Previous Odometer Reading
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                        type="text"
                        name="previousOddometerReading"
                        id="previousOddometerReading"
                        placeholder="50,000 km"
                        onChange={handleChangeValue}
                        value={formValues?.previousOddometerReading}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2 md:w-1/3">
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

                  <div className="w-full sm:w-1/2 md:w-1/3">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="driverName"
                    >
                      Driver Name.
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                        type="text"
                        name="driverName"
                        id="driverName"
                        placeholder="Enter Driver Name"
                        onChange={handleChangeValue}
                        value={formValues.driverName || ''}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5.5 flex flex-col  gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2 md:w-1/3">
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
                        placeholder="Vehicle Make"
                        onChange={handleChangeValue}
                        value={formValues?.make}
                        disabled
                      />
                    </div>
                  </div>

                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="currentFuelingDate"
                    >
                      Current Fueling Date
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="date"
                        name="currentFuelingDate"
                        id="currentFuelingDate"
                        placeholder="20/05/2024"
                        onChange={handleChangeValue}
                        value={formValues?.currentFuelingDate}
                        min={new Date().toISOString().split('T')[0]} // Set minimum date to today
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2 md:w-1/3">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="modeOfFueling"
                    >
                      Mode of Fueling
                    </label>
                    <div className="relative">
                      <Select
                        styles={customStyles}
                        className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        options={modeOfFueling}
                        value={
                          formValues?.modeOfFueling
                            ? {
                                value: formValues?.modeOfFueling,
                                label: formValues?.modeOfFueling,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleNormalSelectChange(
                            selectedOption,
                            'modeOfFueling',
                          )
                        }
                        placeholder="Select fueling mode"
                      />
                    </div>
                  </div>

                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="cardNo"
                    >
                      Card No.
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                        type="text"
                        name="cardNo"
                        id="cardNo"
                        placeholder="0000 0000 0000 0000"
                        onChange={handleChangeValue}
                        value={formValues?.cardNo}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2 md:w-1/3">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="rquestType"
                    >
                      Request Type
                    </label>
                    <div className="relative">
                      <Select
                        styles={customStyles}
                        className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        options={requestType}
                        value={
                          formValues?.requestType
                            ? {
                                value: formValues?.requestType,
                                label: formValues?.requestType,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleNormalSelectChange(
                            selectedOption,
                            'requestType',
                          )
                        }
                        placeholder="Select Request Type"
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2 md:w-1/3">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="rquestType"
                    >
                      Fuel Type
                    </label>

                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                        type="text"
                        name="fuelType"
                        id="fuelType"
                        placeholder="Enter quantity of fuel."
                        // onChange={handleChangeValue}
                        value={formValues?.fuelType}
                        disabled
                      />
                    </div>
                  </div>

                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="quantityOfFuel"
                    >
                      Fuel Qunatity
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="number"
                        name="quantityOfFuel"
                        id="quantityOfFuel"
                        placeholder="Enter quantity of fuel."
                        onChange={handleChangeValue}
                        value={formValues?.quantityOfFuel}
                      />
                    </div>
                  </div>

                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="rateOfFuel"
                    >
                      Fuel Rate
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="number"
                        name="rateOfFuel"
                        id="rateOfFuel"
                        placeholder="Enter rate of fuel."
                        onChange={handleChangeValue}
                        value={formValues?.rateOfFuel}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="amount"
                    >
                      Total Amount
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                        type="text"
                        name="amount"
                        id="amount"
                        disabled
                        placeholder="Enter total Amount."
                        onChange={handleChangeValue}
                        value={
                          formValues?.rateOfFuel * formValues?.quantityOfFuel
                        }
                      />
                    </div>
                  </div>

                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="fuelAverage"
                    >
                      Fuel Average (Km/l)
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                        type="text"
                        name="fuelAverage"
                        id="fuelAverage"
                        placeholder="Fuel Average"
                        onChange={handleChangeValue}
                        value={formValues?.fuelAverage}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* Previous Fueling Record Section */}
                <div className="mt-8">
                  <h3 className="font-medium text-md text-black dark:text-white mb-4">
                    Previous Fueling Record
                  </h3>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="previousFuelQuantity"
                      >
                        Previous Fuel Quantity (L)
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                          type="text"
                          name="previousFuelQuantity"
                          id="previousFuelQuantity"
                          placeholder="Previous Fuel Quantity"
                          onChange={handleChangeValue}
                          value={formValues?.previousFuelQuantity}
                          disabled
                        />
                      </div>
                    </div>

                    {/* <div className="w-full sm:w-1/2 md:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="previousOddometerReading"
                      >
                        Previous Odometer Reading
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                          type="text"
                          name="previousOddometerReading"
                          id="previousOddometerReading"
                          placeholder="Previous Odometer Reading"
                          onChange={handleChangeValue}
                          value={formValues?.previousOddometerReading}
                          disabled
                        />
                      </div>
                    </div> */}
                    <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="previousOddometerReading"
                      >
                        Previous Odometer Reading
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                          type="text"
                          name="previousOddometerReading"
                          id="previousOddometerReading"
                          placeholder="50,000 km"
                          onChange={handleChangeValue}
                          value={formValues?.previousOddometerReading}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2 md:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="odometerDifference"
                      >
                        Odometer Difference
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                          type="text"
                          name="odometerDifference"
                          id="odometerDifference"
                          placeholder="Odometer Difference"
                          value={
                            formValues?.currentOddometerReading -
                            formValues?.previousOddometerReading
                          }
                          disabled
                        />
                      </div>
                    </div>

                    <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="previousOddometerReading"
                      >
                        Last Fueling Date
                      </label>
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                          type="text"
                          name="previousOddometerReading"
                          id="previousOddometerReading"
                          placeholder="Date & Time"
                          onChange={handleChangeValue}
                          value={formatDateAndTime(formValues?.lastCreatedAt)}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit and Cancel buttons */}
                <div className="mr-5">
                  <div className="flex justify-end gap-4.5">
                    <button
                      className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black dark:border-strokedark dark:text-white transition duration-150 ease-in-out hover:border-gray dark:hover:border-white "
                      type="button"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                      type="submit"
                      disabled={isLoading}
                      onClick={handleSubmit}
                    >
                      {isLoading ? 'Adding...' : 'Add'}
                    </button>
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

export default FuelRequestForm;
