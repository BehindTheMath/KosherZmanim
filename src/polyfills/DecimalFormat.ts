const numeral: Numeral = require("numeral");

export class DecimalFormat {
    private pattern: string;

    constructor(pattern: string) {
        this.pattern = pattern;
    }

    public format(number: number): string {
        return numeral(number).format(this.pattern);
    }
}