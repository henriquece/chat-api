const valueTypes = require("../constants/valueTypes");

const validateEmail = (email) => {
  const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  
  return regex.test(email)
}

const validateType = (value, valueType) => {
  switch (valueType) {
    case valueTypes.email:
      return validateEmail(value)
    default:
      return value
  }
}

const validate = (value, valueType) => {
  const isValid = validateType(value, valueType)

  return new Promise((resolve, reject) => {
    if (isValid) {
      return resolve(true)
    }
    
    const error = new Error(`${valueType} not valid`)
    error.status = 401

    return reject(error)
  })
}

module.exports = validate