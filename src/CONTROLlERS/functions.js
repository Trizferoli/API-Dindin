//checks if all fields in the array argument are filled.
//recieves  an array of objects.
//if any field is blank, returns an object with error message and isValid = false.
//if all fields are filled returns an object with isValid = true.

const hasRequiredFields = (array) => {
    let isValid = true;
    for (let item of array) {
        let variableName = Object.keys(item)[0];
        let message = '';
        if (Object.values(item)[0] == undefined) {
            isValid = false;
            message = `O campo ${variableName} precisa ser preenchido.`
            return { isValid, message }
        }
    }
    return { isValid };
}
module.exports = hasRequiredFields