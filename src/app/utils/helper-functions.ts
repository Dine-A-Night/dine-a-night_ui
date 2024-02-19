export function isDefNotNull(value: any) {
    return value !== null && value !== undefined;
}

interface ObjectWithId {
    _id: string;
}

export function idsToObjects<T extends ObjectWithId>(
    ids: string[],
    originalList: T[],
): T[] {
    return ids.map((id) => originalList.find((item) => item._id === id) as T);
}

export function deepEqual(obj1, obj2) {
    // If both values are strictly equal, return true
    if (obj1 === obj2) {
        return true;
    }

    // Check if both values are objects and not null
    if (
        typeof obj1 === 'object' &&
        obj1 !== null &&
        typeof obj2 === 'object' &&
        obj2 !== null
    ) {
        // Get the keys of the objects
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);

        // Check if the number of keys is the same
        if (keys1.length !== keys2.length) {
            return false;
        }

        // Check each key recursively
        for (let key of keys1) {
            // If the key is not present in obj2 or the values are not deep equal, return false
            if (!obj2.hasOwnProperty(key) || !deepEqual(obj1[key], obj2[key])) {
                return false;
            }
        }

        // All keys are deep equal
        return true;
    }

    // Values are not objects or not deep equal
    return false;
}
