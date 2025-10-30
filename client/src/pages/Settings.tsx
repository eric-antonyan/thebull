import Layout from "../Layout";
import {useEffect, useState} from "react";
import {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie";
import {Request} from "../typings/Request"
import parsePhoneNumber from "libphonenumber-js";
import {useNavigate} from "react-router-dom";

const Settings = () => {
    const [userData, setUserData] = useState<Request>();

    useEffect(() => {
        const decoded = jwtDecode(Cookies.get("jwt")  as string) as Request;

        setUserData(decoded)
    }, []);

    const formatPhoneNumber = (phone: string) => {
        return parsePhoneNumber("+" + phone)?.formatInternational()
    }

    const navigate = useNavigate()

    const logout = () => {
        Cookies.remove("jwt");

        navigate("/")
    }

    return (
        userData ? (
            <Layout title={""} context={userData?.fullName} back>
                <ul className={"text-white flex flex-col gap-3"}>
                    <li>Номер телефона: {formatPhoneNumber(userData.phoneNumber)}</li>
                    <li>Электроный почта: {userData.email}</li>
                    <li>Компания: {userData.company}</li>
                    <li>Страна: {userData.country}</li>
                </ul>
                <button onClick={logout} className={"bg-red-500 p-3 px-5 text-white mt-5 w-full rounded-2xl"}>Выйти</button>

            </Layout>
        ) : <></>
    )
}

export default Settings;    