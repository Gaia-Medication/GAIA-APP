export const formatHour = (hour: Date) => {
    const hours = hour.getHours();
    const minutes = hour.getMinutes();
    const formattedTime = `${hours.toString()}:${minutes
        .toString()
        .padStart(2, "0")}`;
    return formattedTime;
}

export const formatDate = (format: string, date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const monthName = date.toLocaleString('default', { month: 'short' });

    // Sun Jan 05 2025 02:48:56 GMT+0100
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    let formattedDate = format;

    // Replace date tokens
    formattedDate = formattedDate.replace('dd', day);
    formattedDate = formattedDate.replace('yyyy', year.toString());
    formattedDate = formattedDate.replace('mon', monthName);

    // Replace time tokens
    formattedDate = formattedDate.replace('hh', hours);
    formattedDate = formattedDate.replace('mm', minutes);

    return formattedDate;
};