import React, { useEffect, useState } from 'react';
import { GrNext, GrPrevious } from 'react-icons/gr';
import { FcNext, FcPrevious } from 'react-icons/fc';
import { RxDoubleArrowLeft, RxDoubleArrowRight } from 'react-icons/rx';

const PeriodicPaginationComponent = ({
  isLoading,
  isError,
  data,
  page,
  setPage,
  limit,
  setLimit,
}) => {
  const [totalPages, setTotalPages] = useState(0);
  const [startIndex, setStartIndex] = useState(0);
  const [dataToShow, setDataToShow] = useState([]);
  const [pages, setPages] = useState([]);
  const [paginationLoading, setPaginationLoading] = useState(false);

  const handlePage = (pageNumber) => {
    setPage(pageNumber);
  };

  const handleNextPage = () => {
    setPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleFirstPage = () => {
    setPage(1);
  };

  const handleLastPage = () => {
    setPage(totalPages);
  };

  useEffect(() => {
    if (!isLoading && !isError && data?.results > 0) {
      const totalPagesCount = Math.ceil(data?.results / limit);
      setTotalPages(totalPagesCount);
      const updatedData = data.data.slice(startIndex, startIndex + limit);
      setDataToShow(updatedData);
      const updatedPages = Array.from(
        { length: totalPagesCount },
        (_, i) => i + 1,
      );
      setPages(updatedPages);
      setPaginationLoading(false);
    }
  }, [isError, isError, data, limit, startIndex]);

  const recordsStart = (page - 1) * limit + 1;
  const recordsEnd = Math.min(page * limit, data?.results);

  return (
    <div className="flex justify-center">
      <div className="w-full flex flex-col justify-between">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="dropdown inline-block relative">
            <span>Rows per page:</span>
            <select
              value={limit}
              onChange={(e) => {
                setPage(1);
                setLimit(parseInt(e.target.value));
              }}
              className="px-1 ml-2 text-sm border bg-slate-100 border-slate-500 rounded-sm dark:border-slate-600 dark:bg-boxdark dark:text-slate-300"
            >
              <option value={12}>12</option>
              <option value={24}>24</option>
              <option value={48}>48</option>
              <option value={96}>96</option>
            </select>
            <span className="text-sm text-gray-600 ml-2">
              Showing {recordsStart}-{recordsEnd} of {data?.results}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleFirstPage}
              disabled={page === 1}
              className={`px-2 py-2 rounded-md ${
                page === 1
                  ? 'bg-slate-200 text-gray-600 cursor-not-allowed dark:bg-slate-600 dark:text-graydark'
                  : 'bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:bg-blue-600'
              }`}
            >
              <RxDoubleArrowLeft />
            </button>
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              className={`px-2 py-2 rounded-md ${
                page === 1
                  ? 'bg-slate-200 text-gray-600 cursor-not-allowed dark:bg-slate-600 dark:text-graydark'
                  : 'bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:bg-blue-600'
              }`}
            >
              <FcPrevious />
            </button>
            <div className="flex space-x-2">
              {pages.map((pageNumber) => {
                // Calculate the range of pages to display
                const startPage = Math.max(1, page - 2);
                const endPage = Math.min(totalPages, startPage + 4);

                if (pageNumber >= startPage && pageNumber <= endPage) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => handlePage(pageNumber)}
                      className={`px-3 py-1 rounded-md ${
                        pageNumber === page
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                return null;
              })}
            </div>
            <button
              onClick={handleNextPage}
              disabled={page === totalPages}
              className={`px-2 py-2 rounded-md ${
                page === totalPages
                  ? 'bg-slate-200 text-gray-600 cursor-not-allowed dark:bg-slate-600 dark:text-graydark'
                  : 'bg-slate-300 text-white hover:bg-slate-400 focus:outline-none focus:bg-slate-300'
              }`}
            >
              <FcNext />
            </button>
            <button
              onClick={handleLastPage}
              disabled={page === totalPages}
              className={`px-2 py-2 rounded-md ${
                page === totalPages
                  ? 'bg-slate-200 text-gray-600 cursor-not-allowed dark:bg-slate-600 dark:text-graydark'
                  : 'bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:bg-blue-600'
              }`}
            >
              <RxDoubleArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeriodicPaginationComponent;
