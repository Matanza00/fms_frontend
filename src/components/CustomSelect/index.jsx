import React from 'react';
import Select from 'react-select';

const CustomSelect = ({
  label,
  options,
  onChange,
  value,
  placeholder,
  color = '#023047',
}) => {
  const customStyles = {
    control: (provided) => ({
      ...provided,

      borderColor: '#CBD5E0',
      '&:hover': { borderColor: color, color: '#000' },
    }),
  };

  return (
    <div className="w-full mr-[30px]">
      <div my="10px">
        {label && <div className="text-[#219ebc]">{label}</div>}
        <Select
          options={options}
          onChange={onChange}
          value={options.find((option) => option.value === value)}
          placeholder={placeholder}
          classNamePrefix="filter"
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              borderColor: state.isFocused ? '#CBD5E0' : '#023047',
              color: '#023047',
              opacity: 1,
            }),
            menu: (baseStyles, state) => ({
              ...baseStyles,
              color: '#023047',
            }),
          }}
        />
      </div>
    </div>
  );
};

export default CustomSelect;
