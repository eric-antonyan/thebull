// src/Layout.tsx
import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import { useHeight } from "./hooks/useHeght";

const Layout = ({
  title,
  context,
  children,
  back,
}: {
  title: string;
  context?: string;
  children: React.ReactNode;
  back?: boolean;
}) => {
  const height = useHeight();
  const navigate = useNavigate();

  return (
    <div
      className="max-w-[450px] flex flex-col w-full bg-gray-900"
      style={{ height: height + "px" }}
    >
      <Header title={title} />
      <div className={"p-5 flex-1 overflow-y-auto overflow-hidden"}>
        {back ? (
          <button
            onClick={() => navigate(-1)}
            className="mb-5 text-white flex items-center gap-5"
          >
            <FaArrowLeft size={25} />
            {context && (
              <h1 className="text-white text-2xl font-bold">
                {context && context.slice(0, 15)}
                {context && context.length >= 15 ? "..." : ""}
              </h1>
            )}
          </button>
        ) : (
          <Link to="/" className="mb-5 text-white flex items-center gap-5">
            <h1 className="text-white text-2xl font-bold">
              {context && context.slice(0, 25)}
              {context && context.length >= 25 ? "..." : ""}
            </h1>
          </Link>
        )}
        {children}
      </div>
    </div>
  );
};

export default Layout;
