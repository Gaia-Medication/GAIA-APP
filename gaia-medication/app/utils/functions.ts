export const formatHour = (hour) => {
    if (hour instanceof Date) {
        const hours = hour.getHours();
        const minutes = hour.getMinutes();
        const formattedTime = `${hours.toString()}:${minutes
            .toString()
            .padStart(2, "0")}`;
        return formattedTime;
    }
    return "";
};