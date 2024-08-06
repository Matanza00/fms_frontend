import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '../../layout/DefaultLayout';
import { FiUser } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import useToast from '../../hooks/useToast';
import LoadingButton from '../../components/LoadingButton';
import { addDriverSchema } from '../../utils/schemas';
import Select from 'react-select';
import UploadWidget from '../../components/UploadWidget';
import {
  useAddDriverMutation,
  useGetDriverByCompanyIdQuery,
} from '../../services/driverSlice';
import { useGetCompanyEmployeesQuery } from '../../services/employeeSlice';
import Async from 'react-select/async';
import AsyncSelect from 'react-select/async';
import { stationOptions, licenseOptions } from '../../constants/Data';
import { customStyles } from '../../constants/Styles';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';

const DriversAddForm = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { showErrorToast, showSuccessToast } = useToast();
  const [selectedRole, setSelectedRole] = useState(null);
  const [formValues, setFormValues] = useState({ ...addDriverSchema });
  const { data: employees, isLoading: employeeLoading } =
    useGetCompanyEmployeesQuery(user?.companyId);
  const { data: drivers } = useGetDriverByCompanyIdQuery({
    companyId: user?.companyId,
    station: formValues?.station,
  });

  const [AddDriver, { isLoading, isError, error }] = useAddDriverMutation();

  const [driverCnicUrl, setDriverCnicUrl] = useState('');
  const [driverLicenceUrl, setDriverLicenceUrl] = useState('');
  const [driverMedicalCertificateUrl, setDriverMedicalCertificateUrl] =
    useState('');

  useEffect(() => {
    setFormValues({
      ...formValues,
      cnic: driverCnicUrl,
      license: driverLicenceUrl,
      medicalCertificate: driverMedicalCertificateUrl,
    });
  }, [driverCnicUrl, driverLicenceUrl, driverMedicalCertificateUrl]);

  useEffect(() => {
    setFormValues({ ...formValues, companyId: user?.companyId });
  }, [user]);

  const loadOptions = (inputValue, callback) => {
    if (!inputValue) {
      callback([]);
      return;
    }

    if (employees && employees.data) {
      const filteredOptions = employees.data
        .filter((employee) =>
          employee.name.toLowerCase().includes(inputValue.toLowerCase()),
        )
        .map((employee) => ({
          value: employee.id,
          label: `${employee.erpNumber}-${employee.name}`,
        }));
      callback(filteredOptions);
    }
  };

  const handleChange = (selectedOption, name) => {
    setFormValues({
      ...formValues,
      [name]: selectedOption.value, // Update with the selected value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      ...formValues,
    };
    try {
      await AddDriver(formData).unwrap();
      showSuccessToast('Driver Added Successfully!');
      navigate(-1);
    } catch (err) {
      console.log(err);
      let errorMessage = 'An error has occurred while adding driver';
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
  };

  const handleSelectChange = (selectedOption) => {
    console.log(selectedOption.label);
    if (selectedOption) {
      console.log('Selected option label:', selectedOption.label);
      setFormValues({
        ...formValues,
        name: selectedOption.label,
        employeeId: selectedOption.label?.split('-')[0],
      });
    } else {
      console.log('No option selected');
    }
  };

  console.log('object', formValues);

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-600">
        <BreadcrumbNav
          pageName="Add Driver"
          pageNameprev="Drivers" //show the name on top heading
          pagePrevPath="drivers" // add the previous path to the navigation
        />

        <div className=" gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="font-medium text-md text-black dark:text-white">
                  Driver Information
                </h3>
              </div>
              <div className="p-7">
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row ">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="employeeId"
                    >
                      Station
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
                          handleChange(selectedOption, 'station')
                        }
                        placeholder="Select Station"
                      />
                    </div>
                  </div>

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
                        loadOptions={loadOptions}
                        value={formValues.name}
                        onChange={handleSelectChange}
                        isLoading={employeeLoading}
                        isDisabled={employeeLoading}
                        placeholder={
                          formValues.name
                            ? formValues.name
                            : 'Select a Driver...'
                        }
                        isClearable
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="phoneNumber"
                    >
                      License
                    </label>
                    <div className="relative">
                      <span className="absolute left-4.5 top-4">
                        <FiUser />
                      </span>

                      <Select
                        styles={customStyles}
                        className="w-full rounded border border-stroke bg-gray h-[50px] text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        options={licenseOptions}
                        value={
                          formValues.licenseType
                            ? {
                                value: formValues.licenseType,
                                label: formValues.licenseType,
                              }
                            : null
                        }
                        onChange={(selectedOption) =>
                          handleChange(selectedOption, 'licenseType')
                        }
                        placeholder="Select License Type"
                      />
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2 md:w-1/2 lg:1/2">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="joining_date_id"
                    >
                      Joining Date
                    </label>
                    <div className="relative">
                      <input
                        className="w-full rounded border border-stroke bg-gray py-3 px-4.5 text-black focus:border-primary focus-visible:outline-none dark:border-strokedark dark:bg-meta-4 dark:text-white dark:focus:border-primary"
                        type="date"
                        name="joining_date"
                        id="joining_date_id"
                        placeholder="20/12/2024"
                        onChange={(e) =>
                          setFormValues({
                            ...formValues,
                            joiningDate: e.target.value,
                          })
                        }
                        value={formValues.joiningDate}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
                  <div className="w-full sm:w-1/2 md:w-1/3">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="cnic"
                    >
                      CNIC
                    </label>
                    <div className="relative">
                      <UploadWidget
                        setImgUrl={setDriverCnicUrl}
                        id="driverCnicUploadWidget" // Unique identifier for this instance
                      />
                      {driverCnicUrl && (
                        <div className=" flex justify-center items-center border border-blue-200 p-4 bg-slate-200">
                          <img
                            src={driverCnicUrl}
                            alt="driverLicenceImage"
                            className="object-contain h-48 w-48"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2 md:w-1/3">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="licence"
                    >
                      Licence
                    </label>
                    <div className="relative">
                      <UploadWidget
                        setImgUrl={setDriverLicenceUrl}
                        id="driverLicenceUploadWidget" // Unique identifier for this instance
                      />
                      {driverLicenceUrl && (
                        <div className=" flex justify-center items-center border border-blue-200 p-4 bg-slate-200">
                          <img
                            src={driverLicenceUrl}
                            alt="driver licence"
                            className="object-contain h-48 w-48"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-full sm:w-1/2 md:w-1/3">
                    <label
                      className="mb-3 block text-md font-medium text-black dark:text-white"
                      htmlFor="medical_certificate"
                    >
                      Medical Certificate
                    </label>
                    <div className="relative">
                      <UploadWidget
                        setImgUrl={setDriverMedicalCertificateUrl}
                        id="driverMedicalCertificateUploadWidget" // Unique identifier for this instance
                      />
                      {driverMedicalCertificateUrl && (
                        <div className=" flex justify-center items-center border border-blue-200 p-4 bg-slate-200">
                          <img
                            src={driverMedicalCertificateUrl}
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
                          onClick={handleSubmit}
                          className="flex justify-center rounded bg-primary min-w-24 py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                          type="submit"
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

export default DriversAddForm;
