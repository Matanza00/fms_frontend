export const generateGetQuery = (baseUrl, filters) => {
  const queryParams = Object.keys(filters)
    .map((key) => {
      const value = filters[key];
      const encodedKey = encodeURIComponent(key);
      const encodedValue = encodeURIComponent(value);
      return `${
        ['page', 'limit', 'sort', 'fields', 'search'].includes(key)
          ? key
          : `filters[${encodedKey}]`
      }=${encodedValue}`;
    })
    .join('&');

  if (!queryParams) {
    return baseUrl;
  } else {
    return `${baseUrl}?${queryParams}`;
  }
};

export const addCaseWithLoading = (
  builder,
  asyncAction,
  { onCompleted, onPending, onReject } = {},
) => {
  builder.addCase(asyncAction.pending, (state, action) => {
    if (state && state.isLoading !== undefined) {
      state.isLoading = true;
    }
    if (onPending) {
      onPending(state, action);
    }
  });
  builder.addCase(asyncAction.fulfilled, (state, action) => {
    if (onCompleted) {
      onCompleted(state, action);
    }
    if (state && state.isLoading !== undefined) {
      state.isLoading = false;
    }
  });
  builder.addCase(asyncAction.rejected, (state, action) => {
    if (onReject) {
      onReject(state, action);
    }
    if (state && state.isLoading !== undefined) {
      state.isLoading = false;
    }
  });
};

export const debounce = (func, delay) => {
  let timer;
  return function (...args) {
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
};
export const formatDateAndTime = (dateString) => {
  const date = new Date(dateString);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const timeOptions = { hour: '2-digit', minute: '2-digit' };

  const formattedDate = date.toLocaleDateString('en-CA', options);
  const formattedTime = date.toLocaleTimeString('en-GB', timeOptions);

  return `Date: ${formattedDate}, Time: ${formattedTime}`;
};

export function formatDateForInput(dateString) {
  // Creating a Date object from the provided date string
  let date = new Date(dateString);

  // Getting the year, month, and day from the Date object
  let year = date.getFullYear();
  let month = String(date.getMonth() + 1).padStart(2, '0'); // Month starts from 0, so add 1
  let day = String(date.getDate()).padStart(2, '0');

  // Formatting the date as YYYY-MM-DD, which is compatible with HTML input type date
  let formattedDate = `${year}-${month}-${day}`;

  return formattedDate;
}

export default function roleValue(value) {
  switch (value) {
    case 'regionalAdmin' || 'RegionalAdmin':
      return 'Regional Admin';
    case 'companyAdmin' || 'CompanyAdmin':
      return 'Company Admin';
    case 'viewer' || 'Viewer':
      return 'Viewer';
    case 'fuelManager' || 'FuelManager':
      return 'Fuel Manager';
    case 'fuelOfficer' || 'FuelOfficer':
      return 'Fuel Officer';
    default:
      return 'Viewer';
  }
}
