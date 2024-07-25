export const stationOptions = [
  { value: 'SRG', label: 'SRG' },
  { value: 'ABBT', label: 'ABBT' },
  { value: 'PSW', label: 'PSW' },
  { value: 'MUL', label: 'MUL' },
  { value: 'RWP', label: 'RWP' },
  { value: 'GJT', label: 'GJT' },
  { value: 'QTA', label: 'QTA' },
  { value: 'HYD', label: 'HYD' },
  { value: 'BWP', label: 'BWP' },
  { value: 'KHI', label: 'KHI' },
  { value: 'SWT', label: 'SWT' },
  { value: 'JHG', label: 'JHG' },
  { value: 'FSD', label: 'FSD' },
  { value: 'SAHIWAL', label: 'SAHIWAL' },
  { value: 'SKPR', label: 'SKPR' },
  { value: 'ATTK', label: 'ATTK' },
  { value: 'MRP', label: 'MRP' },
  { value: 'DIK', label: 'DIK' },
  { value: 'VHR', label: 'VHR' },
  { value: 'ISL', label: 'ISL' },
  { value: 'LHR', label: 'LHR' },
  { value: 'SUK', label: 'SUK' },
  { value: 'SKT', label: 'SKT' },
  { value: 'DGK', label: 'DGK' },
  { value: 'GWD', label: 'GWD' },
  { value: 'TRBT', label: 'TRBT' },
  { value: 'GJW', label: 'GJW' },
  { value: 'MRD', label: 'MRD' },
  { value: 'RYK', label: 'RYK' },
  { value: 'MBD', label: 'MBD' },
  { value: 'JHL', label: 'JHL' },
  { value: 'BWNGR', label: 'BWNGR' },
  { value: 'CHTR', label: 'CHTR' },
  { value: 'AJK', label: 'AJK' },
  { value: 'GBT', label: 'GBT' },
  { value: 'HNG', label: 'HNG' },
  { value: 'MZFRB', label: 'MZFRB' },
  { value: 'Head Office', label: 'Head Office' },
];

export const licenseOptions = [
  { value: 'LTV', label: 'LTV' },
  { value: 'HTV', label: 'HTV' },
  { value: 'MCR', label: 'MCR' },
  { value: 'PSV', label: 'PSV' },
];

export const door = [
  { value: '1_door', label: '1 Door' },
  { value: '2_door', label: '2 Door' },
  { value: '3_door', label: '3 Door' },
  { value: '4_door', label: '4 Door' },
];

export const fuel = [
  { value: 'diesel', label: 'Diesel' },
  { value: 'petrol', label: 'Petrol' },
  { value: 'cng', label: 'CNG' },
];

export const make = [
  { value: 'toyota', label: 'Toyota' },
  { value: 'honda', label: 'Honda' },
  { value: 'ford', label: 'Ford' },
  { value: 'bmw', label: 'BMW' },
];
export const type = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'truck', label: 'Truck' },
  { value: 'suv', label: 'SUV' },
  { value: 'jeep', label: 'Jeep' },
];

export const model = [
  { value: 'corolla', label: 'Corolla' },
  { value: 'civic', label: 'Civic' },
  { value: 'f-150', label: 'F-150' },
  { value: 'xs', label: 'X5' },
];

