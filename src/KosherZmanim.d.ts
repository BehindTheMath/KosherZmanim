declare interface Date {
    compareTo(this: Date, date: Date): number;
    after(this: Date, date: Date): boolean;
    before(this: Date, date: Date): boolean;
    equals(this: Date, date: Date): boolean;
}

declare interface Math {
    toRadians(angdeg: number): number;
    toDegrees(angrad: number): number;
}

declare interface String {
    replaceAll(this: string, searchString: string, replaceString: string): string;
    compareTo(this: string, compareToString: string): number;
}

declare interface JsonOutput {
    [key: string]: JsonOutputMetadata | object;
}

declare interface JsonOutputMetadata {
    date: string;
    type: string;
    algorithm: string;
    location: string;
    latitude: number;
    longitude: number;
    elevation: number;
    timeZoneName: string;
    timeZoneID: string;
    timeZoneOffset: number;
}
