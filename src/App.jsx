import { useEffect, useState } from 'react';
import UploadWidget from './components/UploadWidget';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import Companies from './pages/Companies';
import CompanyView from './pages/Companies/CompanyView';
import CompanyForm from './pages/Companies/CompanyForm';
import Users from './pages/Users';
import UserAddForm from './pages/Users/UserAddForm';
import UserUpdateForm from './pages/Users/UserUpdateForm';
import UserView from './pages/Users/UserView';
// import UserForm from './pages/Users/UserUpdateForm';
// import UserUpdateForm from './pages/Users/UserUpdateForm';
// import UserForm from './pages/Users/UserAddForm';

import SetPassword from './pages/SetPassword/SetPassword';
import Roles from './pages/Roles';
import RoleUpdate from './pages/Roles/RoleUpdate';
import Locations from './pages/Locations';
import LocationView from './pages/Locations1/LocationView';
import LocationForm from './pages/Locations/LocationForm';
import Vehicles from './pages/Vehicles';
import VehicleUpdateForm from './pages/Vehicles/VehicleUpdateForm';
import VehicleAddForm from './pages/Vehicles/VehicleAddForm';

import VehicleView from './pages/Vehicles/VehicleView';
import VehicleAssigned from './pages/VehicleAssigned';
import TagVehicleForm from './pages/VehicleAssigned/VehicleTagForm';
import Drivers from './pages/Drivers';
import DriversAddForm from './pages/Drivers/DriversAddForm';
// import DriverAddForm from './pages/Deriver/VehicleForm';
import DriverView from './pages/Drivers/DriverView';
import VehicleTaggingView from './pages/VehicleAssigned/VehicleTaggingView';
import FuelManagement from './pages/FuelManagement';
import LocationSubregionTable from './pages/Locations1/LocationSubregionTable';
import FuelRequestForm from './pages/FuelManagement/FuelRequestForm';
import FuelView from './pages/FuelManagement/FuelView';
import DriverUpdateForm from './pages/Drivers/DriverUpdateForm';
import EmergencyMnt from './pages/EmergencyMaintenace';
import EmergencyMntForm from './pages/EmergencyMaintenace/EmergencyMntForm';
import EmergencyProcessForm from './pages/EmergencyMaintenace/EmergencyProcessForm';
import EmergencyMntView from './pages/EmergencyMaintenace/EmergencyMntView';
import PeriodicMaintenance from './pages/PeriodicMaintenance';
import PeriodicForm from './pages/PeriodicMaintenance/PeriodicForm';
import UpdatePeriodicForm from './pages/PeriodicMaintenance/UpdatePeriodicForm';
import CompletePeriodicForm from './pages/PeriodicMaintenance/CompletePeriodicForm';

import PeriodicView from './pages/PeriodicMaintenance/PeriodicView';
import DailyMaintenance from './pages/DailyMaintenance';

// import DailyMaintenanceForm from './pages/DailyMaintenance/DailyMaintenanceForm';
import UpdateFuelRequestForm from './pages/FuelManagement/UpdateFuelRequestForm';
import VehicleTagUpdateForm from './pages/VehicleAssigned/VehicleTagUpdateForm';
import FuelIssue from './pages/FuelManagement/FuelIssue';
import FuelDashboard from './pages/FuelManagement/FuelDashboard';
import DailyMaintenanceForm from './pages/DailyMaintenance/DailyMaintenanceForm';
import DailyMaintainenceChecklist from './pages/DailyMaintenance/DailyMaintainenceChecklist';
import DailyView from './pages/DailyMaintenance/DailyView';
// import CreateTeam from './pages/DailyMaintenance/CreateTeam';
import CreateTeam from './pages/MaintenanceTeams/CreateTeam';
// import TeamView from './pages/MaintenanceTeams/TeamView';
import MaintenanceTeamsTable from './pages/MaintenanceTeams/TeamTable';
import TeamView from './pages/MaintenanceTeams/TeamView';
import EditTeam from './pages/MaintenanceTeams/EditTeam';

