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
import { useTasks } from "../hooks/useTasks";

const Home = () => {
  const { tasksQuery } = useTasks();
  if (tasksQuery.isLoading) return <p>loading...</p>;
  if (tasksQuery.error) return <p>error</p>;

  const tasks = tasksQuery.data ?? [];

  return (
    <Layout title={"Черновики"} context={"Лента задач"}>
      <div className="grid gap-5">
        {tasks.length > 0 ? (
          [...tasks].reverse().map((task) => (
            <Ripple key={task._id} className={"rounded-3xl"}>
              <TaskCard task={task} />
            </Ripple>
          ))
        ) : (
          <p className={"text-white"}>
            Задачи пусто,{" "}
            <Link className={"underline"} to={"/tasks/new"}>
              Добавить новую
            </Link>
          </p>
        )}
      </div>
    </Layout>
  );
};

export default Home;
