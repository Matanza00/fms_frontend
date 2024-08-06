import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { FiUser } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { tagDriverSchema } from '../../utils/schemas';
import { useGetRolesByCompanyIdQuery } from '../../services/rolesSlice';
import useToast from '../../hooks/useToast';
import LoadingButton from '../../components/LoadingButton';
import Select from 'react-select';
import AsyncSelect from 'react-select/async';
import { useGetDriverByCompanyIdQuery } from '../../services/driverSlice';
import { useGetVehicleByCompanyIdQuery } from '../../services/vehicleSlice';
import {
  useGetTagDriverQuery,
  useUpdateTaggedDriverMutation,
} from '../../services/tagDriverSlice';
import { customStyles } from '../../constants/Styles';
import { stationOptions } from '../../constants/Data';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';

const VehicleTagUpdateForm = () => {
  const { id } = useParams();
  const { data: TaggedDriver } = useGetTagDriverQuery(id);
  const navigate = useNavigate();
  const { showErrorToast, showSuccessToast } = useToast();
  const [formValues, setFormValues] = useState({ ...tagDriverSchema });
  const [selectedRole, setSelectedRole] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const { data: roles } = useGetRolesByCompanyIdQuery(user?.companyId);
  const [UpdateTaggedDriver, { isLoading }] = useUpdateTaggedDriverMutation();

  const { data: drivers, isLoading: driverLoading } =
    useGetDriverByCompanyIdQuery({
      companyId: user?.companyId,
      station: formValues?.station,
    });
  const { data: vehicles, isLoading: vehicleLoading } =
    useGetVehicleByCompanyIdQuery({
      companyId: user?.companyId,
      station: formValues?.station,
    });

  const driverLoadOptions = (inputValue, callback) => {
    if (!inputValue) {
      callback([]);
      return;
    }

    if (drivers && drivers.data) {
      const filteredOptions = drivers.data
        .filter((driver) =>
          driver.name.toLowerCase().includes(inputValue.toLowerCase()),
        )
        .map((driver) => ({
          value: driver.id,
          label: `${driver.employeeId}-${driver.name}`,
        }));
      callback(filteredOptions);
    }
  };

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
    }
  };

  const handleChange = (selectedOption, name) => {
    if (name === 'station') {
      // If the station value changes, reset the driverId and vehicleId
      setFormValues((prevState) => ({
        ...prevState,
        [name]: selectedOption.value,
        driverId: null,
        vehicleId: null,
      }));
    } else {
      setFormValues((prevState) => ({
        ...prevState,
        [name]: selectedOption.value,
      }));
    }
  };

  const handleSelectChange = (fieldName, selectedOption) => {
    setFormValues((prevState) => ({
      ...prevState,
      [fieldName]: selectedOption.label,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      ...formValues,
    };

    try {
      await UpdateTaggedDriver({ id, formData }).unwrap();
      showSuccessToast('Tagged Driver Updated Successfully!');
      navigate(-1);
    } catch (err) {
      console.log(err);
      showErrorToast('An error has occurred while updating tagged driver');
    }
  };

  useEffect(() => {
    setFormValues({
      ...formValues,
      station: TaggedDriver?.data?.station,
      driverId: `${TaggedDriver?.data?.driverId}-${TaggedDriver?.data?.driver?.name}`,
      vehicleId: TaggedDriver?.data?.vehicleId,
    });
  }, [TaggedDriver]);

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-600">
        {/* <Breadcrumb pageName="Tag Driver" /> */}
        <BreadcrumbNav
          pageName="Tag Driver"
          pageNameprev="Vehicle Assigned" //show the name on top heading
          pagePrevPath="vehicle-tagged" // add the previous path to the navigation
        />
        <div className=" gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-md text-black dark:text-white">
                  Update Tag Driver Form
                </h3>
              </div>
              <div className="p-7">
                <form action="#" onSubmit={handleSubmit}>
                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/3">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor="station"
                      >
                        Station
                      </label>
                      <div className="relative">
                        <span className="absolute left-4.5 top-4">
                          <FiUser />
                        </span>
                        <Select
                          isDisabled
                          styles={customStyles}
                          options={stationOptions}
                          className="mb-3 w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          name="station"
                          id="station"
                          onChange={(selectedOption) =>
                            handleChange(selectedOption, 'station')
                          }
                          value={
                            formValues.station
                              ? {
                                  value: formValues.station,
                                  label: formValues.station,
                                }
                              : null
                          }
                          placeholder="Select Station"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor=""
                      >
                        Select Driver
                      </label>
                      <div className="relative">
                        <AsyncSelect
                          styles={customStyles}
                          className="mb-3 w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          loadOptions={driverLoadOptions}
                          value={
                            formValues.driverId
                              ? {
                                  value: formValues.driverId,
                                  label: formValues.driverId,
                                }
                              : null
                          }
                          onChange={(selectedOption) =>
                            handleSelectChange('driverId', selectedOption)
                          }
                          isLoading={driverLoading}
                          isDisabled={driverLoading}
                          placeholder="Select a Driver..."
                          isClearable
                        />
                      </div>
                    </div>

                    <div className="w-full sm:w-1/2">
                      <label
                        className="mb-3 block text-md font-medium text-black dark:text-white"
                        htmlFor=""
                      >
                        Select Vehicle
                      </label>
                      <div className="relative">
                        <AsyncSelect
                          styles={customStyles}
                          className="mb-3 w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                          loadOptions={vehicleLoadOptions}
                          value={
                            formValues.vehicleId
                              ? {
                                  value: formValues.vehicleId,
                                  label: formValues.vehicleId,
                                }
                              : null
                          }
                          onChange={(selectedOption) =>
                            handleSelectChange('vehicleId', selectedOption)
                          }
                          isLoading={vehicleLoading}
                          isDisabled={vehicleLoading}
                          placeholder="Select a Vehicle..."
                          isClearable
                        />
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

export default VehicleTagUpdateForm;
