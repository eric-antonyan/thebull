import React, { useEffect, useState } from "react";
import { FaPlus, FaRegClock } from "react-icons/fa6";
import { BsGear, BsSearch } from "react-icons/bs";
import { Taskable } from "../typings";
import { api } from "../api";
import TaskCard from "../components/TaskCard";
import Ripple from "../components/Ripple/Ripple";
import Header from "../components/Header";
import Layout from "../Layout";
import { Link } from "react-router-dom";

const Home = () => {
    const [tasks, setTasks] = useState<Taskable[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await api.get("/tasks");

            return setTasks(response.data)
        }

        fetchData()
    }, []);

    return (
        <Layout title={"Черовники"} context={"Задачи"}>
            <div className="grid gap-5">
                {
                    tasks.length > 0 ? (
                        tasks.map((task, index) => (
                            <Ripple className={"rounded-3xl"}>
                                <TaskCard key={index} task={task} />
                            </Ripple>
                        ))
                    ) : (
                        <p className={"text-white"}>Задачи пусто, <Link className={"underline"} to={"/tasks/new"}>Добавить новый</Link></p>
                    )
                }
            </div>
        </Layout>
    );
};

export default Home;