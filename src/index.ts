import _ from 'lodash';

export  function flattenObject<T>(obj: T, parentKey = '', result: Record<string, any> = {}) {
    _.forOwn(obj, (value, key) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
  
      if (_.isObject(value) && !Array.isArray(value)) {
        flattenObject(value, newKey, result);
      } else {
        result[newKey] = value;
      }
    });
  
    return result;
  }
  