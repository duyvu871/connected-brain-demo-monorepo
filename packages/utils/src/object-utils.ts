type AnyObject = Record<any, any>;

export function extractProperties<T extends AnyObject>(originalObject: T, propertiesToExtract: (keyof T)[]): Pick<T, (keyof T)> {
    const extractedObject: Pick<T, keyof T> = {} as Pick<T, keyof T>;

    propertiesToExtract.forEach(property => {
        if (originalObject.hasOwnProperty(property)) {
            extractedObject[property] = originalObject[property];
        }
    });

    return extractedObject;
}
