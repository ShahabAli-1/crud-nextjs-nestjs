"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "../redux/store/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Link from "next/link";
interface ProvidersProps {
  children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
  return (
    <Provider store={store}>
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex space-x-4">
              <Link
                href="/"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Home
              </Link>
              <Link
                href="/services"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Services
              </Link>
              <Link
                href="/packages"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Packages
              </Link>
            </div>
          </div>
        </div>
      </nav>
      {children}
      <ToastContainer />
    </Provider>
  );
};

export default Providers;
