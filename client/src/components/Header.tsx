// src/components/Header.tsx
import {
  BsGear,
  BsHouseFill,
  BsHouse,
  BsGearFill,
  BsPlusCircle,
  BsPlusCircleFill,
  BsShare, BsShareFill
} from "react-icons/bs";
import React, {FC, useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Request} from "../typings/Request";
import {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie";
import logo from "../assets/img/logo.png";
import { FiLogOut } from "react-icons/fi";

interface IHeader {
  title: string;
}

const Header: FC<IHeader> = ({title}) => {
  const location = useLocation();
  const [user, setUser] = useState<Request>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = Cookies.get('jwt');
        if (!token) return;

        const decoded: any = jwtDecode(token);
        setUser(decoded);
      } catch (e) {
        navigate("/");
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    const ok = window.confirm("Вы действительно хотите выйти?");
    if (!ok) return;

    Cookies.remove("jwt");
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  const locations = [
    {
      to: "/requests",
      inActive: <BsShare size={24} />,
      active: <BsShareFill size={24} />,
      type: "link",
      adminOnly: true,
    },
    {
      to: "/tasks",
      inActive: <BsHouse size={24} />,
      active: <BsHouseFill size={24} />,
      type: "link",
    },
    {
      to: "/tasks/new",
      inActive: <BsPlusCircle size={24} />,
      active: <BsPlusCircleFill size={24} />,
      type: "link",
    },
    {
      to: "/settings",
      inActive: <BsGear size={24}/>,
      active: <BsGearFill size={24} />,
      type: "link",
    },
    {
      to: "#logout",
      inActive: <FiLogOut size={24} />,
      active: <FiLogOut size={24} />,
      type: "logout",
    }
  ];

  return (
    <header className="text-white p-5 flex justify-between border-b border-gray-700">
      <div className="flex items-center gap-3">
        <span className="font-bold text-[23px]">
          <img className={"w-[100px]"} src={logo} />
        </span>
      </div>
      <div className="flex items-center gap-4">
        {user && locations.map((loc) => {
          if (loc.adminOnly && user.phoneNumber !== "79999999999") {
            return null;
          }

          if (loc.type === "logout") {
            return (
              <button key={loc.to} onClick={handleLogout}>
                {loc.inActive}
              </button>
            );
          }

          return (
            <Link key={loc.to} to={loc.to}>
              {loc.to === location.pathname ? loc.active : loc.inActive}
            </Link>
          );
        })}
      </div>
    </header>
  );
}

export default Header;
