import React, { useState } from 'react';
import { FiUser } from 'react-icons/fi';
// import Modal from 'react-modal';
import DefaultLayout from '../../layout/DefaultLayout';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useGetDriverQuery } from '../../services/driverSlice';
import { useParams } from 'react-router-dom';
import BreadcrumbNav from '../../components/Breadcrumbs/BreadcrumbNav';

const DriverView = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useGetDriverQuery(id);
  const [isActive, setIsActive] = useState(true); // Default value for is_active
  const [showDeletedAt, setShowDeletedAt] = useState(false); // Default value for showDeletedAt
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [modalImageUrl, setModalImageUrl] = useState(null); // State to hold modal image URL

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleChangeIsActive = () => {
    setIsActive(!isActive);
  };

  const toggleDeletedAt = () => {
    setShowDeletedAt(!showDeletedAt);
  };
  const openModal = (imageUrl) => {
    setModalImageUrl(imageUrl);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const YourComponent = () => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const closeModal = () => {
      setModalIsOpen(false);
    };
  };

  return (
    <DefaultLayout>
      <div className="mx-auto max-w-600">
        <BreadcrumbNav
          pageName="View Driver"
          pageNameprev="Drivers" //show the name on top heading
          pagePrevPath="drivers" // add the previous path to the navigation
        />
        <div className="flex flex-col bg-gray-100 rounded-lg overflow-hidden shadow-lg">
          <div className="flex justify-between items-end p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold">Driver Details</h2>
          </div>
          <div className="flex justify-between">
            <div className="ml-3 w-[70%]  justify-start p-5 bg-brand-primary ">
              <div className="flex flex-col">
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <p className="text-md font-semibold">Driver ID:</p>
                    <p className="text-md mb-5 font-normal">{data?.data?.id}</p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Driver Name:</p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Employee Id:</p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.employeeId}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Joining Date:</p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.joiningDate?.slice(0, 10)}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">CNIC:</p>
                    <p className="text-md mb-5 font-normal">
                      {data?.cnic}
                      <button
                        className="mb-5 w-13  cursor-pointer bg-slate-300 text-white  rounded-md hover:bg-slate-400 focus:outline-none "
                        onClick={() =>
                          document.getElementById('cnic_modal').showModal()
                        }
                      >
                        View
                      </button>
                      <dialog id="cnic_modal" className="modal justify-center">
                        <div className="modal-box  max-h-[900px] max-w-[700px]">
                          <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                              ✕
                            </button>
                          </form>

                          <div className="overflow-x-auto scroll-auto ">
                            {/* Image */}
                            <img
                              src="https://miro.medium.com/v2/resize:fit:720/1*QSMAedyhfA0-MC3IIpwG7w.jpeg"
                              alt="Driving License"
                              className="max-w-full"
                            />
                          </div>
                        </div>
                      </dialog>
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">Medical Category:</p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.med_category ?? 'None'}
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">License:</p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.license}
                      <button
                        className="mb-5 w-13  cursor-pointer bg-slate-300 text-white  rounded-md hover:bg-slate-400 focus:outline-none "
                        onClick={() =>
                          document.getElementById('license_modal').showModal()
                        }
                      >
                        View
                      </button>
                      <dialog
                        id="license_modal"
                        className="modal justify-center"
                      >
                        <div className="modal-box  max-h-[900px] max-w-[700px]">
                          <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                              ✕
                            </button>
                          </form>

                          <div className="overflow-x-auto scroll-auto ">
                            {/* Image */}
                            <img
                              src="https://i.pinimg.com/564x/57/86/62/57866207c81cea5a46b309ed2263903c.jpg"
                              alt="Driving License"
                              className="max-w-full"
                            />
                          </div>
                        </div>
                      </dialog>
                    </p>
                  </div>

                  <div>
                    <p className="text-md font-semibold">Station: </p>
                    <p className="text-md mb-5 font-normal">
                      {data?.data?.station}
                    </p>
                  </div>

                  <div>
                    <p className="text-md font-semibold">Accident History:</p>
                    <p className="text-md mb-5 font-normal">
                      <button
                        className="mb-5 w-13  cursor-pointer bg-slate-300 text-white  rounded-md hover:bg-slate-400 focus:outline-none "
                        // style={{ width: '20%', height: '20%' }}
                        onClick={() =>
                          document
                            .getElementById('accident_history_modal')
                            .showModal()
                        }
                      >
                        View
                      </button>

                      <dialog id="accident_history_modal" className="modal">
                        <div className="modal-box  max-h-[900px] max-w-[700px]">
                          <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                              ✕
                            </button>
                          </form>
                          <h3 className="font-semibold text-md mb-1">
                            Accidental History
                          </h3>
                          <div className="overflow-x-auto scroll-auto max-h-70">
                            <table className="table">
                              {/* head */}
                              <thead>
                                <tr>
                                  <th></th>
                                  <th>Date</th>
                                  <th>Vehicle Number</th>
                                  <th>Location</th>
                                  <th>Expense</th>
                                </tr>
                              </thead>
                              <tbody>
                                {/* row 1 */}
                                <tr>
                                  <th>1</th>
                                  <td>06-July-2019</td>
                                  <td>ABC-123</td>
                                  <td>Karachi</td>
                                  <td>90,000</td>
                                </tr>
                                {/* row 2 */}
                                <tr>
                                  <th>2</th>
                                  <td>06-July-2019</td>
                                  <td>ABC-123</td>
                                  <td>Multan</td>
                                  <td>90,000</td>
                                </tr>
                                {/* row 3 */}
                                <tr>
                                  <th>3</th>
                                  <td>06-July-2019</td>
                                  <td>ABC-123</td>
                                  <td>Sukhar</td>
                                  <td>90,000</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </dialog>
                    </p>
                  </div>
                  <div>
                    <p className="text-md font-semibold">
                      Medical Certificate:{' '}
                    </p>
                    <p className="text-md mb-5 font-normal">
                      <button
                        className="mb-5 w-13  cursor-pointer bg-slate-300 text-white  rounded-md hover:bg-slate-400 focus:outline-none "
                        // style={{ width: '20%', height: '20%' }}
                        onClick={() =>
                          document
                            .getElementById('medical_certificate_modal')
                            .showModal()
                        }
                      >
                        View
                      </button>
                      <dialog
                        id="medical_certificate_modal"
                        className="modal justify-center"
                      >
                        <div className="modal-box  max-h-[900px] max-w-[700px]">
                          <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                              ✕
                            </button>
                          </form>

                          <div className="overflow-x-auto scroll-auto ">
                            {/* Image */}
                            <img
                              src="https://s2.studylib.net/store/data/027001422_1-5d2772d8ce98ed2f6bc13c9dc4de5f6d-768x994.png"
                              alt="Accident History"
                              className="max-w-full"
                            />
                          </div>
                        </div>
                      </dialog>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[30%] justify-end hidden md:block">
              <div className="mt-7 ml-10 mr-15 w-80 h-45  border rounded-lg border-gray-300 justify-end ">
                <img
                  src={data?.data?.cnic}
                  alt="CNIC"
                  className="mb-5"
                  style={{ maxWidth: '100%', maxHeight: '80vh' }}
                />
              </div>
              <div className="ml-10 mr-15 mt-5 w-80 h-45  border rounded-lg border-gray-300 justify-end">
                <img
                  src={data?.data?.license}
                  alt="Driving License"
                  className="mb-5"
                  style={{ maxWidth: '100%', maxHeight: '80vh' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default DriverView;
