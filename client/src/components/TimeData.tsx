import {formatDistanceToNow} from "date-fns";
import {ru} from "date-fns/locale";

const TimeData = ({date}: {date: string}) => {
    const timeAgo = formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: ru, // Устанавливаем локализацию на русский
    });

    return (
        <span className={"text-white"}>{timeAgo}</span>
    )
}

export default TimeData;