import { useState } from 'react';
import UploadWidget from '../../components/UploadWidget';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { FiUser } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { addVehicleSchema } from '../../utils/schemas';
import { useGetRolesByCompanyIdQuery } from '../../services/rolesSlice';
import useToast from '../../hooks/useToast';
import LoadingButton from '../../components/LoadingButton';
import Select from 'react-select';
import { useAddCompanyVehicleMutation } from '../../services/vehicleSlice';
import {
  stationOptions,
  door,
  fuel,
  make,
  type,
  model,
  size,
  subregion,
  region,
} from '../../constants/Data';
import { customStyles } from '../../constants/Styles';

const VehicleForm = () => {
  const navigate = useNavigate();

  const { showErrorToast, showSuccessToast } = useToast();
  const [formValues, setFormValues] = useState({ ...addVehicleSchema });
  const [selectedRole, setSelectedRole] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const { data: roles } = useGetRolesByCompanyIdQuery(user?.companyId);
  const [vehicleRegImgUrl, setVehicleRegImgUrl] = useState('');
  const [AddCompanyVehicle, { isLoading }] = useAddCompanyVehicleMutation();

  const handleSelectChange = (selectedOption, name) => {
    setFormValues({
      ...formValues,
      [name]: selectedOption.label,
    });
  };

  const handleChangeValue = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value.toString(),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formValues.commisionDate &&
      formValues.oddometerReading &&
      formValues.fuelType &&
      formValues.station &&
      formValues.registrationNo &&
      vehicleRegImgUrl
    ) {
      const formData = {
        ...formValues,
        registrationCertificate: vehicleRegImgUrl,
        companyId: parseInt(user?.companyId),
      };
      try {
        await AddCompanyVehicle(formData).unwrap();
        showSuccessToast('Vehicle Added Successfully!');
        navigate(-1);
      } catch (err) {
        console.log(err);
        let errorMessage = 'An error has occurred while adding vehicle';
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
    } else {
      showErrorToast('Please fill the required fields');
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-600">
        <Breadcrumb pageName="Add Vehicle" />

        <div className=" gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-md text-black dark:text-white">
                  Vehicle Information
                </h3>
              </div>
              <div className="p-7">
                {/*********************** INPUT FIELDS *************************************/}
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="reg_no"
                    >
                      Registration No.
                      <sup style={{ color: 'red', fontSize: '15px' }}>*</sup>
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="registrationNo"
                        id="reg_no"
                        placeholder="534232"
                        onChange={handleChangeValue}
                        value={formValues.registrationNo}
                      />
                    </div>
                  </div>
                  <div className=" sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="current_odo"
                    >
                      Current Odometer Reading{' '}
                      <sup style={{ color: 'red' }}>*</sup>
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="text"
                        name="oddometerReading"
                        id="current_odo"
                        placeholder="50,000 km"
                        onChange={handleChangeValue}
                        value={formValues.oddometerReading}
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2 md:w-1/3 lg:1/4">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="commission_date"
                    >
                      Commission Date
                      <sup style={{ color: 'red', fontSize: '15px' }}>*</sup>
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="date"
                        name="commisionDate"
                        id="commission_date"
                        placeholder="20/12/2024"
                        onChange={handleChangeValue}
                        value={formValues.commisionDate}
                      />
                    </div>
                  </div>
                </div>
                {/*********************** DROP DOWNS *************************************/}
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2 md:w-1/3">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="subregion"
                    >
                      Region
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <FiUser />
                      </span>

                      <Select
                        styles={customStyles}
                        className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        options={region}
                        value={
                          formValues.region
                            ? {
                                value: formValues.region,
                                label: formValues.region,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleSelectChange(selectedOption, 'region')
                        }
                        placeholder="Select Region"
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2 md:w-1/3">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="subregion"
                    >
                      Subregion
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <FiUser />
                      </span>
                      <Select
                        styles={customStyles}
                        className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        options={subregion}
                        value={
                          formValues.subRegion
                            ? {
                                value: formValues.subRegion,
                                label: formValues.subRegion,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleSelectChange(selectedOption, 'subRegion')
                        }
                        placeholder="Select Subregion"
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2 md:w-1/3">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="station"
                    >
                      Station
                      <sup style={{ color: 'red', fontSize: '15px' }}>*</sup>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <FiUser />
                      </span>
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
                          handleSelectChange(selectedOption, 'station')
                        }
                        placeholder="Select Station"
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
                      <span className="absolute left-4.5 top-4">
                        <FiUser />
                      </span>
                      <Select
                        styles={customStyles}
                        className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        options={make}
                        value={
                          formValues.make
                            ? { value: formValues.make, label: formValues.make }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleSelectChange(selectedOption, 'make')
                        }
                        placeholder="Select Make"
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2 md:w-1/3">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="model"
                    >
                      Model
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <FiUser />
                      </span>
                      <Select
                        styles={customStyles}
                        className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        options={model}
                        value={
                          formValues.model
                            ? {
                                value: formValues.model,
                                label: formValues.model,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleSelectChange(selectedOption, 'model')
                        }
                        placeholder="Select Model"
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2 md:w-1/3">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="type"
                    >
                      Type
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <FiUser />
                      </span>
                      <Select
                        styles={customStyles}
                        className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        options={type}
                        value={
                          formValues.type
                            ? { value: formValues.type, label: formValues.type }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleSelectChange(selectedOption, 'type')
                        }
                        placeholder="Select Type"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2 md:w-1/3">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="size"
                    >
                      Size
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <FiUser />
                      </span>
                      <Select
                        styles={customStyles}
                        className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        options={size}
                        value={
                          formValues.size
                            ? { value: formValues.size, label: formValues.size }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleSelectChange(selectedOption, 'size')
                        }
                        placeholder="Select Size"
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2 md:w-1/3">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="fuel"
                    >
                      Fuel Type<sup style={{ color: 'red' }}>*</sup>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <FiUser />
                      </span>

                      <Select
                        styles={customStyles}
                        className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        options={fuel}
                        value={
                          formValues.fuelType
                            ? {
                                value: formValues.fuelType,
                                label: formValues.fuelType,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleSelectChange(selectedOption, 'fuelType')
                        }
                        placeholder="Select Fuel"
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2 md:w-1/3">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="doorType"
                    >
                      Door Type
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <FiUser />
                      </span>

                      <Select
                        styles={customStyles}
                        className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        options={door}
                        value={
                          formValues.doorType
                            ? {
                                value: formValues.doorType,
                                label: formValues.doorType,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleSelectChange(selectedOption, 'doorType')
                        }
                        placeholder="Select Door"
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2 md:w-1/3">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="registrationCertificate"
                    >
                      Registration Certificate
                      <sup style={{ color: 'red' }}>*</sup>
                    </label>
                    <div className="relative">
                      <UploadWidget
                        setImgUrl={setVehicleRegImgUrl}
                        id="VehicleRegImgUrlUploadWidget" // Unique identifier for this instance
                      />
                      {vehicleRegImgUrl && (
                        <div className=" flex justify-center items-center border border-blue-200 p-4 bg-slate-200">
                          <img
                            src={vehicleRegImgUrl}
                            alt="lasda"
                            className="object-contain h-48 w-48"
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
                          onClick={handleSubmit}
                        >
                          Add
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

export default VehicleForm;
