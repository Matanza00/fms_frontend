import React, { useState, useEffect } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAddDailyRequestMutation } from '../../services/dailySlice';
import useToast from '../../hooks/useToast';
import { FiCheck, FiX } from 'react-icons/fi';
import {
  useUpdateVehicleMutation,
  useGetVehicleFromRegistrationNoQuery,
} from '../../services/vehicleSlice'; // Import the mutation hook
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';
import { addDailyRequestSchema } from './../../utils/schemas'; // Import schema

const DailyMaintainenceChecklist = () => {
  const location = useLocation();
  const { registrationNo, status } = location.state || {};
  const navigate = useNavigate();
  const { showErrorToast, showSuccessToast } = useToast();
  const [AddDailyRequest, { isLoading }] = useAddDailyRequestMutation();
  const regi = registrationNo;

  const {
    data: vehicleData,
    isLoading: vehicleLoading,
    refetch,
  } = useGetVehicleFromRegistrationNoQuery(registrationNo);

  // Use useUpdateVehicleMutation hook to get UpdateVehicle function
  const [UpdateVehicle, { isLoadingVehicleUpdate }] =
    useUpdateVehicleMutation();

  useEffect(() => {
    refetch();
    return () => {};
  }, [registrationNo]);

  const initialFormValues = Object.keys(addDailyRequestSchema).reduce(
    (acc, fieldName) => {
      acc[fieldName] = { value: '', reason: '' };
      return acc;
    },
    {},
  );

  const [formValues, setFormValues] = useState(initialFormValues);

  const handleRadioChange = (fieldName, value) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldName]: { ...prevValues[fieldName], value: value },
    }));
  };

  const handleReasonChange = (fieldName, reason) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      [fieldName]: { ...prevValues[fieldName], reason: reason },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Debug: Log form values before validation
    console.log('Form Values before validation:', formValues);

    // Validate that all fields are selected
    const unselectedFields = Object.keys(formValues).filter(
      (fieldName) => formValues[fieldName].value === '',
    );

    // Debug: Log unselected fields
    console.log('Unselected Fields:', unselectedFields);

    if (unselectedFields.length > 0) {
      showErrorToast('Please select Yes or No for all fields.');
      return;
    }

    // Update status based on current value
    let updatedStatus;

    if (status === 'CHECKED_IN') {
      updatedStatus = 'CHECKED_OUT';
    } else if (status === 'CHECKED_OUT') {
      updatedStatus = 'CHECKED_IN';
    } else {
      showErrorToast('Invalid status received from the server.');
      return;
    }
    try {
      // Update the vehicle status
      await UpdateVehicle({
        registrationNo: regi,
        id: parseInt(vehicleData.data.id),
        formData: { status: updatedStatus },
      }).unwrap();

      // Convert radio button values to boolean and include reasons
      const formData = Object.keys(formValues).reduce((acc, fieldName) => {
        acc[fieldName] = formValues[fieldName].value === 'yes';
        if (formValues[fieldName].value === 'no') {
          acc[`${fieldName}Reason`] = formValues[fieldName].reason;
        }
        return acc;
      }, {});

      formData.registrationNo = regi;

      // Calculate total faults
      const totalFaults = Object.keys(formValues).filter(
        (fieldName) => formValues[fieldName].value === 'no',
      ).length;

      formData.totalFaults = totalFaults;

      // Debug: Log form data before submission
      console.log('Form Data before submission:', formData);

      // Submit daily maintenance request
      await AddDailyRequest(formData).unwrap();

      showSuccessToast('Daily maintenance saved Successfully!');
      navigate(-1);
    } catch (error) {
      console.error('Error updating vehicle or saving maintenance:', error);

      let errorMessage =
        'An error occurred while updating vehicle or saving maintenance';
      if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      showErrorToast(errorMessage);
    }
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-4xl">
        <BreadcrumbNav
          pageName="Daily Maintenance Checklist"
          pageNameprev="Daily Maintenance" // Show the name on top heading
          pagePrevPath="daily-maintenance" // Add the previous path to the navigation
        />
        <div className="flex justify-between items-center mb-4">
          <div>
            <label className="text-xl font-bold text-black dark:text-white">
              Selected Vehicle: {registrationNo}
            </label>
          </div>
        </div>
        <div className="gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <form className="p-5" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-5">
                  {Object.keys(addDailyRequestSchema).map((fieldName) => (
                    <div key={fieldName} className="mb-5">
                      <h3 className="text-lg font-semibold mb-2">
                        {fieldName}
                      </h3>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <input
                            type="radio"
                            id={`${fieldName}-yes`}
                            name={fieldName}
                            value="yes"
                            checked={formValues[fieldName].value === 'yes'}
                            onChange={() => handleRadioChange(fieldName, 'yes')}
                            className="hidden"
                          />
                          <label
                            htmlFor={`${fieldName}-yes`}
                            className={`inline-flex items-center justify-center cursor-pointer px-4 py-2 border border-solid rounded-lg mr-4 ${formValues[fieldName].value === 'yes' ? 'bg-green-500 text-white border-green-500' : 'border-gray-300'}`}
                          >
                            Yes
                          </label>
                          <input
                            type="radio"
                            id={`${fieldName}-no`}
                            name={fieldName}
                            value="no"
                            checked={formValues[fieldName].value === 'no'}
                            onChange={() => handleRadioChange(fieldName, 'no')}
                            className="hidden"
                          />
                          <label
                            htmlFor={`${fieldName}-no`}
                            className={`inline-flex items-center justify-center cursor-pointer px-4 py-2 border border-solid rounded-lg ${formValues[fieldName].value === 'no' ? 'bg-red-500 text-white border-red-500' : 'border-gray-300'}`}
                          >
                            No
                          </label>
                        </div>
                        {formValues[fieldName].value === 'no' && (
                          <textarea
                            placeholder={`Reason for ${fieldName}`}
                            value={formValues[fieldName].reason}
                            onChange={(e) =>
                              handleReasonChange(fieldName, e.target.value)
                            }
                            className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-4.5">
                  <button
                    className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black dark:border-strokedark dark:text-white transition duration-150 ease-in-out hover:border-gray dark:hover:border-white"
                    type="button"
                    onClick={() => navigate(-1)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex justify-center rounded bg-primary py-2 px-6 font-medium text-gray hover:bg-opacity-90"
                    type="submit"
                    disabled={isLoading || isLoadingVehicleUpdate} // Disable button during loading
                  >
                    {isLoading || isLoadingVehicleUpdate ? 'Adding...' : 'Add'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default DailyMaintainenceChecklist;
