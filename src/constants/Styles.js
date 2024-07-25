export const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#gray',
    borderColor: 'transparent', // transparent border
    color: '#black', // text color
    height: '100%',
  }),
  option: (provided, state) => ({
    ...provided,
    color: 'gray', // dropdown text color
    backgroundColor: state.isSelected ? '#gray' : '#dark-gray', // selected and non-selected option background color
    '&:hover': {
      backgroundColor: '#CBD5E0', // option background color on hover
    },
  }),
};