import Parameters from './pages/PeriodicMaintenance/Parameters';
import ParametersForm from './pages/PeriodicMaintenance/Parameters/ParametersForm';
import Reports from './pages/PeriodicMaintenance/Reports';
import Dashboards from './pages/PeriodicMaintenance/Dashboards';
import DailyMaintenanceAdminForm from './pages/DailyMaintenance/DailyMaintenanceAdminForm';
import EmergencyDashboard from './pages/EmergencyMaintenace/Dashboard/EmergencyDashboard';
import DailyProcessForm from './pages/DailyMaintenance/DailyProcessForm';
import DailyMaintenanceProcessView from './pages/DailyMaintenance/DailyMaintenanceProcessView';
// import EmergencyDashboard from './pages/EmergencyMaintenace/Dashboard/emergencyDashboard';

// import Drivers from './pages/Vehicle Assigned';
// import DriverAddForm from './pages/Vehicle Assigned/VehicleTagForm';
// import DriversAddForm from './pages/Drivers/DriversAddForm';
// import Vehicles from './pages/Vehicles';
// import TagVehicleForm from './pages/Vehicle Assigned/VehicleTagForm';
// import VehicleAssigned from './pages/Vehicle Assigned';

function App() {
  const [loading, setLoading] = useState(true);
  const { pathname } = useLocation();
  let auth = useSelector((state) => state.auth);
  const PrivateRoutes = () => {
    return auth.isAuthenticated ? <Outlet /> : <Navigate to="/auth/signin" />;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Routes>
        {/* set-admin-password/b21bb23abc013133753ad2cb70016eaf816bd55dcfbaf113d03e49301e55efb3 */}
        <Route path="/set-admin-password/:token" element={<SetPassword />} />
        <Route path="/set-password/:token" element={<SetPassword />} />
        <Route path="/auth/signin" element={<SignIn />} />
        <Route
          path="/"
          element={
            auth.isAuthenticated ? (
              <Navigate to="/dashboard" replace={true} />
            ) : (
              <Navigate to="/auth/signin" replace={true} />
            )
          }
        />
        {/* <Route element={<PrivateRoutes />}> */}
        <Route path="/dashboard" element={<ECommerce />} />
        <Route path="/roles" element={<Roles />} />
        <Route path="/roles/update" element={<RoleUpdate />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/companies/view/:id" element={<CompanyView />} />
        <Route path="/companies/add" element={<CompanyForm />} />
        <Route path="/companies/update/:id" element={<CompanyForm />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/view/:id" element={<UserView />} />
        <Route path="/users/add" element={<UserAddForm />} />
        <Route path="/users/update/:id" element={<UserUpdateForm />} />
        <Route path="/locations" element={<Locations />} />
        <Route path="/locations/view/:id" element={<LocationView />} />
        <Route
          path="/locations/view/:id"
          element={<LocationSubregionTable />}
        />
        <Route path="/locations/update/:id" element={<LocationForm />} />
        <Route path="/locations/add" element={<LocationForm />} />

        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/vehicles/add" element={<VehicleAddForm />} />
        <Route path="/vehicles/view/:id" element={<VehicleView />} />
        <Route path="/vehicles/update/:id" element={<VehicleUpdateForm />} />

        <Route path="/vehicle-tagged" element={<VehicleAssigned />} />
        <Route path="/vehicle-tagged/add" element={<TagVehicleForm />} />
        <Route
          path="/vehicle-tagged/update/:id"
          element={<VehicleTagUpdateForm />}
        />
        <Route
          path="/vehicle-tagged/view/:id"
          element={<VehicleTaggingView />}
        />
        <Route path="/drivers" element={<Drivers />} />
        <Route path="/drivers/add" element={<DriversAddForm />} />
        <Route path="/drivers/update/:id" element={<DriverUpdateForm />} />
        <Route path="/drivers/view/:id" element={<DriverView />} />
        <Route path="/fuel-management" element={<FuelManagement />} />
        <Route path="/fuel-management/form" element={<FuelRequestForm />} />
        <Route
          path="/fuel-management/update/:id"
          element={<FuelRequestForm />}
        />
        <Route path="/fuel-management/view/:id" element={<FuelView />} />
        <Route
          path="/fuel-management/update-fuel-request/:id"
          element={<UpdateFuelRequestForm />}
        />
        <Route path="/fuel-management/fuel-issue/:id" element={<FuelIssue />} />
        <Route
          path="/fuel-management/fuel-dashboard"
          element={<FuelDashboard />}
        />

        <Route path="/periodic" element={<PeriodicMaintenance />} />
        <Route path="/periodic/form" element={<PeriodicForm />} />
        <Route path="/periodic/update/:id" element={<UpdatePeriodicForm />} />
        <Route path="/periodic/view/:id" element={<PeriodicView />} />
        <Route
          path="/periodic/complete/:id"
          element={<CompletePeriodicForm />}
        />

        <Route path="/periodic/parameters" element={<Parameters />} />
        <Route path="/periodic/parameters/form" element={<ParametersForm />} />

        <Route path="/periodic/parameters/view" element={<Parameters />} />

        <Route path="/periodic/reports" element={<Reports />} />
        <Route path="/periodic/dashboard" element={<Dashboards />} />

        <Route path="/daily-maintenance" element={<DailyMaintenance />} />
        <Route path="/daily-maintenance/create-team" element={<CreateTeam />} />
        <Route
          path="/daily-maintenance/admin-form"
          element={<DailyMaintenanceAdminForm />}
        />
        <Route
          path="/daily-maintenance/form"
          element={<DailyMaintenanceForm />}
        />
        <Route
          path="/daily-maintenance/checklist"
          element={<DailyMaintainenceChecklist />}
        />
        <Route path="/daily-maintenance/view" element={<DailyView />} />
        <Route
          path="/daily-maintenance/maintenance-team"
          element={<MaintenanceTeamsTable />}
        />
        <Route
          path="/daily-maintenance/maintenance-team/view/:teamId"
          element={<TeamView />}
        />
        <Route
          path="/daily-maintenance/maintenance-team/update/:teamId"
          element={<EditTeam />}
        />
        <Route
          path="/daily-maintenance/process/:id"
          element={<DailyProcessForm />}
        />
        <Route
          path="/daily-maintenance/process/view/:id"
          element={<DailyMaintenanceProcessView />}
        />

        {/* <Route
          path="/daily-maintenance/add"
          element={<DailyMaintenanceForm />
        /> */}

        <Route path="/Emergency-Maintenance" element={<EmergencyMnt />} />
        <Route
          path="/Emergency-Maintenance/add"
          element={<EmergencyMntForm />}
        />
        <Route
          path="/Emergency-Maintenance/process/:id"
          element={<EmergencyProcessForm />}
        />
        <Route
          path="/Emergency-Maintenance/update/:id"
          element={<EmergencyMntForm />}
        />
        <Route
          path="/Emergency-Maintenance/view/:id"
          element={<EmergencyMntView />}
        />
        <Route
          path="/Emergency-Maintenance/dashboard"
          element={<EmergencyDashboard />}
        />
        {/* <Route path="/roles/view/:id" element={<UserView />} />
          <Route path="/roles/add" element={<UserAddForm />} />
          <Route path="/roles/form/:id" element={<UserAddForm />} /> */}
        {/* </Route> */}
        {/* 
        <Route
          path="/users"
          element={
            <>
              <PageTitle title="Users" />
              <Users />
            </>
          }
        />
        <Route
          path="/users/add"
          element={
            <>
              <PageTitle title="Users" />
              <UserAddForm />
            </>
          }
        /> */}
        {/* <Route
          path="/profile"
          element={
            <>
              <PageTitle title="Profile | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Profile />
            </>
          }
        />
        <Route
          path="/forms/form-elements"
          element={
            <>
              <PageTitle title="Form Elements | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormElements />
            </>
          }
        />
        <Route
          path="/forms/form-layout"
          element={
            <>
              <PageTitle title="Form Layout | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <FormLayout />
            </>
          }
        />
        <Route
          path="/tables"
          element={
            <>
              <PageTitle title="Tables | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Tables />
            </>
          }
        />
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Settings />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Chart />
            </>
          }
        />
        <Route
          path="/ui/alerts"
          element={
            <>
              <PageTitle title="Alerts | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Alerts />
            </>
          }
        />
        <Route
          path="/ui/buttons"
          element={
            <>
              <PageTitle title="Buttons | TailAdmin - Tailwind CSS Admin Dashboard Template" />
              <Buttons />
            </>
          }
        /> */}
      </Routes>
    </>
  );
}

export default App;
