// converts date string yyyy-mm-dd to Date data
function YYYYMMDDtoDate(date) {
  const sendDate =
    date.getFullYear() +
    "-" +
    (date.getMonth() + 1) +
    "-" +
    ("0" + date.getDate()).slice(-2) +
    "T" +
    ("0" + date.getHours()).slice(-2) +
    ":" +
    ("0" + date.getMinutes()).slice(-2) +
    ":" +
    ("0" + date.getSeconds()).slice(-2) +
    ".000+08:00";

  console.log(sendDate);

  return sendDate;
}

module.exports = YYYYMMDDtoDate;
