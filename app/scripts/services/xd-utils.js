/**
 * Created by Ofir_Dagan on 4/17/14.
 */
'use strict';
function extend(object, defaultObject) {
  var result = defaultObject || {};
  var key;
  for (key in object) {
    if (object.hasOwnProperty(key)) {
      result[key] = object[key];
    }
  }
  return result;
}

export default { 
  extend: extend
}
