import React, {useEffect, useState} from "react";
import Layout from "../Layout";
import {api} from "../api";
import {Request} from "../typings/Request"
import parsePhoneNumber from "libphonenumber-js";
import {FaRepeat} from "react-icons/fa6";
import {jwtDecode} from "jwt-decode";
import Cookies from "js-cookie";
import {useNavigate} from "react-router-dom";

const ResponsiveTable = () => {
    const [requests, setRequests] = useState<Request[]>([]);
    const [userData, setUserData] = useState<Request>()

    const fetchData =  async () => {
        try {
            const response = await api.get("/requests");

            setRequests(response.data)
        } catch (e) {
            console.log(e)
        }
    }

    const navigate = useNavigate()

    useEffect(() => {
        try {
            const decypted: Request = jwtDecode(Cookies.get("jwt") as string)

            if (decypted.phoneNumber === "79999999999") {
                fetchData()
                return setUserData(decypted);
            }

            navigate("/tasks")
        } catch(e) {
            navigate("/tasks")
        }

    }, []);

    const handleAccept = async (id: string | undefined) => {
        await api.put(`/requests/${id}/accept`);
        await fetchData()
    }

    const handleRefuse = async (id: string | undefined) => {
        await api.put(`/requests/${id}/refuse`);
        await fetchData()
    }

    const formatPhoneNumber = (phone: string) => {
        return parsePhoneNumber("+" + phone)?.formatInternational()
    }
    return (
        <Layout title={""} context={"Запросы"} back>
            <div className={"flex justify-end"}>
                <button onClick={fetchData} className={"text-white p-3 text-2xl rounded-full ml-auto bg-black"}>
                    <FaRepeat/>
                </button>
            </div>
            <div className={"w-full overflow-x-auto rounded-3xl overflow-hidden"}>
                {
                    requests.length > 0 ? (
                        <table className="max-w-full overflow-x-auto bg-black border-gray-200 rounded-lg shadow-md">
                            <thead className="bg-gray-900 border-b">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                                    ID
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                                    ФИО
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                                    Эл. адрес
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                                    Компания
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                                    Номер телефона
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                                    Страна
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-300">
                                    Адрес
                                </th>
                                <th className={"px-6 py-3 text-left text-sm font-semibold text-gray-300 flex gap-3"}>
                                    Действие
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {requests.map((request, index) => (
                                <tr
                                    key={request._id}
                                    className={`${
                                        index % 2 === 0 ? "bg-gray-800" : "bg-black"
                                    } hover:bg-gray-700 transition duration-150`}
                                >
                                    <td className="px-6 py-2 text-gray-300 text-nowrap">{index + 1}</td>
                                    <td className="px-6 py-2 text-gray-300 text-nowrap">{request.fullName}</td>
                                    <td className="px-6 py-2 text-gray-300 text-nowrap">{request.email}</td>
                                    <td className="px-6 py-2 text-gray-300 text-nowrap">{request.company}</td>
                                    <td className="px-6 py-2 text-gray-300 text-nowrap"><a href={`tel:${formatPhoneNumber(request.phoneNumber)}`}>{formatPhoneNumber(request.phoneNumber)}</a></td>
                                    <td className="px-6 py-2 text-gray-300 text-nowrap">{request.country}</td>
                                    <td className="px-6 py-2 text-gray-300 text-nowrap">{request.address}</td>
                                    <td className={`flex gap-3 px-6 py-2 text-gray-300`}>
                                        {
                                            !request.accepted ? (
                                                <>

                                                    <button onClick={() => handleAccept(request._id)}
                                                            className={"bg-green-500 p-3 rounded-2xl text-white"}>Принять</button>
                                                    <button onClick={() => handleRefuse(request._id)}
                                                            className={"bg-red-500 text-nowrap p-3 rounded-2xl text-white"}>Не
                                                        принять
                                                    </button>
                                                </>
                                            ) : (
                                                <button onClick={() => handleRefuse(request._id)}
                                                    className={"bg-red-500 text-nowrap p-3 rounded-2xl text-white"}>Не принять
                                                </button>
                                            )
                                    }
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    ) : (
                        <span className={"text-white"}>Подаждите пожалуйста</span>
                    )
                }
            </div>
        </Layout>
    );
};

export default ResponsiveTable;
