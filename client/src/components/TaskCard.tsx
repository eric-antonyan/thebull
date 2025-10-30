import {FaRegClock} from "react-icons/fa6";
import React, {FC} from "react";
import {getStatus} from "../handles";
import {Taskable} from "../typings";
import {format} from  "timeago.js"
import TimeData from "./TimeData";
import {Link} from "react-router-dom";

interface ITaskCard {
    task: Taskable
}

const TaskCard: FC<ITaskCard> = ({ task }) => (
    <Link to={`/tasks/${task._id}`} className={`relative bg-gray-800 cursor-pointer p-4 flex flex-col rounded-3xl w-full overflow-hidden shadow-lg transition-transform transform`}>
        <h3 className="font-bold text-white text-lg">{task.title}</h3>
        <p className="text-slate-400">{task.description.slice(0, 100)}</p>
        <div className="bg-[#DCDFEA] h-[0.6px] my-[14px]"></div>
        <div className="flex justify-between">
            <div className="flex items-center gap-2">
                <FaRegClock className="text-[#7D89B0]" />
                <TimeData date={task.updatedAt} />
            </div>
            <div className={`${task.priority === "0" ? "bg-red-500/20 text-red-400" : task.priority === "1" ? "bg-yellow-500/20 text-yellow-400" : task.priority === "2" ? "bg-green-500/20 text-green-400" : ""} rounded-full px-[12px] py-[8px]`}>
                <span>{getStatus(task.priority)}</span>
            </div>
        </div>
    </Link>
);

export default TaskCard;