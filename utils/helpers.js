module.exports = {
    format_date: date => {
        // use methods built into the Date object to format the date
        return `${new Date(date).getMonth() + 1}/${new Date(date).getDate()}/${new Date(
            date
        ).getFullYear()}`;
    }
}