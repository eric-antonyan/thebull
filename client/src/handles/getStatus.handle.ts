export const getStatus = (status: string) => {
    switch (status) {
        case "0":
            return "низкая";
            break;
        case "1":
            return "средная";
            break;
        case "2":
            return "высокая";
            break;
    }
}