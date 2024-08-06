import React, { useState } from 'react';
import DefaultLayout from '../../../layout/DefaultLayout';
import Breadcrumb from '../../../components/Breadcrumbs/Breadcrumb';
import {
  addParameterSchema,
  parameterPrioritySchema,
} from '../../../utils/schemas';
import { useAddPeriodicParameterMutation } from '../../../services/periodicSlice';
import useToast from '../../../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import BreadcrumbNav from '../../../components/Breadcrumbs/BreadcrumbNav';

const ParametersForm = () => {
  const navigate = useNavigate();
  const { showErrorToast, showSuccessToast } = useToast();
  const [formData, setFormData] = useState({ ...addParameterSchema });
  const [AddPeriodicParameter, { isLoading }] =
    useAddPeriodicParameterMutation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePriorityChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPriorityLevels = [...formData.priorityLevels];
    updatedPriorityLevels[index][name] = value;
    setFormData({ ...formData, priorityLevels: updatedPriorityLevels });
  };

  const addPriorityLevel = () => {
    setFormData({
      ...formData,
      priorityLevels: [
        ...formData.priorityLevels,
        { label: '', minKm: '', maxKm: '', minMonths: '', maxMonths: '' },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(formData);
      await AddPeriodicParameter(formData).unwrap();
      showSuccessToast('Parameter Added Successfully !');
      navigate(-1);
    } catch (err) {
      console.log(err);
      showErrorToast('An error has occurred while sending fuel request');
    }
  };
  return (
    <DefaultLayout>
      <div className="mx-auto max-w-600">
        <BreadcrumbNav
          pageName="Add a parameter"
          pageNameprev="Parameters" //show the name on top heading
          pagePrevPath="periodic/parameters" // add the previous path to the navigation
        />
        <div className=" gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="border-b border-stroke py-4 px-7 dark:border-strokedark">
                <h3 className="text-md text-black dark:text-white font-medium">
                  Create a Maintainence Parameter
                </h3>
              </div>

              <div className="p-7">
                <form onSubmit={handleSubmit} className="max-w-lg ">
                  <div className="mb-4">
                    <label
                      htmlFor="job"
                      className="block text-sm font-bold mb-1"
                    >
                      Job:
                    </label>
                    <input
                      type="text"
                      id="job"
                      name="job"
                      value={formData.job}
                      onChange={handleChange}
                      className="border rounded-md p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="notes"
                      className="block text-sm font-bold mb-1"
                    >
                      Notes:
                    </label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      className="border rounded-md p-2 w-full h-24"
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="replaceAfterKms"
                      className="block text-sm font-bold mb-1"
                    >
                      Replace After Kms:
                    </label>
                    <input
                      type="text"
                      id="replaceAfterKms"
                      name="replaceAfterKms"
                      value={formData.replaceAfterKms}
                      onChange={handleChange}
                      className="border rounded-md p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="replaceAfterMonths"
                      className="block text-sm font-bold mb-1"
                    >
                      Replace After Months:
                    </label>
                    <input
                      type="text"
                      id="replaceAfterMonths"
                      name="replaceAfterMonths"
                      value={formData.replaceAfterMonths}
                      onChange={handleChange}
                      className="border rounded-md p-2 w-full"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="pointsDeduction"
                      className="block text-sm font-bold mb-1"
                    >
                      Points Deduction:
                    </label>
                    <input
                      type="text"
                      id="pointsDeduction"
                      name="pointsDeduction"
                      value={formData.pointsDeduction}
                      onChange={handleChange}
                      className="border rounded-md p-2 w-full"
                    />
                  </div>
                  <div className="mb-4">
                    <h4 className="text-lg font-bold mb-2">Priority Levels</h4>
                    {formData.priorityLevels.map((priority, index) => (
                      <div key={index} className="flex gap-4">
                        <div>
                          <span>Priority Label</span>
                          <select
                            name="label"
                            value={priority.label}
                            onChange={(e) => handlePriorityChange(index, e)}
                            className="border rounded-md p-2"
                          >
                            <option value="">Select Priority</option>
                            <option value="Priority">Priority</option>
                            <option value="Alarming">Alarming</option>
                            <option value="Risky">Risky</option>
                            <option value="High Risky">High Risky</option>
                            <option value="Dangerous">Dangerous</option>
                            <option value="Off Road">Off Road</option>
                          </select>
                        </div>
                        <div>
                          <span>Min Km</span>
                          <input
                            type="text"
                            name="minKm"
                            value={priority.minKm}
                            onChange={(e) => handlePriorityChange(index, e)}
                            placeholder="Min KM"
                            className="border rounded-md p-2"
                          />
                        </div>
                        <div>
                          <span>Max Km</span>

                          <input
                            type="text"
                            name="maxKm"
                            value={priority.maxKm}
                            onChange={(e) => handlePriorityChange(index, e)}
                            placeholder="Max KM"
                            className="border rounded-md p-2"
                          />
                        </div>
                        <div>
                          <span>Min Months</span>
                          <input
                            type="text"
                            name="minMonths"
                            value={priority.minMonths}
                            onChange={(e) => handlePriorityChange(index, e)}
                            placeholder="Min Months"
                            className="border rounded-md p-2"
                          />
                        </div>
                        <div>
                          <span>Max Months</span>

                          <input
                            type="text"
                            name="maxMonths"
                            value={priority.maxMonths}
                            onChange={(e) => handlePriorityChange(index, e)}
                            placeholder="Max Months"
                            className="border rounded-md p-2"
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addPriorityLevel}
                      className="bg-green-500 text-white px-4 py-2 rounded-md mt-2"
                    >
                      Add Priority Level
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Add Maintenance Parameters
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ParametersForm;
