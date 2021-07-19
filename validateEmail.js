function validateEmail(input) {

    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (input.match(validRegex)) {
        console.log("Valid email address!");
        return true;

    } else {
        console.log("Invalid email address!");
        return false;
    }
}

//console.log(validateEmail("helloteddywilson.me"))

const email = "hello@teddywilson.me"

return validateEmail(email)