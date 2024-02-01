'use client';

import React, { useEffect, useState } from 'react';
import { PhotoIcon } from '@heroicons/react/24/solid';

import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { ToastError, ToastSuccess } from '@/constants/sweetalert';
import ApiConfig from '@/Config/ApiConfig';
import { initialSlideState } from '@/constants/initialState';

function SlideForm(props) {
  const [slide, setSlide] = useState(initialSlideState);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(0);

  const { params, searchParams } = props;
  const { slug } = params;
  const { edit } = searchParams;
  const router = useRouter();

  useEffect(() => {
    const getSlider = async () => {
      const sliderRequest = await fetch(ApiConfig.baseURL + 'slides/' + slug);
      const slide = await sliderRequest.json();
      if (slide._id) {
        setSlide((prevState) => ({
          ...prevState,
          id: slide?._id,
          title: slide?.title,
          thumb: slide?.thumb,
          description: slide?.description,
          buttonText: slide?.buttonText,
          display: slide?.display,
          createdAt: slide?.createdAt,
          updatedAt: slide?.updatedAt,
        }));
      }
    };

    slug !== 'add' && getSlider();
  }, [slug]);

  const handlePostSlide = async () => {
    const url = slug === 'add' ? 'slides/add' : `slides/${slider.id}`;
    const postRequest = await fetch(`${ApiConfig.baseURL}${url}`, {
      method: slug === 'add' ? 'POST' : 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(slide),
    });

    if (postRequest.status === 200) {
      router.push('/slide-management');
      slug === 'add'
        ? ToastSuccess('Slide đã được thêm')
        : ToastSuccess('Slide đã được cập nhật');
    } else if (postRequest.status === 500) {
      ToastError('Có lỗi xảy ra');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSlide((prevState) => ({
      ...prevState,
      [name]: name == 'display' ? !prevState.display : value,
    }));
  };

  const handleChangeImage = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      let file = e.target.files[i];
      // Create the file metadata
      /** @type {any} */
      const metadata = {
        contentType: 'image/jpeg',
      };

      const storageRef = ref(storage, 'images/' + file.name);
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          setProgress(Math.round(progress));
          setLoading(true);
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default:
              console.log('Error');
          }
        },
        (error) => {
          switch (error.code) {
            case 'storage/unauthorized':
              toastWarning("User doesn't have permission to access the object");
              break;
            case 'storage/canceled':
              toastWarning('User canceled the upload');
              break;
            case 'storage/unknown':
              toastWarning('Unknown error occurred, inspect error.serverResponse');
              break;
            default:
              console.log('Error');
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setLoading(false);
            setProduct((prevState) => ({
              ...prevState,
              thumb: downloadURL,
            }));
          });
        },
      );
    }
  };

  const handleDeleteImage = () => {
    setSlide((prevState) => ({
      ...prevState,
      thumb: '',
    }));
  };

  const renderBottomButton = () => {
    return (
      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-gray-900"
          onClick={() => router.back()}
        >
          Hủy
        </button>
        <button
          type="button"
          onClick={handlePostSlide}
          disabled={edit === 'false'}
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {slug === 'add' ? 'Thêm' : 'Sửa'}
        </button>
      </div>
    );
  };

  const renderUploadFile = () => {
    return (
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
        <div className="text-center">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                onChange={(e) => handleChangeImage(e)}
                disabled={edit === 'false' ? true : false}
              />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
    );
  };

  return (
    <form>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            {edit === 'false' ? 'Xem' : slug === 'add' ? 'Thêm' : 'Chỉnh sửa'} Sản phẩm
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="title"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Tiêu đề:
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={slide?.title}
                  onChange={(e) => handleInputChange(e)}
                  disabled={edit === 'false' ? true : false}
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset 
                  ${edit === 'false' ? 'cursor-not-allowed' : ''}
                  ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Mô tả:
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="title"
                  id="title"
                  value={slide?.title}
                  onChange={(e) => handleInputChange(e)}
                  disabled={edit === 'false' ? true : false}
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset 
                  ${edit === 'false' ? 'cursor-not-allowed' : ''}
                  ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="buttonText"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Chữ trên nút:
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="buttonText"
                  id="buttonText"
                  value={slide?.buttonText}
                  onChange={(e) => handleInputChange(e)}
                  disabled={edit === 'false' ? true : false}
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset 
                  ${edit === 'false' ? 'cursor-not-allowed' : ''}
                  ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultValue
                  className="sr-only peer"
                  name="display"
                  onChange={(e) => handleAttributeChange(e)}
                  disabled={edit === 'false' ? true : false}
                  checked={slide.display}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none  dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600" />
                <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                  Trạng thái: {slide.display ? 'Hiện' : 'Ẩn'}
                </span>
              </label>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="cover-photo"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Hình ảnh:
              </label>
              {edit == 'true' || (slug === 'add' && renderUploadFile())}

              {!loading ? (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-5">
                  <div className="relative">
                    <img
                      className="h-auto max-w-full rounded-lg w-full"
                      src={slide.thumb}
                      alt={slide.name}
                    />
                    <button
                      type="button"
                      onClick={() => handleDeleteImage()}
                      className="flex justify-center items-center select-none bg-white  border-2 text-white text-xl font-bold absolute -top-2 -right-3
           p-1 rounded-full shadow h-6 w-6 focus:outline-none focus:shadow-outline"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={40}
                        height={40}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="black"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-x"
                      >
                        <line x1={18} y1={6} x2={6} y2={18} />
                        <line x1={6} y1={6} x2={18} y2={18} />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
                  <div
                    className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
                    style={{ width: `${progress}%` }}
                  >
                    {progress}%
                  </div>
                </div>
              )}
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="createdAt"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Ngày tạo:
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="createdAt"
                  id="createdAt"
                  value={slide?.createdAt}
                  onChange={(e) => handleInputChange(e)}
                  disabled={edit === 'false' ? true : false}
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset 
                  ${edit === 'false' ? 'cursor-not-allowed' : ''}
                  ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                />
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="updatedAt"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Ngày cập nhật:
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  name="updatedAt"
                  id="updatedAt"
                  value={slide?.updatedAt}
                  onChange={(e) => handleInputChange(e)}
                  disabled={edit === 'false' ? true : false}
                  className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset 
                  ${edit === 'false' ? 'cursor-not-allowed' : ''}
                  ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {renderBottomButton()}
    </form>
  );
}

export default SlideForm;
