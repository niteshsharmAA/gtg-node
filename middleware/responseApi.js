/**
 * @desc    This file contain Success and Error response for sending to client / user
 * @author  Vigneshprabu
 * @since   2022
 */

/**
 * @desc    Send any success response
 *
 * @param   {string} message
 * @param   {string} supportMessage
 * @param   {object | array} data
 * @param   {number} statusCode
 */
 exports.success = (message, data, statusCode) => {
    return {
      statusCode: statusCode,
      statusMessage:message,
      supportMessage:message,
      data
    };
  };
  
  /**
   * @desc    Send any error response
   *
   * @param   {string} statusMessage
   * @param   {number} statusCode
   */
  exports.error = (statusMessage, statusCode) => {
    // List of common HTTP request code
    const codes = [200, 201, 400, 401, 404, 403, 422, 500];
  
    // Get matched code
    const findCode = codes.find((code) => code == statusCode);
  
    if (!findCode) statusCode = 500;
    else statusCode = findCode;
  
    return {
      statusMessage,
      statusCode: statusCode
    };
  };
  
  /**
   * @desc    Send any validation response
   *
   * @param   {object | array} errors
   */
  exports.validation = (errors) => {
    return {
      message: "Validation errors",
      error: true,
      code: 422,
      errors
    };
  };