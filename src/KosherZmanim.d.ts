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
    [key: string]: AstronomicalTimes | BasicZmanim | Zmanim | JsonOutputMetadata;
}

declare interface JsonOutputMetadata {
    "date": string;
    "type": string;
    "algorithm": string;
    "location": string;
    "latitude": number;
    "longitude": number;
    "elevation": number;
    "timeZoneName": string;
    "timeZoneID": string;
    "timeZoneOffset": number;
}

declare interface AstronomicalTimes {
    "BeginCivilTwilight"?: string;
    "Sunrise"?: string;
    "SeaLevelSunrise"?: string;
    "SunTransit"?: string;
    "Sunset"?: string;
    "SeaLevelSunset"?: string;
    "EndCivilTwilight"?: string;
    "BeginAstronomicalTwilight"?: string;
    "BeginNauticalTwilight"?: string;
    "EndNauticalTwilight"?: string;
    "EndAstronomicalTwilight"?: string;
    "TemporalHour"?: number;
}

declare interface BasicZmanim extends AstronomicalTimes {
    "Alos72"?: string;
    "SofZmanShmaMGA"?: string;
    "SofZmanShmaGRA"?: string;
    "SofZmanTfilaMGA"?: string;
    "SofZmanTfilaGRA"?: string;
    "Chatzos"?: string;
    "MinchaGedola"?: string;
    "MinchaKetana"?: string;
    "PlagHamincha"?: string;
    "CandleLighting"?: string;
    "Tzais72"?: string;
    "AlosHashachar"?: string;
    "Tzais"?: string;
    "ShaahZmanisGra"?: number;
    "ShaahZmanisMGA"?: number;
}

