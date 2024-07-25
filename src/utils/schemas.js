import { quality } from '@cloudinary/url-gen/actions/delivery';

export const loginSchema = { email: '', password: '' };

export const addCompanySchema = { email: '', name: '', address: '', logo: '' };

export const addUserSchema = {
  email: '',
  employeeId: '',
  phone: '',
  username: '',
  roleId: '',
  companyId: '',
  station: '',
};

export let addCompanyAdminSchema = {
  email: '',
  phone: '',
  username: '',
  companyId: '',
};

export const addDriverSchema = {
  employeeId: '',
  name: '',
  licenseType: '',
  joiningDate: '',
  station: '',
  companyId: '',
  cnic: '',
  license: '',
  medicalCertificate: '',
};

export const addVehicleSchema = {
  registrationNo: '',
  make: '',
  model: '',
  type: '',
  size: '',
  oddometerReading: '',
  registrationCertificate: '',
  doorType: '',
  fuelType: '',
  commisionDate: '',
  region: '',
  subRegion: '',
  station: '',
  companyId: '',
};

// export const addMaintainceTeamSchema = {
//   serviUsername: '',
//   mtoUsername: '',
//   roleId: '',
//   station: '',
// };
export const tagDriverSchema = {
  vehicleId: '',
  driverId: '',
  station: '',
};

export const addFuelRequestSchema = {
  station: '',
  registrationNo: '',
  cardNo: '',
  driverName: '',
  gbmsNo: '',
  modeOfFueling: '',
  currentOddometerReading: '', //manual reading
  currentOddometerReadingAuto: '',
  // currentOddometerReadingManual: '',
  currentFuelingDate: '',
  previousOddometerReading: '',
  // perviousFuelingDate: '',
  quantityOfFuel: '0',
  previousFuelQuantity: '0',
  rateOfFuel: '0',
  amount: '0',
  fuelAverage: '',
  fuelReceipt: '',
  odometerImg: '',
  requestType: '',
  fuelType: '',
};

export const respondFuelRequestSchema = {
  status: '',
};

export const addPeriodicRequestSchema = {
  station: '',
  registrationNo: '',
  currentOddometerReading: '',
  periodicType: '',

  meterReading: '',
  make: '',
  gbmsNo: '',
  lastDateOfChange: '',
  lastChangedMeterReading: '',
  runningDifference: '',
  dueStatus: '',
  quantity: '',
  aplCardNo: '',
  amount: '',
  issueDate: '',
  description: '',
  remarks: '',
  extras: '',
};

export const respondPeriodicRequestSchema = {
  status: '',
};

export const addDailyRequestSchema = {
  vehicleInspection: { value: '', reason: '' },
  engineOil: { value: '', reason: '' },
  transmissionFluid: { value: '', reason: '' },
  coolant: { value: '', reason: '' },
  brakeFluid: { value: '', reason: '' },
  windshieldWasherFluid: { value: '', reason: '' },
  tireInspection: { value: '', reason: '' },
  headlights: { value: '', reason: '' },
  taillights: { value: '', reason: '' },
  brakeLights: { value: '', reason: '' },
  turnLights: { value: '', reason: '' },
  hazardLights: { value: '', reason: '' },
  brakes: { value: '', reason: '' },
  brakeFluidLevel: { value: '', reason: '' },
  battery: { value: '', reason: '' },
  interiorCleanliness: { value: '', reason: '' },
  registrationDocument: { value: '', reason: '' },
  insuranceDocument: { value: '', reason: '' },
  permitDocument: { value: '', reason: '' },
  firstAidKit: { value: '', reason: '' },
  fireExtinguisher: { value: '', reason: '' },
  reflectiveTriangles: { value: '', reason: '' },
  fuelLevel: { value: '', reason: '' },
  totalFaults: '',
};

export const respondDailyRequestSchema = {
  id: '',
  status: '',
};

export const parameterPrioritySchema = {
  description: 'Item description',
  quantity: '1',
  rate: '0.00',
};

export const addParameterSchema = {
  job: '',
  notes: '',
  replaceAfterKms: '',
  replaceAfterMonths: '',
  pointsDeduction: '',
  priorityLevels: [
    { label: '', minKm: '', maxKm: '', minMonths: '', maxMonths: '' },
  ],
};

export const addEmergencyRequestSchema = {
  station: '',
  registrationNo: '',
  make: '',

  meterReading: '',
  driverName: '',
  gbmsNo: '',
  aplCardNo: '',
  repairCost: '',
  ce: '',
  rm_omorName: '',

  emergencySupervisor: '',
  vendorType: 'Indoor',
  indoorVendorName: '',
  outdoorVendorName: '',
  outdoorVendorReason: '',
  emergencyJob: '',

  description: '',
  // remarks: '',
  // extras: '',

  emergencyRepairRequestImg: [],
  emergencyRepairStatementVideo: '',

  emergencyRepairCompletionImg: '',
  emergencyReceiptImg: '',
};
export const respondEmergencyRequestSchema = {
  status: '',
};

export const addMaintenanceTeamSchema = {
  // MaintenanceTeamId: '',
  station: '',
  mto: '',
  serviceManager: '',
  vehicleId: '',
};
