import {FaHouse, FaPlus, FaRegClock} from "react-icons/fa6";
import {
    BsGear,
    BsSearch,
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

interface IHeader {
    title: string;
}

const Header: FC<IHeader> = ({title}) => {
    const location = useLocation();
    const [user, setUser] = useState<Request>()

    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const decoded: Request = jwtDecode(Cookies.get('jwt') as string)

                setUser(decoded)
            } catch (e) {
                navigate("/tasks")
            }
        }

        fetchData()
    }, []);

    const locations = [
        {
            to: "/requests",
            inActive: <BsShare size={24} />,
            active: <BsShareFill size={24} />
        },
        {
            to: "/tasks",
            inActive: <BsHouse size={24} />,
            active: <BsHouseFill size={24} />
        },
        {
            to: "/tasks/new",
            inActive: <BsPlusCircle size={24} />,
            active: <BsPlusCircleFill size={24} />
        },
        {
            to: "/settings",
            inActive: <BsGear size={24}/>,
            active: <BsGearFill size={24} />
        }
    ]
    return (
        <header className="text-white p-5 flex justify-between border-b border-gray-700">
            <div className="flex items-center gap-3">
                <span className="font-bold text-[23px]">
                    <img className={"w-[100px]"} src={logo} />
                </span>
            </div>
            <div className="flex items-center gap-4">
                {
                    locations.map((loc) => (
                        <Link to={loc.to}>
                            {
                                user && (
                                    user.phoneNumber === "79999999999" ? (
                                        loc.to === location.pathname ? loc.active : loc.inActive
                                    ) : (
                                        loc.to !== "/requests" && (
                                            loc.to === location.pathname ? loc.active : loc.inActive
                                        )
                                    )
                                )
                            }
                        </Link>
                    ))
                }
            </div>
        </header>
    )
}

export default Header;