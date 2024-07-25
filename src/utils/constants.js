const CONSTANTS = Object.freeze({
    api: import.meta.env.VITE_BASE_URL + '/api/v1/',
  
    modules: {
      DASHBOARD: 'dashboard',
      COMPANIES: 'company',
      USER: 'user',
      ROLE: 'role',
      FIELDPERMISSION:"fieldpermission",
      ROLEMODULEPERMISSION:"rolemodulepermission"
    },
  
    
  
    modalStyles: {
      content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        border: 'none',
        padding: '0px',
      },
    },
  });
  
  export default CONSTANTS;
  