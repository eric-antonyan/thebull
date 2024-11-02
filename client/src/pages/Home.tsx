import React from "react";
import { FaRegClock } from "react-icons/fa6";
import { BsGear, BsSearch } from "react-icons/bs";

const TaskCard = ({ title, description, priority }: { title: string, description: string, priority: string }) => (
    <div className={`relative bg-gray-800 p-4 flex flex-col rounded-3xl w-full overflow-hidden shadow-lg transition-transform transform hover:scale-105`}>
        <h3 className="font-bold text-white text-lg">{title}</h3>
        <p className="text-slate-400">Your team has used 80% of your available space. Need more?</p>
        <div className="bg-[#DCDFEA] h-[0.6px] my-[14px]"></div>
        <div className="flex justify-between">
            <div className="flex items-center gap-2">
                <FaRegClock className="text-[#7D89B0]" />
                <span className="text-white">08:30 AM, 22 May 2022</span>
            </div>
            <div className="bg-green-500/20 text-green-400 rounded-full px-[12px] py-[8px]">
                <span>{priority}</span>
            </div>
        </div>
    </div>
);

const Home = () => {
    const tasks = [
        { title: "NFT Web App Prototype", description: "выбил щиток автомата в электрическом шкафе", priority: "high" },
        { title: "Для электрик", description: "выбил щиток автомата в электрическом шкафе", priority: "high" },
    ];

    return (
        <div className="max-w-[450px] w-full bg-gray-900 h-screen">
            <header className="text-white p-5 flex justify-between border-b border-gray-700">
                <div className="flex items-center gap-3">
                    <FaRegClock size={24} />
                    <span className="font-bold text-2xl">Черновики</span>
                </div>
                <div className="flex items-center gap-4">
                    <BsSearch size={24} />
                    <BsGear size={24} />
                </div>
            </header>
            <div className="p-5">
                <h1 className="text-white text-4xl font-bold">Задачи</h1>
            </div>
            <div className="grid p-5 gap-5">
                {tasks.map((task, index) => (
                    <TaskCard key={index} title={task.title} description={task.description} priority={task.priority} />
                ))}
            </div>
        </div>
    );
};

export default Home;
