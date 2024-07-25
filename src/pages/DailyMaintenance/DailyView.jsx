import React, { useEffect, useState } from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useLocation } from 'react-router-dom';
import { useGetChecklistDataQuery } from '../../services/dailySlice';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const countNotOkItems = (booleanFields, checklist) => {
  return booleanFields.reduce((acc, fieldName) => {
    return acc + (checklist[fieldName] === false ? 1 : 0);
  }, 0);
};
const DailyView = () => {
  const location = useLocation();
  const { registrationNo } = location.state || {};
  const { data, isLoading, error } = useGetChecklistDataQuery({
    registrationNo,
  });

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

  const [checklist, setChecklist] = useState({});
  const [vehicleHealth, setVehicleHealth] = useState(0);

  useEffect(() => {
    if (data) {
      const filteredData = {};
      booleanFields.forEach((field) => {
        filteredData[field] = data.data[field];
      });

      setChecklist(filteredData);
      const totalFields = booleanFields.length;
      const okFields = booleanFields.filter(
        (key) => data.data[key] === true,
      ).length;
      const healthPercentage = (okFields / totalFields) * 100;
      setVehicleHealth(healthPercentage.toFixed(2));
    }
  }, [data]);

  if (isLoading) return <p>Loading checklist data...</p>;
  if (error) return <p>Error loading checklist data.</p>;

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const okItems = booleanFields.filter((fieldName) => checklist[fieldName]);
  const notOkItems = booleanFields.filter((fieldName) => !checklist[fieldName]);

  const getProgressBarColor = (percentage) => {
    const red = Math.min(255, (100 - percentage) * 2.55);
    const green = Math.min(255, percentage * 2.55);
    return `rgb(${red}, ${green}, 0)`;
  };

  const totalNotOkItems = countNotOkItems(booleanFields, checklist);
  console.log('totalNotOkItems', totalNotOkItems);

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Daily Maintenance View" />
      <div className="mx-auto max-w-4xl">
        <div className="gap-8">
          <div className="col-span-5 xl:col-span-3">
            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
              <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row pl-5 pt-5">
                <div className="w-full">
                  <label className="mb-3 block text-xl font-bold text-black dark:text-white">
                    Vehicle: {registrationNo}
                  </label>
                  <div className="relative w-full bg-gray-200 rounded-full h-6 mb-4">
                    <div
                      className="absolute top-0 left-0 h-6 rounded-full text-center text-white flex items-center justify-center"
                      style={{
                        width: `${vehicleHealth}%`,
                        backgroundColor: getProgressBarColor(vehicleHealth),
                      }}
                    >
                      <span className="absolute right-0 pr-2">
                        {vehicleHealth}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="mb-5 p-5 bg-green-100 rounded-md">
                  <h2 className="text-lg font-semibold mb-4">OK Items</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {okItems.map((fieldName) => (
                      <div key={fieldName} className="flex items-center">
                        <FaCheckCircle className="text-green-500 mr-2" />
                        <label>{capitalizeFirstLetter(fieldName)}</label>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-5 bg-red-100 rounded-md">
                  <h2 className="text-lg font-semibold mb-4">Not OK Items</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {notOkItems.map((fieldName) => (
                      <div key={fieldName} className="flex flex-col">
                        <div className="flex items-center">
                          <FaTimesCircle className="text-red-500 mr-2" />
                          <label>{capitalizeFirstLetter(fieldName)}</label>
                        </div>
                        <p className="text-red-500">
                          Reason: {data.data[`${fieldName}Reason`]}
                        </p>
                      </div>
                    ))}
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

export default DailyView;
