'use client';

import HeaderTitle from '@/components/HeaderTitle';
import React, { useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';
import ApiConfig from '@/Config/ApiConfig';
import Loading from '@/app/loading';

const ProductManagement = (props) => {
  const [productList, setProductList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState([]);

  useEffect(() => {
    const getProductList = async () => {
      const productResponse = await fetch(
        ApiConfig.baseURL + 'products/all?page=' + currentPage + '&limit=3',
      );
      const data = await productResponse.json();

      data.products && setProductList(data.products);
      data.totalPages && setTotalPages(data.totalPages);
    };

    getProductList();
  }, []);

  useEffect(() => {
    if (totalPages > 0) {
      setPagination(Array.from({ length: totalPages }, (v, i) => i + 1));
    }
  }, [totalPages]);

  const renderActionButtons = (slug) => {
    return (
      <div>
        <Link
          href={'/product-management/' + slug + '?edit=false'}
          type="button"
          className="text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm px-2 py-2 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
        >
          View
        </Link>
        <Link
          type="button"
          href={'product-management/' + slug + '?edit=true'}
          className="text-white bg-yellow-400 hover:bg-yellow-500 focus:outline-none focus:ring-yellow-300 font-medium rounded-full text-sm px-2 py-2 text-center me-2 mb-2 dark:focus:ring-yellow-900"
        >
          Edit
        </Link>
        <Link
          type="button"
          href={'/'}
          className="text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm px-2 py-2 text-center me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
        >
          Delete
        </Link>
      </div>
    );
  };

  return productList.length ? (
    <>
      <HeaderTitle title={'Product Management'} />

      <Link
        href={'/product-management/add'}
        type="button"
        className="text-white bg-blue-700 hover:bg-blue-800
         font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 
         dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800
         mt-5
         "
      >
        Thêm sản phẩm
      </Link>

      <ul role="list" className="divide-y divide-gray-100">
        {productList.length &&
          productList.map((product) => (
            <li key={product._id} className="flex justify-between gap-x-6 py-5">
              <div className="flex min-w-0 gap-x-4">
                <img
                  className="h-12 w-12 flex-none rounded-full bg-gray-50"
                  src={product.thumbs[0]}
                  alt={product.name}
                />
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">
                    {product.name}
                  </p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">
                    SKU: {product.sku}
                  </p>
                </div>
              </div>
              {renderActionButtons(product.slug)}
            </li>
          ))}
      </ul>

      <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
        <div className="flex flex-1 justify-between sm:hidden">
          {currentPage > 1 && (
            <a
              href="#"
              className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Previous
            </a>
          )}
          {currentPage < totalPages && (
            <a
              href="#"
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Next
            </a>
          )}
        </div>
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium"></span>
              <span className="font-medium">{productList.length}</span> results
            </p>
          </div>
          <div>
            <nav
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
              aria-label="Pagination"
            >
              {currentPage > 1 && (
                <a
                  href="#"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    currentPage === 1 ? 'pointer-events-none opacity-50' : ''
                  }`}
                >
                  <span className="sr-only">Previous</span>
                  <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                </a>
              )}

              {pagination.map((page) => (
                <a
                  key={page}
                  href="#"
                  onClick={() => setCurrentPage(page)}
                  aria-current={currentPage === page ? 'page' : undefined}
                  className={`relative z-10 inline-flex items-center ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } px-4 py-2 text-sm font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ring-1 ring-inset ring-gray-300`}
                >
                  {page}
                </a>
              ))}

              {currentPage < totalPages && (
                <a
                  href="#"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${
                    currentPage === totalPages ? 'pointer-events-none opacity-50' : ''
                  }`}
                >
                  <span className="sr-only">Next</span>
                  <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                </a>
              )}
            </nav>
          </div>
        </div>
      </div>
    </>
  ) : (
    <Loading />
  );
};

export default ProductManagement;
