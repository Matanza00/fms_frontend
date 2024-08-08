import { useEffect, useState } from 'react';
import UploadWidget from '../../components/UploadWidget';
import { useNavigate, useParams } from 'react-router-dom';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';
import DefaultLayout from '../../layout/DefaultLayout';
import { useSelector } from 'react-redux';
import { addFuelRequestSchema } from '../../utils/schemas';
import useToast from '../../hooks/useToast';
import LoadingButton from '../../components/LoadingButton';
import Select from 'react-select';
import { useGetVehicleByCompanyIdQuery } from '../../services/vehicleSlice';
import { useGetTagDriversFromVehicleQuery } from '../../services/tagDriverSlice';
import { useGetOneVehicleDetailsQuery } from '../../services/periodicSlice';
import {
  useGetFuelCardNoQuery,
  useGetFuelRequestQuery,
  useUpdateFuelRequestMutation,
} from '../../services/fuelSlice';
import {
  stationOptions,
  modeOfFueling,
  requestType,
} from '../../constants/Data';
import { customStyles } from '../../constants/Styles';
import { formatDateAndTime } from '../../utils/helpers';

const UpdateFuelRequestForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: fuelData } = useGetFuelRequestQuery(id);
  const { showErrorToast, showSuccessToast } = useToast();
  const [isOdometerMalfunctioned, setIsOdometerMalfunctioned] = useState(false);
  const [formValues, setFormValues] = useState({ ...addFuelRequestSchema });
  const [showPreviousRecordError, setShowPreviousRecordError] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [fuelReceipImgUrl, setfuelReceipImgUrl] = useState('');
  const [odometerImgUrl, setOdometerImgUrl] = useState('');
  const [isCompleteButtonVisible, setIsCompleteButtonVisible] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const [UpdateFuelRequest, { isLoading }] = useUpdateFuelRequestMutation();
  const { data: vehicles, isLoading: vehicleLoading } =
    useGetVehicleByCompanyIdQuery({
      companyId: user?.companyId,
      station: formValues?.station,
    });
  const {
    data: tagDriverByVehicle,
    isError: isDriverTaggedError,
    error: tagDriverError,
  } = useGetTagDriversFromVehicleQuery(formValues?.registrationNo);
  const {
    data: vehicleDetails,
    isError: isVehicleDetailsError,
    error: vehicleDetailsError,
  } = useGetOneVehicleDetailsQuery(formValues?.registrationNo);
  const { data: cardNo } = useGetFuelCardNoQuery({
    vehicleId: formValues.registrationNo,
    cardType: formValues.modeOfFueling,
  });

  useEffect(() => {
    if (fuelReceipImgUrl && odometerImgUrl) {
      setIsCompleteButtonVisible(true);
    } else {
      setIsCompleteButtonVisible(false);
    }
  }, [fuelReceipImgUrl, odometerImgUrl]);

  const handleNormalSelectChange = (selectedOption, name) => {
    setFormValues({
      ...formValues,
      [name]: selectedOption.label,
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
      fuelReceipt: fuelReceipImgUrl || formValues.fuelReceipt,
      odometerImg: odometerImgUrl || formValues.odometerImg,
      companyId: parseInt(user?.companyId),
    };
    try {
      formData.currentFuelingDate = new Date(
        formData.currentFuelingDate,
      ).toISOString();
      await UpdateFuelRequest({ id, formData }).unwrap();
      showSuccessToast('Fuel Request Updated Successfully!');
      navigate(-1);
    } catch (err) {
      console.log(err);
      showErrorToast('An error has occurred while updating fuel request');
    }
  };

  const handleComplete = async () => {
    try {
      await UpdateFuelRequest({
        id,
        formData: {
          status: 'completed',
          fuelReceipt: fuelReceipImgUrl || formValues.fuelReceipt,
          odometerImg: odometerImgUrl || formValues.odometerImg,
        },
      }).unwrap();
      showSuccessToast('Status updated to Completed!');
      navigate(-1);
    } catch (err) {
      console.log(err);
      showErrorToast('An error has occurred while updating status');
    }
  };

  useEffect(() => {
    let _amount = formValues.rateOfFuel * formValues.quantityOfFuel;
    setFormValues({ ...formValues, amount: _amount });
  }, [formValues.rateOfFuel, formValues.quantityOfFuel]);

  useEffect(() => {
    if (tagDriverByVehicle?.data) {
      setFormValues((prevValues) => ({
        ...prevValues,
        driverName: tagDriverByVehicle.data.driver?.name,
        gbmsNo: tagDriverByVehicle.data.driverId,
        fuelType: tagDriverByVehicle.data.vehicle?.fuelType,
        make: tagDriverByVehicle.data.vehicle?.make,
        previousOddometerReading:
          tagDriverByVehicle.data.lastFuelChangedOddoReading,
      }));
    }
  }, [tagDriverByVehicle]);

  useEffect(() => {
    if (fuelData && fuelData.data) {
      const fuelingDate = fuelData.data.currentFuelingDate
        ? new Date(fuelData.data.currentFuelingDate).toISOString().split('T')[0]
        : '';
      setFormValues((prevValues) => ({
        ...prevValues,
        ...fuelData.data,
        currentFuelingDate: fuelingDate,
      }));
      setfuelReceipImgUrl(fuelData.data.fuelReceipt);
      setOdometerImgUrl(fuelData.data.odometerImg);
      setInitialLoad(false);
    }
  }, [fuelData]);

  useEffect(() => {
    if (
      !!formValues.currentOddometerReading &&
      formValues.currentOddometerReading > formValues.previousOddometerReading
    ) {
      let _average =
        (formValues.currentOddometerReading -
          formValues.previousOddometerReading) /
        parseInt(formValues.previousFuelQuantity);
      setFormValues((prevValues) => ({
        ...prevValues,
        fuelAverage: _average,
      }));
    }
  }, [
    formValues.currentOddometerReading,
    formValues.previousOddometerReading,
    formValues.previousFuelQuantity,
  ]);

  useEffect(() => {
    if (
      formValues.modeOfFueling === 'PSO' ||
      formValues.modeOfFueling === 'APL'
    ) {
      setFormValues((prevValues) => ({
        ...prevValues,
        cardNo: cardNo?.data?.cardNumber,
      }));
    } else if (
      formValues.modeOfFueling === 'Cash' ||
      formValues.modeOfFueling === 'Credit'
    ) {
      setFormValues((prevValues) => ({
        ...prevValues,
        cardNo: '',
      }));
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

  useEffect(() => {
    const odometerDifference =
      formValues?.currentOddometerReading -
      formValues?.previousOddometerReading;

    if (odometerDifference < 0) {
      setShowPreviousRecordError(true);
    } else {
      setShowPreviousRecordError(false);
    }
  }, [
    formValues?.currentOddometerReading,
    formValues?.previousOddometerReading,
  ]);

  if (isDriverTaggedError) {
    if (!!formValues.registrationNo) {
      console.log(tagDriverError);
      showErrorToast(tagDriverError?.data?.message);
    }
  }

  console.log('old Data: ', formValues);

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-600">
        <BreadcrumbNav
          pageName="Update Fuel Request"
          pageNameprev="Fuel Management"
          pagePrevPath="fuel-management"
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
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                        type="text"
                        name="registrationNo"
                        id="registrationNo"
                        value={formValues.registrationNo}
                        readOnly
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
                        name="currentOddometerReadingAuto"
                        id="current_odo_auto"
                        placeholder="Odometer Reading"
                        onChange={handleChangeValue}
                        value={formValues?.currentOddometerReadingAuto}
                        disabled
                      />
                    </div>
                  </div>

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

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="current_odo"
                    >
                      Current Meter Reading (Manually)
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="currentOddometerReading"
                        id="current_odo"
                        placeholder="50,000 km"
                        onChange={handleChangeValue}
                        value={formValues.currentOddometerReading}
                        disabled={fuelData?.data?.status === 'approved'}
                      />
                    </div>
                  </div>

                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="previousOddometerReading"
                    >
                      Previous Meter Reading
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                        type="text"
                        name="previousOddometerReading"
                        id="previousOddometerReading"
                        placeholder="50,000 km"
                        onChange={handleChangeValue}
                        value={fuelData?.data?.previousOddometerReading}
                        disabled
                      />
                    </div>
                  </div>

                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="gbmsNo"
                    >
                      Employee No.
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

                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
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
                        value={formValues.driverName}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
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
                      htmlFor="fuelingDate"
                    >
                      Current Fueling Date
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="date"
                        name="currentFuelingDate"
                        id="currentFuelingDate"
                        onChange={handleChangeValue}
                        value={formValues.currentFuelingDate}
                        min={new Date().toISOString().split('T')[0]}
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
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                        type="text"
                        name="modeOfFueling"
                        id="modeOfFueling"
                        value={formValues?.modeOfFueling}
                        readOnly
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
                          formValues.requestType
                            ? {
                                value: formValues.requestType,
                                label: formValues.requestType,
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
                        isDisabled={fuelData?.data?.status === 'approved'}
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
                      <div className="relative">
                        <input
                          className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary uneditable"
                          type="text"
                          name="fuelType"
                          id="fuelType"
                          placeholder="Enter Fuel Type."
                          onChange={handleChangeValue}
                          disabled
                          value={formValues?.fuelType}
                        />
                      </div>
                    </div>
                  </div>

                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="quantityOfFuel"
                    >
                      Fuel Quantity
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="number"
                        name="quantityOfFuel"
                        id="quantityOfFuel"
                        placeholder="Enter quantity of fuel."
                        onChange={handleChangeValue}
                        value={formValues.quantityOfFuel}
                        disabled={
                          fuelData?.data?.status === 'approved' ||
                          fuelData?.data?.status === 'APPROVED'
                        }
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
                        value={formValues.rateOfFuel}
                        disabled={fuelData?.data?.status === 'approved'}
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
                          formValues.rateOfFuel * formValues.quantityOfFuel
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
                        value={fuelData?.data?.fuelAverage}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2 md:w-1/3">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="fuelReceipt"
                    >
                      Fuel Receipt
                    </label>
                    <div className="relative">
                      <UploadWidget
                        setImgUrl={setfuelReceipImgUrl}
                        id="fuelReceipImgUrlUploadWidget" // Unique identifier for this instance
                      />
                      {(fuelReceipImgUrl || formValues.fuelReceipt) && (
                        <div className=" flex justify-center items-center border border-blue-200 p-4 bg-slate-200">
                          <img
                            src={fuelReceipImgUrl || formValues.fuelReceipt}
                            alt="Fuel Receipt"
                            className="object-contain h-48 w-48"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2 md:w-1/3">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="odometerImgUrlUploadWidget"
                    >
                      Odometer Image After Fueling
                    </label>
                    <div className="relative">
                      <UploadWidget
                        setImgUrl={setOdometerImgUrl}
                        id="odometerImgUrlUploadWidget" // Unique identifier for this instance
                      />
                      {(odometerImgUrl || formValues.odometerImg) && (
                        <div className=" flex justify-center items-center border border-blue-200 p-4 bg-slate-200">
                          <img
                            src={odometerImgUrl || formValues.odometerImg}
                            alt="Odometer Image"
                            className="object-contain h-48 w-48"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {showPreviousRecordError ? (
                  <div className="mt-8 text-red-500">
                    Error: Odometer difference is less than 0. Please check the
                    odometer readings.
                  </div>
                ) : (
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
                            value={formValues?.previousFuelQuantity}
                            disabled
                          />
                        </div>
                      </div>

                      <div className="w-full sm:w-1/2 md:w-1/3">
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
                          btnText="Saving..."
                          isLoading={isLoading}
                        />
                      ) : (
                        <>
                          {!isCompleteButtonVisible && (
                            <button
                              className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                              type="submit"
                              disabled={isDriverTaggedError}
                              onClick={handleSubmit}
                            >
                              Update
                            </button>
                          )}
                          {isCompleteButtonVisible && (
                            <button
                              className="flex justify-center rounded bg-green-500 py-2 px-6 font-medium text-white hover:bg-opacity-90"
                              type="button"
                              onClick={handleComplete}
                            >
                              Complete
                            </button>
                          )}
                        </>
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

export default UpdateFuelRequestForm;