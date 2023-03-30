let isValidBirthday = (birthday) => {
    //Get current date
    const currentDate = new Date().toJSON().slice(0, 10);
    const currentDate_milsec = Date.parse(currentDate);
    const birthday_milsec = Date.parse(birthday);
    return birthday_milsec >= currentDate_milsec ? false : true;
};

let isValidEmail = (email) => {
    const email_regular_expression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return email_regular_expression.test(email);
};

let isValidPhoneNumber = (phone) => {
    //regex vietnamese phone-number (Not include +84)
    const phone_regular_expression = /(03|05|07|08|09|01[2|6|8|9])+([0-9]{8})\b/;
    return phone_regular_expression.test(phone);
};

let isValidPassword = (password) => {
    //Password must be from 8 to 15 charaters. only characters, numeric digits, underscore and first character must be a letter
    const password_regular_expression =  /^[A-Za-z]\w{5,19}$/;
    return password_regular_expression.test(password);
};

let isEmpty = (input) => {
    return input != '' ? false : true;
};

let isTheSameValue = (optionA, optionB) => {
    return optionA == optionB ? true : false;
};

let xport = {
    isValidBirthday: isValidBirthday,
    isValidEmail: isValidEmail,
    isValidPassword: isValidPassword,
    isValidPhoneNumber: isValidPhoneNumber,
    isEmpty: isEmpty,
    isTheSameValue: isTheSameValue
};

export default xport;