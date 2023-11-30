export default class ObjectValueExtractor {
    constructor(obj, serializedKeys) {
        this.obj = obj;
        this.serializedKeys = serializedKeys;
    }

    #getValueFromNestedObject(...path) {
        /**
         * returns a value from the object based on the specified path
         * 
         * @param path - a path to the value.
         */

        // current value
        let current = this.obj;
        // iterate over each key in path
        for (let key of path) {
            // if there's no key in the current value, then return undefined
            if (current[key] === undefined) {
                return undefined;
            }
            
            // Assign a new current value
            current = current[key];
        }

        // Return a final value
        return current;
    }

    #getValueFromSerializedKey(...path) {
        /**
         * returns a value from the object with the serialized keys based on the specified path
         * 
         * @param path - a path to the value.
         */

        // if length of the path is 0, then return undefined
        if (path.length === 0) return undefined;

        // create a string with dot notation from the path 
        let serializedKey = path.join(".");

        // get access to the value by the serialized key
        let value = this.obj?.[serializedKey];

        return value;
    }

    #isValueExistNestedObject(...path) {
        /**
         * returns true if the object at this path has a value.
         * Use this method if serializedKeys is false.
         * @param path - a path to the value.
         */
        // current value
        let current = this.obj;
        // iterate over each key in path
        for (let key of path) {
            // if there's no key in the current value, then return undefined
            if (current[key] === undefined) {
                return false;
            }
            
            // Assign a new current value
            current = current[key];
        }

        // Return a final value
        return true;
    }

    #isValueExistSerializedKeys(...path) {
        /**
         * returns true if the object at this path has a value.
         * Use this method if serializedKeys is true.
         * @param path - a path to the value.
         */
         // if length of the path is 0, then return undefined
        if (path.length === 0) return false;

        // create a string with dot notation from the path 
        let serializedKey = path.join(".");

        // get access to the value by the serialized key
        let value = this.obj?.[serializedKey];

        if (!value) {
            return false
        }

        return true


    }
    getObjectValue(...path) {
        let result;
        if (this.serializedKeys) {
            result = this.#getValueFromSerializedKey(...path);
        } else {
            result = this.#getValueFromNestedObject(...path);
        }

        return result;
    }

    isValueExist(...path) {
        if (this.serializedKeys) {
            return this.#isValueExistSerializedKeys(...path);
        } else {
            return this.#getValueFromNestedObject(...path)
        }
    }
}