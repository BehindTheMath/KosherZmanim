declare interface JsonOutput {
    [key: string]: OutputMetadata | object;
}

declare interface OutputMetadata {
    date: string;
    type: string;
    algorithm: string;
    location: string;
    latitude: string;
    longitude: string;
    elevation: string;
    timeZoneName: string;
    timeZoneID: string;
    timeZoneOffset: string;
}

declare interface Zman {
    zmanLabel?: string;
    zman?: Date;
    duration?: number;
    zmanDescription?: Date;
}

declare interface ZmanimConstructorOptions {
    date: Date | string | number;
    timeZoneId: string;
    locationName: string;
    latitude: number;
    longitude: number;
    elevation?: number;
    complexZmanim?: boolean;
}

declare interface TimezonesJsonItem {
    "value": string;
    "abbr": string;
    "offset": number;
    "isdst": boolean;
    "text": string;
    "utc": Array<string>;
}