export const size = [
  { value: 'compact', label: 'Compact' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' },
];

export const subregion = [
  { value: 'gilgit', label: 'Gilgit' },
  { value: 'skardu', label: 'Skardu' },
  { value: 'hunza', label: 'Hunza' },
];
export const region = [
  { value: 'gilgit', label: 'Gilgit' },
  { value: 'skardu', label: 'Skardu' },
  { value: 'hunza', label: 'Hunza' },
];

export const modeOfFueling = [
  { value: 'PSO', label: 'PSO' },
  { value: 'APL', label: 'APL' },
  { value: 'cash', label: 'Cash' },
  { value: 'credit', label: 'Credit' },
];

// export const modeOfFueling = [
//   { value: 'cash', label: 'Cash' },
//   { value: 'aplCcard', label: 'APL Card' },
//   { value: 'psoCcard', label: 'PSO Card' },
//   { value: 'credit', label: 'Credit' },
// ];

export const requestType = [
  { value: 'local', label: 'Local' },
  { value: 'domestic', label: 'Domestic' },
];

export const periodicType = [
  { value: 'oil', label: 'oil' },
  { value: 'air-filter', label: 'air-filter' },
  { value: 'diesel-filter', label: 'diesel-filter' },
  { value: 'tyre', label: 'tyre' },
  { value: 'battery', label: 'battery' },
];
export const options = [
  { value: 'accept', label: 'Accept' },
  { value: 'reject', label: 'Reject' },
  { value: 'pending', label: 'Pending' },
];

export const oilFilterType = [
  { value: '10114', label: '10114' },
  { value: '326 G' },
];
// export const fuelRequestsFilter: [
//   { value: 'Accept', label: 'Accept' },
//   { value: 'Pending', label: 'Pending' },
//   { value: 'Rejected', label: 'Rejected' },
// ];

export const periodicThreshold = {
  oil: {
    min: 4000,
    max: 4500,
  },
  airFilter: {
    min: 12000,
    max: 12001,
  },
  dieselFilter: {
    min: 25000,
    max: 25001,
  },
  tyre: {
    min: 40000,
    max: 60000,
  },
  battery: {
    min: 4000,
    max: 4500,
  },
};

export const vendorType = [
  { value: 'indoor', label: 'Indoor' },
  { value: 'outdoor', label: 'Outdoor' },
];

export const indoorVendorName = [
  { value: '', label: 'All' }, // All option
  { value: '101091 - (Lasani Auto)', label: '101091 - (Lasani Auto)' },
  { value: '101088 - (Amjad Auto)', label: '101088 - (Amjad Auto)' },
  {
    value: '101342 - (Multan Diesel Lab)',
    label: '101342 - (Multan Diesel Lab)',
  },
  {
    value: '101090 - (Lahore Diesel Lab)',
    label: '101090 - (Lahore Diesel Lab)',
  },
  {
    value: '101343 - (Hassan Kamani Maker)',
    label: '101343 - (Hassan Kamani Maker)',
  },
  {
    value: '101344 - (Mirza Waseem Lock)',
    label: '101344 - (Mirza Waseem Lock)',
  },
  {
    value: '101345 - (Yaseen Kamani Maker)',
    label: '101345 - (Yaseen Kamani Maker)',
  },
  {
    value: '101346 - (Ch. Sons Auto Store)',
    label: '101346 - (Ch. Sons Auto Store)',
  },
  { value: '101347 - (Data Auto Store)', label: '101347 - (Data Auto Store)' },
  {
    value: '101348 - (Madina Master Moter)',
    label: '101348 - (Madina Master Moter)',
  },
  { value: '101349 - (Ayan Auto)', label: '101349 - (Ayan Auto)' },
  { value: '101350 - (Mian Auto)', label: '101350 - (Mian Auto)' },
  { value: '101356 - (Naeem Auto)', label: '101356 - (Naeem Auto)' },
  { value: '101351 - (Sajid Auto)', label: '101351 - (Sajid Auto)' },
  {
    value: '101352 - (Hassan Askari Trader)',
    label: '101352 - (Hassan Askari Trader)',
  },
  { value: '101364 - (City Car AC)', label: '101364 - (City Car AC)' },
  {
    value: '101361 - (Khan Diesel Service)',
    label: '101361 - (Khan Diesel Service)',
  },
  { value: '101359 - (Naeem Auto)', label: '101359 - (Naeem Auto)' },
  { value: '101357 - (Zubair Auto)', label: '101357 - (Zubair Auto)' },
  { value: '101374 - (Ali Auto)', label: '101374 - (Ali Auto)' },
  { value: '10012 - (Ameen Moter)', label: '10012 - (Ameen Moter)' },
  {
    value: '101319 - (SK Auto Services Karachi)',
    label: '101319 - (SK Auto Services Karachi)',
  },
  {
    value: '10023 - (Bismillah Autos Hyderabad)',
    label: '10023 - (Bismillah Autos Hyderabad)',
  },
  { value: '101321 - (Rizwan Auto)', label: '101321 - (Rizwan Auto)' },
  { value: '101337 - (Farooq Car AC)', label: '101337 - (Farooq Car AC)' },
  { value: '101334 - (Irshad Autos)', label: '101334 - (Irshad Autos)' },
  {
    value: '10151 - (Toyota Multan Motors)',
    label: '10151 - (Toyota Multan Motors)',
  },
  { value: '101326 - (Toyota Center)', label: '101326 - (Toyota Center)' },
  {
    value: '10166 - (Akbar Auto Workshop)',
    label: '10166 - (Akbar Auto Workshop)',
  },
  {
    value: '101257 - (Nisar & Sons GOV Cont Car AC Auto Workshop)',
    label: '101257 - (Nisar & Sons GOV Cont Car AC Auto Workshop)',
  },
  { value: '101314 - (Akram Auto)', label: '101314 - (Akram Auto)' },
  {
    value: '101336 - (Shams Diesel Lab)',
    label: '101336 - (Shams Diesel Lab)',
  },
  {
    value: '101368 - (Zarghoon Cool Center)',
    label: '101368 - (Zarghoon Cool Center)',
  },
  {
    value: '101077 - (MT Dept. Cash advance)',
    label: '101077 - (MT Dept. Cash advance)',
  },
  {
    value: '10111 - (MT-Payable-Miscellaneous parties)',
    label: '10111 - (MT-Payable-Miscellaneous parties)',
  },
  {
    value: '101316 - (S.F Traders (Tyres Karachi))',
    label: '101316 - (S.F Traders (Tyres Karachi))',
  },
  {
    value: '101178 - (APL (Attock petroleum))',
    label: '101178 - (APL (Attock petroleum))',
  },
];
