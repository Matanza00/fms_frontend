import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CONSTANTS from './constants';
import { generateGetQuery } from './helpers';

const showErrorToast = (error, options = {}) => {
  let errorMessage = 'An error occurred';

  if (error && error?.message) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  toast.error(errorMessage, {
    position: 'bottom-center',
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: false,
    pauseOnHover: true,
    ...options,
  });
};

export const get = async (url, filters = {}) => {
  url = generateGetQuery(url, filters);
  return new Promise((resolve, reject) => {
    fetch(CONSTANTS.api + url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw 'An unexpected error has occurred. Please try again later.';
        }
      })
      .then((data) => {
        if (data?.success == false || data?.error)
          throw data?.message || data?.msg
            ? data?.message || data?.msg
            : 'An unexpected error has occurred. Please try again later.';
        resolve(data);
      })
      .catch((error) => {
        console.log(error);
        showErrorToast(error);
        reject(error);
      });
  });
};

export const post = async (url, _body) => {
  return new Promise((resolve, reject) => {
    fetch(CONSTANTS.api + url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(_body),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw 'An unexpected error has occurred. Please try again later.';
        }
      })
      .then((data) => {
        if (data?.success == false || data?.error)
          throw data?.message || data?.msg
            ? data?.message || data?.msg
            : 'An unexpected error has occurred. Please try again later.';
        resolve(data);
      })
      .catch((error) => {
        console.log(error);
        showErrorToast(error);
        reject(error);
      });
  });
};

export const postWithFormData = async (url, body) => {
  return new Promise((resolve, reject) => {
    fetch(CONSTANTS.api + url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body,
    })
      .then((res) => {
        if (res.ok || res.status == 400) {
          return res.json();
        }
      })
      .then((data) => {
        if (data?.success == false || data?.error)
          throw data?.message || data?.msg
            ? data?.message ?? data?.msg
            : 'An unexpected error has occurred. Please try again later.';
        resolve(data);
      })
      .catch((error) => {
        console.log(error);
        showErrorToast(error);
        reject(error);
      });
  });
};

export const postImportFile = async (url, body) => {
  return new Promise((resolve, reject) => {
    fetch(CONSTANTS.ImportApi + url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body,
    })
      .then((res) => {
        if (res.ok || res.status == 400) {
          return res.json();
        }
      })
      .then((data) => {
        if (data?.success == false || data?.error)
          throw data?.message || data?.msg
            ? data?.message ?? data?.msg
            : 'An unexpected error has occurred. Please try again later.';
        resolve(data);
      })
      .catch((error) => {
        console.log(error);
        showErrorToast(error);
        reject(error);
      });
  });
};

export const patch = async (url, _body) => {
  return new Promise((resolve, reject) => {
    fetch(CONSTANTS.api + url, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(_body),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.log(error);
        showErrorToast(error);
        reject(error);
      });
  });
};

export const patchWithFormData = async (url, body) => {
  return new Promise((resolve, reject) => {
    fetch(CONSTANTS.api + url, {
      method: 'PATCH',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.log(error);
        showErrorToast(error);
        reject(error);
      });
  });
};

export const put = async (url, _body) => {
  return new Promise((resolve, reject) => {
    fetch(CONSTANTS.api + url, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify(_body),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.log(error);
        showErrorToast(error);
        reject(error);
      });
  });
};

export const putWithFormData = async (url, body) => {
  return new Promise((resolve, reject) => {
    fetch(CONSTANTS.api + url, {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body,
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.log(error);
        showErrorToast(error);
        reject(error);
      });
  });
};

export const Delete = async (url, id) => {
  return new Promise((resolve, reject) => {
    fetch(CONSTANTS.api + (url.endsWith('/') ? url : url + '/') + id, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    })
      .then((res) => {
        if (res.ok) {
          return id;
        }
      })
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        console.log(error);
        showErrorToast(error);
        reject(error);
      });
  });
};

export const postWithoutToken = async (url, _body) => {

  return new Promise((resolve, reject) => {
    fetch(CONSTANTS.api + url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(_body),
    })
      .then((res) => {
        if (!res.ok) {
          res.text().then((err) => {
            showErrorToast(JSON.parse(err)?.message);
            reject(err?.message);
          });
          return;
        }
        if (res.ok) {
          return res.json();
        } else {
          throw 'An unexpected error has occurred. Please try again later.';
        }
      })
      .then((data) => {
        if (data?.success == false || data?.error)
          throw data?.message || data?.msg
            ? data?.message || data?.msg
            : 'An unexpected error has occurred. Please try again later.';
        // console.log(resolve(data));
        resolve(data);
      })
      .catch((error) => {
        console.log(error);
        showErrorToast(error);
        reject(error);
      });
  });
};
