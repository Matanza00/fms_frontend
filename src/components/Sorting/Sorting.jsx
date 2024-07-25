// SortingComponent.js
import React, { useEffect, useState } from 'react';
import { FaSort, FaSortDown, FaSortUp } from 'react-icons/fa';

const SortingComponent = ({
  field,
  data,
  sortBy,
  sortOrder,
  setSortBy,
  setSortOrder,
}) => {
  // No need to maintain sortedData in state
  // const [sortedData, setSortedData] = useState([]);

  useEffect(() => {
    // This effect can be removed because the sorting logic is handled in handleSort
    // const sortData = () => {
    //   if (!sortBy) return;
    //   const newData = data.slice().sort((a, b) => {
    //     if (sortOrder === 'asc') {
    //       return a[sortBy] < b[sortBy] ? -1 : 1;
    //     } else {
    //       return a[sortBy] > b[sortBy] ? -1 : 1;
    //     }
    //   });
    //   setSortedData(newData);
    // };
    // sortData();
  }, [data, field, sortOrder, sortBy]);

  const handleSort = () => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  console.log('sortBy:', sortBy);
  console.log('sortOrder:', sortOrder);

  return (
    <th
      className="w-auto flex-1 py-4 px-4 text-black dark:text-white cursor-pointer"
      onClick={handleSort}
    >
      <span className="flex items-center">
        {field}{' '}
        <span className="ml-1">
          {sortBy === field ? (
            sortOrder === 'asc' ? (
              <FaSortUp />
            ) : (
              <FaSortDown />
            )
          ) : (
            <FaSort />
          )}
        </span>
      </span>
    </th>
  );
};

export default SortingComponent;
