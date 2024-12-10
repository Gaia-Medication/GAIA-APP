export const formatHour = (hour: Date) => {
    const hours = hour.getHours();
    const minutes = hour.getMinutes();
    const formattedTime = `${hours.toString()}:${minutes
        .toString()
        .padStart(2, "0")}`;
    return formattedTime;
}

export const formatDate = (date: Date) => {
    return date.toLocaleDateString();
};