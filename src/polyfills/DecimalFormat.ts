import * as numeral from "numeral";

export default class DecimalFormat {
    private pattern: string;

    constructor(pattern: string) {
        this.pattern = pattern;
    }

    public format(num: number): string {
        return numeral(num).format(this.pattern);
    }
}
