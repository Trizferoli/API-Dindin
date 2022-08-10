//DEPRECATED

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