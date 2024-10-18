const randomString = async (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

const removeNullUndefined = (obj) => {
  for (let prop in obj) {
    if (obj[prop] === null || obj[prop] === undefined) {
      delete obj[prop];
    }
  }
  return obj;
};

const generateOTP = async () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const codeLength = 8;
  let code = "";

  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
};

const dateFormatter = (timestamp) => {
  const date = new Date(timestamp);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  let formattedDate;
  if (day < 10 && month < 10) {
    formattedDate = `0${day}/0${month}/${year}`;
  } else if (day < 10) {
    formattedDate = `0${day}/${month}/${year}`;
  } else if (month < 10) {
    formattedDate = `${day}/0${month}/${year}`;
  } else {
    formattedDate = `${day}/${month}/${year}`;
  }

  return formattedDate;
};


const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear().toString().slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0'); 

  return `${year}-${month}-${day}`;
};

//currencyFormatter
const currencyFormatter = (currency) => {
  if (currency === undefined) {
    currency = 0;
  }
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const formattedPrice = formatter.format(currency);
  return formattedPrice;
};

const titleCase = (string) => {
  const temp = string.trim().split(" ");
  const result = temp.map((ele) => {
    return ele.charAt(0).toUpperCase() + ele.slice(1).toLowerCase();
  });
  return result.join(" ");
};

const couponCodeGenerator = async () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const codeLength = 5;
  let code = "";

  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    code += characters.charAt(randomIndex);
  }
  return code;
};

module.exports = {
  removeNullUndefined,
  randomString,
  generateOTP,
  dateFormatter,
  currencyFormatter,
  titleCase,
  couponCodeGenerator,
  formatDate,
};
