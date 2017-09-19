export default class StringBuffer {
    private str: string = "";

    constructor(str?: any) {
        this.str = str.toString() || "";
    }

    /**
     * Append a value to the buffer.
     *
     * @param value
     * @returns {StringBuffer}
     */
    public append(value: any): StringBuffer {
        this.str = this.str.concat(value.toString());
        return this;
    }

    public toString(): string {
        return this.str;
    }

    public length(): number {
        return this.str.length;
    }

    /**
     * Inserts a value at the specified position. Any text from that position and on with be moved over.
     *
     * @param {number} offset
     * @param value
     * @returns {StringBuffer}
     */
    public insert(offset: number, value: any): StringBuffer {
        this.str = this.str.substr(0, offset).concat(value.toString()).concat(this.str.substr(offset, this.str.length - offset));
        return this;
    }

    /**
     * Truncates the buffer to the specified length.
     *
     * @param {number} length
     * @returns {StringBuffer}
     */
    public setLength(length: number): StringBuffer {
        this.str = this.str.substr(0, length);
        return this;
    }
}