declare interface Zmanim extends BasicZmanim {
    "Alos120Zmanis"?: string;
    "Alos120"?: string;
    "Alos96Zmanis"?: string;
    "Alos96"?: string;
    "Alos90Zmanis"?: string;
    "Alos90"?: string;
    "Alos72Zmanis"?: string;
    "Alos60"?: string;
    "SofZmanShmaMGA120Minutes"?: string;
    "SofZmanShmaMGA96MinutesZmanis"?: string;
    "SofZmanShmaMGA96Minutes"?: string;
    "SofZmanShmaMGA90MinutesZmanis"?: string;
    "SofZmanShmaAteretTorah"?: string;
    "SofZmanShmaMGA90Minutes"?: string;
    "SofZmanShmaMGA72MinutesZmanis"?: string;
    "SofZmanShmaMGA72Minutes"?: string;
    "SofZmanShmaKolEliyahu"?: string;
    "SofZmanShma3HoursBeforeChatzos"?: string;
    "SofZmanShmaFixedLocal"?: string;
    "SofZmanTfilaMGA120Minutes"?: string;
    "SofZmanTfilahAteretTorah"?: string;
    "SofZmanTfilaMGA96MinutesZmanis"?: string;
    "SofZmanTfilaMGA96Minutes"?: string;
    "SofZmanTfilaMGA90MinutesZmanis"?: string;
    "SofZmanTfilaMGA90Minutes"?: string;
    "SofZmanTfilaMGA72MinutesZmanis"?: string;
    "SofZmanAchilasChametzMGA72Minutes"?: string;
    "SofZmanTfilaMGA72Minutes"?: string;
    "SofZmanAchilasChametzGRA"?: string;
    "SofZmanTfila2HoursBeforeChatzos"?: string;
    "SofZmanTfilaFixedLocal"?: string;
    "SofZmanBiurChametzMGA72Minutes"?: string;
    "SofZmanBiurChametzGRA"?: string;
    "FixedLocalChatzos"?: string;
    "BainHasmashosRT2Stars"?: string;
    "MinchaGedolaAteretTorah"?: string;
    "MinchaGedola30Minutes"?: string;
    "MinchaGedolaGreaterThan30"?: string;
    "MinchaGedola72Minutes"?: string;
    "MinchaKetanaAteretTorah"?: string;
    "MinchaKetana72Minutes"?: string;
    "PlagHaminchaAteretTorah"?: string;
    "PlagHamincha60Minutes"?: string;
    "PlagHamincha72Minutes"?: string;
    "PlagHamincha72MinutesZmanis"?: string;
    "PlagHamincha90Minutes"?: string;
    "PlagHamincha90MinutesZmanis"?: string;
    "PlagHamincha96Minutes"?: string;
    "PlagHamincha96MinutesZmanis"?: string;
    "PlagHamincha120Minutes"?: string;
    "TzaisGeonim3Point65Degrees"?: string;
    "TzaisGeonim3Point676Degrees"?: string;
    "PlagHamincha120MinutesZmanis"?: string;
    "TzaisGeonim4Point37Degrees"?: string;
    "TzaisGeonim4Point61Degrees"?: string;
    "TzaisGeonim4Point8Degrees"?: string;
    "TzaisGeonim5Point88Degrees"?: string;
    "TzaisGeonim5Point95Degrees"?: string;
    "TzaisAteretTorah"?: string;
    "BainHasmashosRT58Point5Minutes"?: string;
    "Tzais60"?: string;
    "PlagAlosToSunset"?: string;
    "Tzais72Zmanis"?: string;
    "Tzais90"?: string;
    "Tzais90Zmanis"?: string;
    "Tzais96"?: string;
    "Tzais96Zmanis"?: string;
    "Tzais120"?: string;
    "Tzais120Zmanis"?: string;
    "SolarMidnight"?: string;
    "SofZmanShmaAlos16Point1ToSunset"?: string;
    "Alos26Degrees"?: string;
    "Alos19Point8Degrees"?: string;
    "Alos18Degrees"?: string;
    "Alos16Point1Degrees"?: string;
    "Misheyakir11Point5Degrees"?: string;
    "Misheyakir11Degrees"?: string;
    "Misheyakir10Point2Degrees"?: string;
    "SofZmanShmaAlos16Point1ToTzaisGeonim7Point083Degrees"?: string;
    "SofZmanShmaMGA19Point8Degrees"?: string;
    "SofZmanShmaMGA18Degrees"?: string;
    "SofZmanShmaMGA16Point1Degrees"?: string;
    "SofZmanTfilaMGA19Point8Degrees"?: string;
    "SofZmanTfilaMGA18Degrees"?: string;
    "SofZmanAchilasChametzMGA16Point1Degrees"?: string;
    "SofZmanTfilaMGA16Point1Degrees"?: string;
    "SofZmanBiurChametzMGA16Point1Degrees"?: string;
    "MinchaGedola16Point1Degrees"?: string;
    "MinchaKetana16Point1Degrees"?: string;
    "PlagAlos16Point1ToTzaisGeonim7Point083Degrees"?: string;
    "PlagHamincha16Point1Degrees"?: string;
    "PlagHamincha18Degrees"?: string;
    "PlagHamincha19Point8Degrees"?: string;
    "BainHasmashosRT13Point5MinutesBefore7Point083Degrees"?: string;
    "TzaisGeonim7Point083Degrees"?: string;
    "TzaisGeonim8Point5Degrees"?: string;
    "PlagHamincha26Degrees"?: string;
    "BainHasmashosRT13Point24Degrees"?: string;
    "Tzais16Point1Degrees"?: string;
    "Tzais18Degrees"?: string;
    "Tzais19Point8Degrees"?: string;
    "Tzais26Degrees"?: string;
    "ShaahZmanisAteretTorah"?: number;
    "ShaahZmanis60Minutes"?: number;
    "ShaahZmanis72Minutes"?: number;
    "ShaahZmanis72MinutesZmanis"?: number;
    "ShaahZmanis90Minutes"?: number;
    "ShaahZmanis90MinutesZmanis"?: number;
    "ShaahZmanis96Minutes"?: number;
    "ShaahZmanis96MinutesZmanis"?: number;
    "ShaahZmanis16Point1Degrees"?: number;
    "ShaahZmanis18Degrees"?: number;
    "ShaahZmanis120Minutes"?: number;
    "ShaahZmanis120MinutesZmanis"?: number;
    "ShaahZmanis19Point8Degrees"?: number;
    "ShaahZmanis26Degrees"?: number;
    "SofZmanKidushLevanaBetweenMoldos"?: string;
    "TchilasZmanKidushLevana7Days"?: string;
    "TchilasZmanKidushLevana3Days"?: string;
    "SofZmanKidushLevana15Days"?: string;
}
