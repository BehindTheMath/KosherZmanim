// https://stackoverflow.com/a/40577337/8037425
export default class Utils {
    public static getAllMethodNames(obj: object, excludeContructors: boolean = false): Array<string> {
        // let methods: Array<string> = [];
        let methods: Set<string> = new Set();

        while (obj = Reflect.getPrototypeOf(obj)) {
            let keys: Array<string> = Reflect.ownKeys(obj) as Array<string>;
            // methods = methods.concat(keys);
            keys.filter((key: string) => !methods.has(key))
                .filter((key: string) => !excludeContructors || key !== "constructor")
                .forEach((key: string) => methods.add(key));
        }

        return Array.from(methods);
    };
}
