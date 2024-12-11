export const formatHour = (hour: Date) => {
    const hours = hour.getHours();
    const minutes = hour.getMinutes();
    const formattedTime = `${hours.toString()}:${minutes
        .toString()
        .padStart(2, "0")}`;
    return formattedTime;
}

export const formatDate = (format: string, date: Date) => {
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits for day
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits for month (0-11, hence +1)
    const year = date.getFullYear();
    const monthName = date.toLocaleString('default', { month: 'short' }); // Get short month name (e.g., "Jan")
  
    let formattedDate = format;

    formattedDate = formattedDate.replace('dd', day);
    formattedDate = formattedDate.replace('mm', month);
    formattedDate = formattedDate.replace('yyyy', year.toString());
    formattedDate = formattedDate.replace('mon', monthName);
    
    return formattedDate;
};