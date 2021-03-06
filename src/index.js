const getVerificationDigit = require('./get-verification-digit');

const RFC_REGEXP = /^([A-ZÑ\x26]{3,4})([0-9]{6})([A-Z0-9]{3})$/;
const INVALID_FORMAT_ERROR = 'INVALID_FORMAT';
const INVALID_DATE_ERROR = 'INVALID_DATE';
const INVALID_VERIFICATION_DIGIT_ERROR = 'INVALID_VERIFICATION_DIGIT';
const RFC_TYPE_FOR_LENGTH = {
  '12': 'company',
  '13': 'person'
};

const parseInput = (input) => {
  return String(input)
    .trim()
    .toUpperCase()
    .replace(/[^0-9A-ZÑ\x26]/g, '');
};

const validateDate = (rfc) => {
  const dateStr = rfc.slice(0, -3).slice(-6);
  const year = dateStr.slice(0, 2);
  const month = dateStr.slice(2, 4);
  const day = dateStr.slice(4, 6);
  const date = new Date(`20${year}-${month}-${day}`);
  return !isNaN(date.getTime());
};

const validateVerificationDigit = (rfc) => {
  const expected = rfc.slice(-1);
  const digit = getVerificationDigit(rfc);
  return expected === digit;
};

const validate = (rfc) => {
  const errors = [];
  const hasValidFormat = RFC_REGEXP.test(rfc);
  const hasValidDate = hasValidFormat ? validateDate(rfc) : true;
  const hasValidDigit = hasValidFormat ? validateVerificationDigit(rfc) : true;
  if (!hasValidFormat) errors.push(INVALID_FORMAT_ERROR);
  if (!hasValidDate) errors.push(INVALID_DATE_ERROR);
  if (!hasValidDigit) errors.push(INVALID_VERIFICATION_DIGIT_ERROR);
  return errors;
};

const getType = (rfc) => RFC_TYPE_FOR_LENGTH[rfc.length] || null;

const getValidResponse = (rfc) => ({
  isValid: true,
  rfc,
  type: getType(rfc)
});

const getInvalidResponse = (errors) => ({
  isValid: false,
  rfc: null,
  type: null,
  errors
});

module.exports = (input) => {
  const rfc = parseInput(input);
  const errors = validate(rfc);
  const isValid = errors.length === 0;

  return isValid ? getValidResponse(rfc) : getInvalidResponse(errors);
};
