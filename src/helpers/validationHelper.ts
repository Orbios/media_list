import {isEmpty} from 'lodash';

export default {
  isEmptyErrorObject,
  isValidISBNCode
};

function isEmptyErrorObject(obj) {
  let isEmptyObject = true;

  for (const key of Object.keys(obj)) {
    const value = obj[key];

    if (!isEmpty(value)) {
      isEmptyObject = false;
      break;
    }
  }

  return isEmptyObject;
}

function isValidISBNCode(str: string) {
  // Regex to check valid ISBN CODE
  const regex = new RegExp(/^(?=(?:[^0-9]*[0-9]){10}(?:(?:[^0-9]*[0-9]){3})?$)[\d-]+$/);

  // if str is empty return false
  if (str == null) return false;

  // Return true if the str matched the ReGex
  if (regex.test(str)) return true;

  return false;
}
