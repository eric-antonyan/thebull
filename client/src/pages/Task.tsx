import {Link, useNavigate, useParams} from "react-router-dom";
import Layout from "../Layout";
import { useEffect, useState } from "react";
import { Taskable } from "../typings";
import axios from "axios";
import { api } from "../api";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {FaEdit} from "react-icons/fa";
import Cookies from "js-cookie";
import {jwtDecode} from "jwt-decode";
import {Request} from "../typings/Request";
import YandexMapByAddress from "../components/YandexMapByAddress";
import parsePhoneNumber from "libphonenumber-js";

const Task = () => {
    const { taskId } = useParams();
    const [task, setTask] = useState<Taskable | null>(null);
    const navigate = useNavigate()
    const [auth, setAuth] = useState<Request>()
    const [user, setUser] = useState<Request>()

    useEffect(() => {
        const token = Cookies.get("jwt");

        if (!token) {
            navigate("/")
            return
        };

        const decrypedData = jwtDecode(token) as Request
        setAuth(decrypedData)

    }, [auth]);

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await api.get(`/tasks/${taskId}`);
                setTask(response.data);
            } catch (error) {
                navigate("/tasks")
            }

        };

        fetchTask();
    }, [taskId]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await api.get(`/users/${task?.owner}`);
                setUser(response.data);
            } catch (error) {
                navigate("/tasks")
            }
        }

        if (task) {
            fetchUser()
        }
    }, [task]);

    const handleDelete = async () => {
        await api.delete(`/tasks/${taskId}`)
        navigate("/tasks")
    }

    const formatPhoneNumber = (phone: string) => {
        return parsePhoneNumber("+" + phone)?.formatInternational()
    }

    return (
        task && (
            <Layout back title={task.title} context={task.title}>
                <p className={"text-white mb-4"}>Содатель <span className={"font-bold"}>{user?.fullName}</span></p>
                {
                    auth?._id === task?.owner && (
                        <div className={"text-white p-5 bg-gray-900  flex justify-end gap-5"}>
                            <Link to={`/tasks/${task._id}/update`}>Редактировать</Link>
                            <Link to={``} onClick={handleDelete} className={"text-red-500"}>Удалить</Link>
                        </div>
                    )
                }
                <div className="text-white rounded-t-2xl overflow-hidden">
                    {task.images.length > 0 && (
                        <Swiper
                            spaceBetween={10}
                            slidesPerView={1}
                            className={"rounded-2xl overflow-hidden---------------------------"}
                            pagination={{ clickable: false }}
                        >
                            {task.images.map((image, i) => (
                                <SwiperSlide key={i}>
                                    <img
                                        className="w-full aspect-square object-cover rounded-2xl"
                                        src={`http://${window.location.hostname}:8000/api/uploads/${image}`}
                                        alt={`Task image ${i + 1}`}
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                    <p className={"mt-6"}>{task.description}</p>
                </div>
                {
                    user && (
                        <YandexMapByAddress address={user.address} />
                    )
                }
                {
                    user && (
                        <div className="bg-gray-800 text-white py-6 mt-6 p-4 rounded-3xl">
                            <div className="container mx-auto text-start">
                                <h3 className="text-3xl font-extrabold mb-4">О нас</h3>
                                <ul className="flex flex-col gap-4 text-lg">
                                    <a href={`tel:${formatPhoneNumber(user.phoneNumber)}`}>
                                        <li className="hover:text-gray-400 transition-colors duration-300">
                                            Номер телефона: <span
                                            className="font-semibold">{formatPhoneNumber(user.phoneNumber)}</span>
                                        </li>
                                    </a>
                                    <a href={`mail:${user.email}`}>
                                        <li className="hover:text-gray-400 transition-colors duration-300">
                                            Электронная почта: <span className="font-semibold">{user.email}</span>
                                        </li>
                                    </a>
                                    <li className="hover:text-gray-400 transition-colors duration-300">
                                        Компания: <span className="font-semibold">{user.company}</span>
                                    </li>
                                    <li className="hover:text-gray-400 transition-colors duration-300">
                                        Страна: <span className="font-semibold">{user.country}</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="text-center text-sm mt-6">
                                <p>© {new Date().getFullYear()} Все права защищены</p>
                            </div>
                        </div>

                    )
                }

            </Layout>
        )
    );
};

export default Task;
