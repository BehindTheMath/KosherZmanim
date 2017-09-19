/**
 * An Object representing a Daf in the Daf Yomi cycle.
 * 
 * @author &copy; Eliyahu Hershfeld 2011 - 2014
 * @version 0.0.2
 */
export default class Daf {
    private masechtaNumber: number;
    private daf: number;

    private static masechtosBavliTransliterated: string[] = [ "Berachos", "Shabbos", "Eruvin", "Pesachim", "Shekalim",
            "Yoma", "Sukkah", "Beitzah", "Rosh Hashana", "Taanis", "Megillah", "Moed Katan", "Chagigah", "Yevamos",
            "Kesubos", "Nedarim", "Nazir", "Sotah", "Gitin", "Kiddushin", "Bava Kamma", "Bava Metzia", "Bava Basra",
            "Sanhedrin", "Makkos", "Shevuos", "Avodah Zarah", "Horiyos", "Zevachim", "Menachos", "Chullin", "Bechoros",
            "Arachin", "Temurah", "Kerisos", "Meilah", "Kinnim", "Tamid", "Midos", "Niddah" ];

    private static masechtosBavli: string[] = [ "\u05D1\u05E8\u05DB\u05D5\u05EA", "\u05E9\u05D1\u05EA",
            "\u05E2\u05D9\u05E8\u05D5\u05D1\u05D9\u05DF", "\u05E4\u05E1\u05D7\u05D9\u05DD",
            "\u05E9\u05E7\u05DC\u05D9\u05DD", "\u05D9\u05D5\u05DE\u05D0", "\u05E1\u05D5\u05DB\u05D4",
            "\u05D1\u05D9\u05E6\u05D4", "\u05E8\u05D0\u05E9 \u05D4\u05E9\u05E0\u05D4",
            "\u05EA\u05E2\u05E0\u05D9\u05EA", "\u05DE\u05D2\u05D9\u05DC\u05D4",
            "\u05DE\u05D5\u05E2\u05D3 \u05E7\u05D8\u05DF", "\u05D7\u05D2\u05D9\u05D2\u05D4",
            "\u05D9\u05D1\u05DE\u05D5\u05EA", "\u05DB\u05EA\u05D5\u05D1\u05D5\u05EA", "\u05E0\u05D3\u05E8\u05D9\u05DD",
            "\u05E0\u05D6\u05D9\u05E8", "\u05E1\u05D5\u05D8\u05D4", "\u05D2\u05D9\u05D8\u05D9\u05DF",
            "\u05E7\u05D9\u05D3\u05D5\u05E9\u05D9\u05DF", "\u05D1\u05D1\u05D0 \u05E7\u05DE\u05D0",
            "\u05D1\u05D1\u05D0 \u05DE\u05E6\u05D9\u05E2\u05D0", "\u05D1\u05D1\u05D0 \u05D1\u05EA\u05E8\u05D0",
            "\u05E1\u05E0\u05D4\u05D3\u05E8\u05D9\u05DF", "\u05DE\u05DB\u05D5\u05EA",
            "\u05E9\u05D1\u05D5\u05E2\u05D5\u05EA", "\u05E2\u05D1\u05D5\u05D3\u05D4 \u05D6\u05E8\u05D4",
            "\u05D4\u05D5\u05E8\u05D9\u05D5\u05EA", "\u05D6\u05D1\u05D7\u05D9\u05DD", "\u05DE\u05E0\u05D7\u05D5\u05EA",
            "\u05D7\u05D5\u05DC\u05D9\u05DF", "\u05D1\u05DB\u05D5\u05E8\u05D5\u05EA", "\u05E2\u05E8\u05DB\u05D9\u05DF",
            "\u05EA\u05DE\u05D5\u05E8\u05D4", "\u05DB\u05E8\u05D9\u05EA\u05D5\u05EA", "\u05DE\u05E2\u05D9\u05DC\u05D4",
            "\u05EA\u05DE\u05D9\u05D3", "\u05E7\u05D9\u05E0\u05D9\u05DD", "\u05DE\u05D9\u05D3\u05D5\u05EA",
            "\u05E0\u05D3\u05D4" ];

    /**
     * @return the masechtaNumber
     */
    public getMasechtaNumber(): number {
        return this.masechtaNumber;
    }

    /**
     * Set the masechta number in the order of the Daf Yomi. The sequence is: Berachos, Shabbos, Eruvin, Pesachim,
     * Shekalim, Yoma, Sukkah, Beitzah, Rosh Hashana, Taanis, Megillah, Moed Katan, Chagigah, Yevamos, Kesubos, Nedarim,
     * Nazir, Sotah, Gitin, Kiddushin, Bava Kamma, Bava Metzia, Bava Basra, Sanhedrin, Makkos, Shevuos, Avodah Zarah,
     * Horiyos, Zevachim, Menachos, Chullin, Bechoros, Arachin, Temurah, Kerisos, Meilah, Kinnim, Tamid, Midos and
     * Niddah.
     *
     * @param masechtaNumber
     *            the masechtaNumber in the order of the Daf Yomi to set
     */
    public setMasechtaNumber(masechtaNumber: number): void {
        this.masechtaNumber = masechtaNumber;
    }

    /**
     * Constructor that creates a Daf setting the {@link #setMasechtaNumber(int) masechta Number} and
     * {@link #setDaf(int) daf Number}
     *
     * @param masechtaNumber the masechtaNumber in the order of the Daf Yomi to set
     * @param daf the daf (page) number to set
     */
    constructor(masechtaNumber: number, daf: number) {
        this.masechtaNumber = masechtaNumber;
        this.daf = daf;
    }

    /**
     * Returns the daf (page number) of the Daf Yomi
     * @return the daf (page number) of the Daf Yomi
     */
    public getDaf(): number {
        return this.daf;
    }

    /**
     * Sets the daf (page number) of the Daf Yomi
     * @param daf the daf (page) number
     */
    public setDaf(daf: number): void {
        this.daf = daf;
    }

    /**
     * Returns the transliterated name of the masechta (tractate) of the Daf Yomi. The list of mashechtos is: Berachos,
     * Shabbos, Eruvin, Pesachim, Shekalim, Yoma, Sukkah, Beitzah, Rosh Hashana, Taanis, Megillah, Moed Katan, Chagigah,
     * Yevamos, Kesubos, Nedarim, Nazir, Sotah, Gitin, Kiddushin, Bava Kamma, Bava Metzia, Bava Basra, Sanhedrin,
     * Makkos, Shevuos, Avodah Zarah, Horiyos, Zevachim, Menachos, Chullin, Bechoros, Arachin, Temurah, Kerisos, Meilah,
     * Kinnim, Tamid, Midos and Niddah.
     *
     * @return the transliterated name of the masechta (tractate) of the Daf Yomi such as Berachos.
     */
    public getMasechtaTransliterated(): string {
        return Daf.masechtosBavliTransliterated[this.masechtaNumber];
    }

    /**
     * Returns the masechta (tractate) of the Daf Yomi in Hebrew, It will return
     * &#x05D1;&#x05E8;&#x05DB;&#x05D5;&#x05EA; for Berachos.
     *
     * @return the masechta (tractate) of the Daf Yomi in Hebrew, It will return
     *         &#x05D1;&#x05E8;&#x05DB;&#x05D5;&#x05EA; for Berachos.
     */
    public getMasechta(): string {
        return Daf.masechtosBavli[this.masechtaNumber];
    }
}
