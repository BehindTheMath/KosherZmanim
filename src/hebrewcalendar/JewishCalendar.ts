import {GeoLocation} from "../util/GeoLocation";
import {Daf} from "./Daf";
import {JewishDate} from "./JewishDate";
import {YomiCalculator} from "./YomiCalculator";
import {YerushalmiYomiCalculator} from "./YerushalmiYomiCalculator";

import * as MomentTimezone from "moment-timezone";
import Moment = MomentTimezone.Moment;

export enum Parsha {
    NONE, BERESHIS, NOACH, LECH_LECHA, VAYERA, CHAYEI_SARA, TOLDOS, VAYETZEI,
    VAYISHLACH, VAYESHEV, MIKETZ, VAYIGASH, VAYECHI, SHEMOS, VAERA, BO,
    BESHALACH, YISRO, MISHPATIM, TERUMAH, TETZAVEH, KI_SISA, VAYAKHEL,
    PEKUDEI, VAYIKRA, TZAV, SHMINI, TAZRIA, METZORA, ACHREI_MOS, KEDOSHIM,
    EMOR, BEHAR, BECHUKOSAI, BAMIDBAR, NASSO, BEHAALOSCHA, SHLACH, KORACH,
    CHUKAS, BALAK, PINCHAS, MATOS, MASEI, DEVARIM, VAESCHANAN, EIKEV,
    REEH, SHOFTIM, KI_SEITZEI, KI_SAVO, NITZAVIM, VAYEILECH, HAAZINU,
    VZOS_HABERACHA, VAYAKHEL_PEKUDEI, TAZRIA_METZORA, ACHREI_MOS_KEDOSHIM, BEHAR_BECHUKOSAI,
    CHUKAS_BALAK, MATOS_MASEI, NITZAVIM_VAYEILECH, SHKALIM, ZACHOR, PARA, HACHODESH,
}

/**
 * The JewishCalendar extends the JewishDate class and adds calendar methods.
 *
 * This open source Java code was originally ported by <a href="http://www.facebook.com/avromf">Avrom Finkelstien</a>
 * from his C++ code. It was refactored to fit the KosherJava Zmanim API with simplification of the code, enhancements
 * and some bug fixing. The class allows setting whether the holiday and parsha scheme follows the Israel scheme or outside Israel
 * scheme. The default is the outside Israel scheme.
 * The parsha code was ported by Y Paritcher from his <a href="https://github.com/yparitcher/libzmanim">libzmanim</a> code.
 *
 * TODO: Some do not belong in this class, but here is a partial list of what should still be implemented in some form:
 * <ol>
 * <li>Add Isru Chag</li>
 * <li>Mishna yomis etc</li>
 * </ol>
 *
 * @see java.util.Date
 * @see java.util.Calendar
 * @author &copy; Y Paritcher 2019
 * @author &copy; Avrom Finkelstien 2002
 * @author &copy; Eliyahu Hershfeld 2011 - 2019
 */
export class JewishCalendar extends JewishDate {
    public static readonly EREV_PESACH: number = 0;
    public static readonly PESACH: number = 1;
    public static readonly CHOL_HAMOED_PESACH: number = 2;
    public static readonly PESACH_SHENI: number = 3;
    public static readonly EREV_SHAVUOS: number = 4;
    public static readonly SHAVUOS: number = 5;
    public static readonly SEVENTEEN_OF_TAMMUZ: number = 6;
    public static readonly TISHA_BEAV: number = 7;
    public static readonly TU_BEAV: number = 8;
    public static readonly EREV_ROSH_HASHANA: number = 9;
    public static readonly ROSH_HASHANA: number = 10;
    public static readonly FAST_OF_GEDALYAH: number = 11;
    public static readonly EREV_YOM_KIPPUR: number = 12;
    public static readonly YOM_KIPPUR: number = 13;
    public static readonly EREV_SUCCOS: number = 14;
    public static readonly SUCCOS: number = 15;
    public static readonly CHOL_HAMOED_SUCCOS: number = 16;
    public static readonly HOSHANA_RABBA: number = 17;
    public static readonly SHEMINI_ATZERES: number = 18;
    public static readonly SIMCHAS_TORAH: number = 19;
    // public static final int EREV_CHANUKAH = 20;// probably remove this
    public static readonly CHANUKAH: number = 21;
    public static readonly TENTH_OF_TEVES: number = 22;
    public static readonly TU_BESHVAT: number = 23;
    public static readonly FAST_OF_ESTHER: number = 24;
    public static readonly PURIM: number = 25;
    public static readonly SHUSHAN_PURIM: number = 26;
    public static readonly PURIM_KATAN: number = 27;
    public static readonly ROSH_CHODESH: number = 28;
    public static readonly YOM_HASHOAH: number = 29;
    public static readonly YOM_HAZIKARON: number = 30;
    public static readonly YOM_HAATZMAUT: number = 31;
    public static readonly YOM_YERUSHALAYIM: number = 32;

    private inIsrael: boolean = false;
    private useModernHolidays: boolean = false;

    public static readonly parshalist: Parsha[][] = [
        [Parsha.NONE, Parsha.VAYEILECH, Parsha.HAAZINU, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL_PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.NONE, Parsha.SHMINI, Parsha.TAZRIA_METZORA, Parsha.ACHREI_MOS_KEDOSHIM, Parsha.EMOR, Parsha.BEHAR_BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM_VAYEILECH],
        [Parsha.NONE, Parsha.VAYEILECH, Parsha.HAAZINU, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL_PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.NONE, Parsha.SHMINI, Parsha.TAZRIA_METZORA, Parsha.ACHREI_MOS_KEDOSHIM, Parsha.EMOR, Parsha.BEHAR_BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NONE, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS_BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM_VAYEILECH],
        [Parsha.NONE, Parsha.HAAZINU, Parsha.NONE, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL_PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.NONE, Parsha.NONE, Parsha.SHMINI, Parsha.TAZRIA_METZORA, Parsha.ACHREI_MOS_KEDOSHIM, Parsha.EMOR, Parsha.BEHAR_BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM],
        [Parsha.NONE, Parsha.HAAZINU, Parsha.NONE, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL, Parsha.PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.NONE, Parsha.SHMINI, Parsha.TAZRIA_METZORA, Parsha.ACHREI_MOS_KEDOSHIM, Parsha.EMOR, Parsha.BEHAR_BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM],
        [Parsha.NONE, Parsha.NONE, Parsha.HAAZINU, Parsha.NONE, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL_PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.NONE, Parsha.SHMINI, Parsha.TAZRIA_METZORA, Parsha.ACHREI_MOS_KEDOSHIM, Parsha.EMOR, Parsha.BEHAR_BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM],
        [Parsha.NONE, Parsha.NONE, Parsha.HAAZINU, Parsha.NONE, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL_PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.NONE, Parsha.SHMINI, Parsha.TAZRIA_METZORA, Parsha.ACHREI_MOS_KEDOSHIM, Parsha.EMOR, Parsha.BEHAR_BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM_VAYEILECH],
        [Parsha.NONE, Parsha.VAYEILECH, Parsha.HAAZINU, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL, Parsha.PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.SHMINI, Parsha.TAZRIA, Parsha.METZORA, Parsha.NONE, Parsha.ACHREI_MOS, Parsha.KEDOSHIM, Parsha.EMOR, Parsha.BEHAR, Parsha.BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NONE, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS_BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM_VAYEILECH],
        [Parsha.NONE, Parsha.VAYEILECH, Parsha.HAAZINU, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL, Parsha.PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.SHMINI, Parsha.TAZRIA, Parsha.METZORA, Parsha.NONE, Parsha.NONE, Parsha.ACHREI_MOS, Parsha.KEDOSHIM, Parsha.EMOR, Parsha.BEHAR, Parsha.BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM],
        [Parsha.NONE, Parsha.HAAZINU, Parsha.NONE, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL, Parsha.PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.SHMINI, Parsha.TAZRIA, Parsha.METZORA, Parsha.ACHREI_MOS, Parsha.NONE, Parsha.KEDOSHIM, Parsha.EMOR, Parsha.BEHAR, Parsha.BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS, Parsha.MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM],
        [Parsha.NONE, Parsha.HAAZINU, Parsha.NONE, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL, Parsha.PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.SHMINI, Parsha.TAZRIA, Parsha.METZORA, Parsha.ACHREI_MOS, Parsha.NONE, Parsha.KEDOSHIM, Parsha.EMOR, Parsha.BEHAR, Parsha.BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS, Parsha.MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM_VAYEILECH],
        [Parsha.NONE, Parsha.NONE, Parsha.HAAZINU, Parsha.NONE, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL, Parsha.PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.SHMINI, Parsha.TAZRIA, Parsha.METZORA, Parsha.NONE, Parsha.ACHREI_MOS, Parsha.KEDOSHIM, Parsha.EMOR, Parsha.BEHAR, Parsha.BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM_VAYEILECH],
        [Parsha.NONE, Parsha.NONE, Parsha.HAAZINU, Parsha.NONE, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL, Parsha.PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.SHMINI, Parsha.TAZRIA, Parsha.METZORA, Parsha.NONE, Parsha.ACHREI_MOS, Parsha.KEDOSHIM, Parsha.EMOR, Parsha.BEHAR, Parsha.BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NONE, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS_BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM_VAYEILECH],
        [Parsha.NONE, Parsha.VAYEILECH, Parsha.HAAZINU, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL_PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.NONE, Parsha.SHMINI, Parsha.TAZRIA_METZORA, Parsha.ACHREI_MOS_KEDOSHIM, Parsha.EMOR, Parsha.BEHAR_BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM_VAYEILECH],
        [Parsha.NONE, Parsha.HAAZINU, Parsha.NONE, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL_PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.NONE, Parsha.SHMINI, Parsha.TAZRIA_METZORA, Parsha.ACHREI_MOS_KEDOSHIM, Parsha.EMOR, Parsha.BEHAR, Parsha.BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM],
        [Parsha.NONE, Parsha.VAYEILECH, Parsha.HAAZINU, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL, Parsha.PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.SHMINI, Parsha.TAZRIA, Parsha.METZORA, Parsha.NONE, Parsha.ACHREI_MOS, Parsha.KEDOSHIM, Parsha.EMOR, Parsha.BEHAR, Parsha.BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM_VAYEILECH],
        [Parsha.NONE, Parsha.VAYEILECH, Parsha.HAAZINU, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL, Parsha.PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.SHMINI, Parsha.TAZRIA, Parsha.METZORA, Parsha.NONE, Parsha.ACHREI_MOS, Parsha.KEDOSHIM, Parsha.EMOR, Parsha.BEHAR, Parsha.BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS, Parsha.MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM],
        [Parsha.NONE, Parsha.NONE, Parsha.HAAZINU, Parsha.NONE, Parsha.NONE, Parsha.BERESHIS, Parsha.NOACH, Parsha.LECH_LECHA, Parsha.VAYERA, Parsha.CHAYEI_SARA, Parsha.TOLDOS, Parsha.VAYETZEI, Parsha.VAYISHLACH, Parsha.VAYESHEV, Parsha.MIKETZ, Parsha.VAYIGASH, Parsha.VAYECHI, Parsha.SHEMOS, Parsha.VAERA, Parsha.BO, Parsha.BESHALACH, Parsha.YISRO, Parsha.MISHPATIM, Parsha.TERUMAH, Parsha.TETZAVEH, Parsha.KI_SISA, Parsha.VAYAKHEL, Parsha.PEKUDEI, Parsha.VAYIKRA, Parsha.TZAV, Parsha.SHMINI, Parsha.TAZRIA, Parsha.METZORA, Parsha.NONE, Parsha.ACHREI_MOS, Parsha.KEDOSHIM, Parsha.EMOR, Parsha.BEHAR, Parsha.BECHUKOSAI, Parsha.BAMIDBAR, Parsha.NASSO, Parsha.BEHAALOSCHA, Parsha.SHLACH, Parsha.KORACH, Parsha.CHUKAS, Parsha.BALAK, Parsha.PINCHAS, Parsha.MATOS_MASEI, Parsha.DEVARIM, Parsha.VAESCHANAN, Parsha.EIKEV, Parsha.REEH, Parsha.SHOFTIM, Parsha.KI_SEITZEI, Parsha.KI_SAVO, Parsha.NITZAVIM_VAYEILECH]
    ];

/**
     * Is this calendar set to return modern Israeli national holidays. By default this value is false. The holidays
     * are: "Yom HaShoah", "Yom Hazikaron", "Yom Ha'atzmaut" and "Yom Yerushalayim"
     *
     * @return the useModernHolidays true if set to return modern Israeli national holidays
     */
    public isUseModernHolidays(): boolean {
        return this.useModernHolidays;
    }

    /**
     * Seth the calendar to return modern Israeli national holidays. By default this value is false. The holidays are:
     * "Yom HaShoah", "Yom Hazikaron", "Yom Ha'atzmaut" and "Yom Yerushalayim"
     *
     * @param useModernHolidays
     *            the useModernHolidays to set
     */
    public setUseModernHolidays(useModernHolidays: boolean): void {
        this.useModernHolidays = useModernHolidays;
    }

    /**
     * Default constructor will set a default date to the current system date.
     */
/*
    public JewishCalendar() {
        super();
    }
*/

    /**
     * A constructor that initializes the date to the {@link java.util.Date Date} parameter.
     *
     * @param date
     *            the <code>Date</code> to set the calendar to
     */
/*
    public JewishCalendar(date: Date) {
        super(date);
    }
*/

    /**
     * A constructor that initializes the date to the {@link java.util.Calendar Calendar} parameter.
     *
     * @param calendar
     *            the <code>Calendar</code> to set the calendar to
     */
/*
    public JewishCalendar(calendar: GregorianCalendar) {
        super(calendar);
    }
*/

    /**
     * Creates a Jewish date based on a Jewish year, month and day of month.
     *
     * @param jewishYear
     *            the Jewish year
     * @param jewishMonth
     *            the Jewish month. The method expects a 1 for Nissan ... 12 for Adar and 13 for Adar II. Use the
     *            constants {@link #NISSAN} ... {@link #ADAR} (or {@link #ADAR_II} for a leap year Adar II) to avoid any
     *            confusion.
     * @param jewishDayOfMonth
     *            the Jewish day of month. If 30 is passed in for a month with only 29 days (for example {@link #IYAR},
     *            or {@link #KISLEV} in a year that {@link #isKislevShort()}), the 29th (last valid date of the month)
     *            will be set
     * @throws IllegalArgumentException
     *             if the day of month is &lt; 1 or &gt; 30, or a year of &lt; 0 is passed in.
     */
/*
    public JewishCalendar(jewishYear: number, jewishMonth: number, jewishDayOfMonth: number) {
        super(jewishYear, jewishMonth, jewishDayOfMonth);
    }
*/

    /**
     * Creates a Jewish date based on a Jewish date and whether in Israel
     *
     * @param jewishYear
     *            the Jewish year
     * @param jewishMonth
     *            the Jewish month. The method expects a 1 for Nissan ... 12 for Adar and 13 for Adar II. Use the
     *            constants {@link #NISSAN} ... {@link #ADAR} (or {@link #ADAR_II} for a leap year Adar II) to avoid any
     *            confusion.
     * @param jewishDayOfMonth
     *            the Jewish day of month. If 30 is passed in for a month with only 29 days (for example {@link #IYAR},
     *            or {@link #KISLEV} in a year that {@link #isKislevShort()}), the 29th (last valid date of the month)
     *            will be set
     * @param inIsrael
     *            whether in Israel. This affects Yom Tov calculations
     */
    constructor(jewishYear: number, jewishMonth: number, jewishDayOfMonth: number, inIsrael?: boolean)
    constructor(date: Date)
    constructor(moment: Moment)
    constructor()
    constructor(jewishYearOrMomentOrDate?: number | Moment | Date, jewishMonth?: number, jewishDayOfMonth?: number, inIsrael?: boolean) {
        // @ts-ignore
        super(jewishYearOrMomentOrDate, jewishMonth, jewishDayOfMonth);
        if (inIsrael) this.setInIsrael(inIsrael);
    }

    /**
     * Sets whether to use Israel holiday scheme or not. Default is false.
     *
     * @param inIsrael
     *            set to true for calculations for Israel
     */
    public setInIsrael(inIsrael: boolean): void {
        this.inIsrael = inIsrael;
    }

    /**
     * Gets whether Israel holiday scheme is used or not. The default (if not set) is false.
     *
     * @return if the if the calendar is set to Israel
     */
    public getInIsrael(): boolean {
        return this.inIsrael;
    }

    /**
     * Return the type of year for parsha calculations.
     * @return the type of year for parsha calculations.
     * @todo Use constants in this class.
     */
    private getYearType(): number {
        const yearWday: number = (JewishCalendar.getJewishCalendarElapsedDays(this.getJewishYear()) + 1) % 7;
        if (this.isJewishLeapYear()) {
            switch (yearWday) {
                case 2:
                    if (this.isKislevShort()) {
                        if (this.getInIsrael()) { return 14;}
                        return 6;
                    }
                    if (this.isCheshvanLong()) {
                        if (this.getInIsrael()) { return 15;}
                        return 7;
                    }
                    break;
                case 3:
                    if (this.getInIsrael()) { return 15;}
                    return 7;
                case 5:
                    if (this.isKislevShort()) {return 8;}
                    if (this.isCheshvanLong()) {return 9;}
                    break;
                case 0:
                    if (this.isKislevShort()) {return 10;}
                    if (this.isCheshvanLong()) {
                        if (this.getInIsrael()) { return 16;}
                        return 11;
                    }
                    break;
            }
        } else {
            switch (yearWday) {
                case 2:
                    if (this.isKislevShort()) {return 0;}
                    if (this.isCheshvanLong()) {
                        if (this.getInIsrael()) { return 12;}
                        return 1;
                    }
                    break;
                case 3:
                    if (this.getInIsrael()) { return 12;}
                    return 1;
                case 5:
                    if (this.isCheshvanLong()) {return 3;}
                    if (!this.isKislevShort()) {
                        if (this.getInIsrael()) { return 13;}
                        return 2;
                    }
                    break;
                case 0:
                    if (this.isKislevShort()) {return 4;}
                    if (this.isCheshvanLong()) {return 5;}
                    break;
            }
        }
        return -1;
    }

    /**
     * Returns a parsha enum with the weeks parsha if it is Shabbos.
     * returns NONE if a weekday or if there is no parsha that week (for example Yomtov is on Shabbos)
     * @return the current parsha
     */
    public getParsha(): Parsha {
        const yearType: number = this.getYearType();
        const yearWday: number = JewishCalendar.getJewishCalendarElapsedDays(this.getJewishYear()) % 7;
        const day: number = yearWday + this.getDaysSinceStartOfJewishYear();
        if (this.getDayOfWeek() !== 7) {
            return Parsha.NONE
        }
        if (yearType >= 0) {
            return JewishCalendar.parshalist[yearType][day / 7];
        }
        return Parsha.NONE;
    }

    /**
     * returns a parsha enum if the week is one of the four parshiyos if it is Shabbos.
     * returns NONE if a weekday
     * @return one of the four parshiyos on those shabbosim.
     */
    public getSpecialShabbos(): Parsha {
        if (this.getDayOfWeek() === 7) {
            if ((this.getJewishMonth() === 11 && !this.isJewishLeapYear()) ||
              (this.getJewishMonth() === 12 && this.isJewishLeapYear())) {
                if (this.getJewishDayOfMonth() === 25
                  || this.getJewishDayOfMonth() === 27
                  || this.getJewishDayOfMonth() === 29) {
                    return Parsha.SHKALIM;
                }
            }

            if ((this.getJewishMonth() === 12 && !this.isJewishLeapYear()) || this.getJewishMonth() === 13) {
                if (this.getJewishDayOfMonth() === 1) {
                    return Parsha.SHKALIM;
                }

                if (this.getJewishDayOfMonth() === 8
                  || this.getJewishDayOfMonth() === 9
                  || this.getJewishDayOfMonth() === 11
                  || this.getJewishDayOfMonth() === 13) {
                    return Parsha.ZACHOR;
                }

                if (this.getJewishDayOfMonth() === 18
                  || this.getJewishDayOfMonth() === 20
                  || this.getJewishDayOfMonth() === 22
                  || this.getJewishDayOfMonth() === 23) {
                    return Parsha.PARA;
                }

                if (this.getJewishDayOfMonth() === 25
                  || this.getJewishDayOfMonth() === 27
                  || this.getJewishDayOfMonth() === 29) {
                    return Parsha.HACHODESH;
                }
            }

            if (this.getJewishMonth() === 1 && this.getJewishDayOfMonth() === 1) {
                return Parsha.HACHODESH;
            }
        }
        return Parsha.NONE;
    }

    /**
     * Returns an index of the Jewish holiday or fast day for the current day, or a null if there is no holiday for this
     * day.
     *
     * @return A String containing the holiday name or an empty string if it is not a holiday.
     */
    public getYomTovIndex(): number {
        const day: number = this.getJewishDayOfMonth();
        const dayOfWeek: number = this.getDayOfWeek();

        // check by month (starts from Nissan)
        switch (this.getJewishMonth()) {
            case JewishCalendar.NISSAN:
                if (day === 14) {
                    return JewishCalendar.EREV_PESACH;
                } else if (day === 15 || day === 21 || (!this.inIsrael && (day === 16 || day === 22))) {
                    return JewishCalendar.PESACH;
                } else if (day >= 17 && day <= 20 || (day === 16 && this.inIsrael)) {
                    return JewishCalendar.CHOL_HAMOED_PESACH;
                }

                if (this.isUseModernHolidays()
                    && ((day === 26 && dayOfWeek === 5) || (day === 28 && dayOfWeek === 2)
                        || (day === 27 && dayOfWeek !== 1 && dayOfWeek !== 6))) {
                    return JewishCalendar.YOM_HASHOAH;
                }
                break;
            case JewishCalendar.IYAR:
                if (this.isUseModernHolidays()
                    && ((day === 4 && dayOfWeek === 3) || ((day === 3 || day === 2) && dayOfWeek === 4)
                        || (day === 5 && dayOfWeek === 2))) {
                    return JewishCalendar.YOM_HAZIKARON;
                }

                // if 5 Iyar falls on Wed Yom Haatzmaut is that day. If it fal1s on Friday or Shabbos it is moved back to
                // Thursday. If it falls on Monday it is moved to Tuesday
                if (this.isUseModernHolidays() && ((day === 5 && dayOfWeek === 4)
                    || ((day === 4 || day === 3) && dayOfWeek === 5) || (day === 6 && dayOfWeek === 3))) {
                    return JewishCalendar.YOM_HAATZMAUT;
                }

                if (day === 14) {
                    return JewishCalendar.PESACH_SHENI;
                }

                if (this.isUseModernHolidays() && day === 28) {
                    return JewishCalendar.YOM_YERUSHALAYIM;
                }
                break;
            case JewishCalendar.SIVAN:
                if (day === 5) {
                    return JewishCalendar.EREV_SHAVUOS;
                } else if (day === 6 || (day === 7 && !this.inIsrael)) {
                    return JewishCalendar.SHAVUOS;
                }
                break;
            case JewishCalendar.TAMMUZ:
                // push off the fast day if it falls on Shabbos
                if ((day === 17 && dayOfWeek !== 7) || (day === 18 && dayOfWeek === 1)) {
                    return JewishCalendar.SEVENTEEN_OF_TAMMUZ;
                }
                break;
            case JewishCalendar.AV:
                // if Tisha B'av falls on Shabbos, push off until Sunday
                if ((dayOfWeek === 1 && day === 10) || (dayOfWeek !== 7 && day === 9)) {
                    return JewishCalendar.TISHA_BEAV;
                } else if (day === 15) {
                    return JewishCalendar.TU_BEAV;
                }
                break;
            case JewishCalendar.ELUL:
                if (day === 29) {
                    return JewishCalendar.EREV_ROSH_HASHANA;
                }
                break;
            case JewishCalendar.TISHREI:
                if (day === 1 || day === 2) {
                    return JewishCalendar.ROSH_HASHANA;
                } else if ((day === 3 && dayOfWeek !== 7) || (day === 4 && dayOfWeek === 1)) {
                    // push off Tzom Gedalia if it falls on Shabbos
                    return JewishCalendar.FAST_OF_GEDALYAH;
                } else if (day === 9) {
                    return JewishCalendar.EREV_YOM_KIPPUR;
                } else if (day === 10) {
                    return JewishCalendar.YOM_KIPPUR;
                } else if (day === 14) {
                    return JewishCalendar.EREV_SUCCOS;
                }

                if (day === 15 || (day === 16 && !this.inIsrael)) {
                    return JewishCalendar.SUCCOS;
                }

                if (day >= 17 && day <= 20 || (day === 16 && this.inIsrael)) {
                    return JewishCalendar.CHOL_HAMOED_SUCCOS;
                }

                if (day === 21) {
                    return JewishCalendar.HOSHANA_RABBA;
                }

                if (day === 22) {
                    return JewishCalendar.SHEMINI_ATZERES;
                }

                if (day === 23 && !this.inIsrael) {
                    return JewishCalendar.SIMCHAS_TORAH;
                }
                break;
            case JewishCalendar.KISLEV: // no yomtov in CHESHVAN
                // if (day == 24) {
                // return EREV_CHANUKAH;
                // } else
                if (day >= 25) {
                    return JewishCalendar.CHANUKAH;
                }
                break;
            case JewishCalendar.TEVES:
                if (day === 1 || day === 2 || (day === 3 && this.isKislevShort())) {
                    return JewishCalendar.CHANUKAH;
                } else if (day === 10) {
                    return JewishCalendar.TENTH_OF_TEVES;
                }
                break;
            case JewishCalendar.SHEVAT:
                if (day === 15) {
                    return JewishCalendar.TU_BESHVAT;
                }
                break;
            case JewishCalendar.ADAR:
                if (!this.isJewishLeapYear()) {
                    // if 13th Adar falls on Friday or Shabbos, push back to Thursday
                    if (((day === 11 || day === 12) && dayOfWeek === 5) || (day === 13 && !(dayOfWeek === 6 || dayOfWeek === 7))) {
                        return JewishCalendar.FAST_OF_ESTHER;
                    }

                    if (day === 14) {
                        return JewishCalendar.PURIM;
                    } else if (day === 15) {
                        return JewishCalendar.SHUSHAN_PURIM;
                    }
                } else { // else if a leap year
                    if (day === 14) {
                        return JewishCalendar.PURIM_KATAN;
                    }
                }
                break;
            case JewishCalendar.ADAR_II:
                // if 13th Adar falls on Friday or Shabbos, push back to Thursday
                if (((day === 11 || day === 12) && dayOfWeek === 5) || (day === 13 && !(dayOfWeek === 6 || dayOfWeek === 7))) {
                    return JewishCalendar.FAST_OF_ESTHER;
                }

                if (day === 14) {
                    return JewishCalendar.PURIM;
                } else if (day === 15) {
                    return JewishCalendar.SHUSHAN_PURIM;
                }
                break;
        }
        // if we get to this stage, then there are no holidays for the given date return -1
        return -1;
    }

    /**
     * Returns true if the current day is Yom Tov. The method returns false for Chanukah, Erev Yom Tov (with the
     * exception of Hoshana Rabba and Erev the second days of Pesach) and fast days.
     *
     * @return true if the current day is a Yom Tov
     * @see #isErevYomTov()
     * @see #isErevYomTovSheni()
     * @see #isTaanis()
     */
    public isYomTov(): boolean {
        const holidayIndex: number = this.getYomTovIndex();
        if ((this.isErevYomTov() && (holidayIndex !== JewishCalendar.HOSHANA_RABBA && (holidayIndex === JewishCalendar.CHOL_HAMOED_PESACH && this.getJewishDayOfMonth() !== 20)))
                || holidayIndex === JewishCalendar.CHANUKAH || (this.isTaanis() && holidayIndex !== JewishCalendar.YOM_KIPPUR)) {
            return false;
        }
        return this.getYomTovIndex() !== -1;
    }

    /**
     * Returns true if the <em>Yom Tov</em> day has a <em>melacha</em> (work) prohibition. This method will return false for a
     * non-<em>Yom Tov</em> day, even if it is <em>Shabbos</em>.
     *
     * @return if the <em>Yom Tov</em> day has a <em>melacha</em> (work) prohibition.
     */
    public isYomTovAssurBemelacha(): boolean {
        const holidayIndex: number = this.getYomTovIndex();
        return holidayIndex === JewishCalendar.PESACH || holidayIndex === JewishCalendar.SHAVUOS || holidayIndex === JewishCalendar.SUCCOS || holidayIndex === JewishCalendar.SHEMINI_ATZERES ||
                holidayIndex === JewishCalendar.SIMCHAS_TORAH || holidayIndex === JewishCalendar.ROSH_HASHANA  || holidayIndex === JewishCalendar.YOM_KIPPUR;
    }

    /**
     * Returns true if it is <em>Shabbos</em> or if it is a <em>Yom Tov</em> day that has a <em>melacha</em> (work)  prohibition.
     * This method will return false for a.
     * @return if the day is a <em>Yom Tov</em> that is <em>assur bemlacha</em> or <em>Shabbos</em>
     */
    public isAssurBemelacha(): boolean {
        return this.getDayOfWeek() === 7 || this.isYomTovAssurBemelacha();
    }

    /**
     * Returns true if the day has candle lighting. This will return true on erev <em>Shabbos</em>, erev <em>Yom Tov</em>, the
     * first day of <em>Rosh Hashana</em> and the first days of <em>Yom Tov</em> out of Israel. It is identical
     * to calling {@link isTomorrowShabbosOrYomTov()}.
     *
     * @return if the day has candle lighting
     */
    public hasCandleLighting(): boolean {
        return this.isTomorrowShabbosOrYomTov();
    }

    /**
     * Returns true if tomorrow is <em>Shabbos</em> or <em>Yom Tov</em>. This will return true on erev <em>Shabbos</em>, erev
     * <em>Yom Tov</em>, the first day of <em>Rosh Hashana</em> and <em>erev</em> the first days of <em>Yom Tov</em> out of
     * Israel. It is identical to calling {@link hasCandleLighting()}.
     * @return will return if the next day is <em>Shabbos</em> or <em>Yom Tov</em>
     */
    public isTomorrowShabbosOrYomTov(): boolean {
        return this.getDayOfWeek() === 6 || this.isErevYomTov() || this.isErevYomTovSheni();
    }

    /**
     * Returns true if the day is the second day of <em>Yom Tov</em>. This impacts the second day of <em>Rosh Hashana</em>
     * everywhere, and the second days of Yom Tov in <em>chutz laaretz</em> (out of Israel).
     *
     * @return  if the day is the second day of <em>Yom Tov</em>.
     */
    public isErevYomTovSheni(): boolean {
        return (this.getJewishMonth() === JewishCalendar.TISHREI && (this.getJewishDayOfMonth() === 1))
            || (!this.getInIsrael()
                && ((this.getJewishMonth() === JewishCalendar.NISSAN && (this.getJewishDayOfMonth() === 15 || this.getJewishDayOfMonth() === 21))
                    || (this.getJewishMonth() === JewishCalendar.TISHREI && (this.getJewishDayOfMonth() === 15 || this.getJewishDayOfMonth() === 22))
                    || (this.getJewishMonth() === JewishCalendar.SIVAN && this.getJewishDayOfMonth() === 6)));
    }

    /**
     * Returns true if the current day is <em>Aseret Yemei Teshuva</em>.
     *
     * @return if the current day is <em>Aseret Yemei Teshuvah</em>
     */
    public isAseresYemeiTeshuva(): boolean {
        return this.getJewishMonth() === JewishCalendar.TISHREI && this.getJewishDayOfMonth() <= 10;
    }

    /**
     * Returns true if the current day is <em>Chol Hamoed</em> of <em>Pesach</em> or <em>Succos</em>.
     *
     * @return true if the current day is <em>Chol Hamoed</em> of <em>Pesach</em> or <em>Succos</em>
     * @see #isYomTov()
     * @see #CHOL_HAMOED_PESACH
     * @see #CHOL_HAMOED_SUCCOS
     */
    public isCholHamoed(): boolean {
        return this.isCholHamoedPesach() || this.isCholHamoedSuccos();
    }

    /**
     * Returns true if the current day is <em>Chol Hamoed</em> of <em>Pesach</em>.
     *
     * @return true if the current day is <em>Chol Hamoed</em> of <em>Pesach</em>
     * @see #isYomTov()
     * @see #CHOL_HAMOED_PESACH
     */
    public isCholHamoedPesach(): boolean {
        const holidayIndex: number = this.getYomTovIndex();
        return holidayIndex === JewishCalendar.CHOL_HAMOED_PESACH;
    }

    /**
     * Returns true if the current day is <em>Chol Hamoed</em> of <em>Succos</em>.
     *
     * @return true if the current day is <em>Chol Hamoed</em> of <em>Succos</em>
     * @see #isYomTov()
     * @see #CHOL_HAMOED_SUCCOS
     */
    public isCholHamoedSuccos(): boolean {
        const holidayIndex: number = this.getYomTovIndex();
        return holidayIndex === JewishCalendar.CHOL_HAMOED_SUCCOS;
    }

    /**
     * Returns true if the current day is erev Yom Tov. The method returns true for Erev - Pesach (first and last days),
     * Shavuos, Rosh Hashana, Yom Kippur and Succos and Hoshana Rabba.
     *
     * @return true if the current day is Erev - Pesach, Shavuos, Rosh Hashana, Yom Kippur and Succos
     * @see #isYomTov()
     * @see #isErevYomTovSheni()
     */
    public isErevYomTov(): boolean {
        const holidayIndex: number = this.getYomTovIndex();
        return holidayIndex === JewishCalendar.EREV_PESACH || holidayIndex === JewishCalendar.EREV_SHAVUOS || holidayIndex === JewishCalendar.EREV_ROSH_HASHANA
                || holidayIndex === JewishCalendar.EREV_YOM_KIPPUR || holidayIndex === JewishCalendar.EREV_SUCCOS || holidayIndex === JewishCalendar.HOSHANA_RABBA
                || (holidayIndex === JewishCalendar.CHOL_HAMOED_PESACH && this.getJewishDayOfMonth() === 20);
    }

    /**
     * Returns true if the current day is Erev Rosh Chodesh. Returns false for Erev Rosh Hashana
     *
     * @return true if the current day is Erev Rosh Chodesh. Returns false for Erev Rosh Hashana
     * @see #isRoshChodesh()
     */
    public isErevRoshChodesh(): boolean {
        // Erev Rosh Hashana is not Erev Rosh Chodesh.
        return (this.getJewishDayOfMonth() === 29 && this.getJewishMonth() !== JewishCalendar.ELUL);
    }

    /**
     * Return true if the day is a Taanis (fast day). Return true for 17 of Tammuz, Tisha B'Av, Yom Kippur, Fast of
     * Gedalyah, 10 of Teves and the Fast of Esther
     *
     * @return true if today is a fast day
     */
    public isTaanis(): boolean {
        const holidayIndex: number = this.getYomTovIndex();
        return holidayIndex === JewishCalendar.SEVENTEEN_OF_TAMMUZ || holidayIndex === JewishCalendar.TISHA_BEAV || holidayIndex === JewishCalendar.YOM_KIPPUR
                || holidayIndex === JewishCalendar.FAST_OF_GEDALYAH || holidayIndex === JewishCalendar.TENTH_OF_TEVES || holidayIndex === JewishCalendar.FAST_OF_ESTHER;
    }

    /**
     * Returns the day of Chanukah or -1 if it is not Chanukah.
     *
     * @return the day of Chanukah or -1 if it is not Chanukah.
     */
    public getDayOfChanukah(): number {
        const day: number = this.getJewishDayOfMonth();

        if (this.isChanukah()) {
            if (this.getJewishMonth() === JewishCalendar.KISLEV) {
                return day - 24;
            } else { // teves
                return this.isKislevShort() ? day + 5 : day + 6;
            }
        } else {
            return -1;
        }
    }

    public isChanukah(): boolean {
        return this.getYomTovIndex() === JewishCalendar.CHANUKAH;
    }

    /**
     * Returns if the day is Rosh Chodesh. Rosh Hashana will return false
     *
     * @return true if it is Rosh Chodesh. Rosh Hashana will return false
     */
    public isRoshChodesh(): boolean {
        // Rosh Hashana is not rosh chodesh. Elul never has 30 days
        return (this.getJewishDayOfMonth() === 1 && this.getJewishMonth() !== JewishCalendar.TISHREI) || this.getJewishDayOfMonth() === 30;
    }

    /**
     * Returns if the day is Shabbos and sunday is Rosh Chodesh.
     *
     * @return true if it is Shabbos and sunday is Rosh Chodesh.
     */
    public isMacharChodesh(): boolean {
        return (this.getDayOfWeek() === 7 && (this.getJewishDayOfMonth() === 30 || this.getJewishDayOfMonth() === 29));
    }

    /**
     * Returns if the day is Shabbos Mevorchim.
     *
     * @return true if it is Shabbos Mevorchim.
     */
    public isShabbosMevorchim(): boolean {
        return (this.getDayOfWeek() === 7 && this.getJewishDayOfMonth() >= 23 && this.getJewishDayOfMonth() <= 29);
    }

    /**
     * Returns the int value of the Omer day or -1 if the day is not in the omer
     *
     * @return The Omer count as an int or -1 if it is not a day of the Omer.
     */
    public getDayOfOmer(): number {
        let omer: number = -1; // not a day of the Omer
        const month: number = this.getJewishMonth();
        const day: number = this.getJewishDayOfMonth();

        // if Nissan and second day of Pesach and on
        if (month === JewishCalendar.NISSAN && day >= 16) {
            omer = day - 15;
            // if Iyar
        } else if (month === JewishCalendar.IYAR) {
            omer = day + 15;
            // if Sivan and before Shavuos
        } else if (month === JewishCalendar.SIVAN && day < 6) {
            omer = day + 44;
        }
        return omer;
    }

    /**
     * Returns the molad in Standard Time in Yerushalayim as a Date. The traditional calculation uses local time. This
     * method subtracts 20.94 minutes (20 minutes and 56.496 seconds) from the local time (Har Habayis with a longitude
     * of 35.2354&deg; is 5.2354&deg; away from the %15 timezone longitude) to get to standard time. This method
     * intentionally uses standard time and not dailight savings time. Java will implicitly format the time to the
     * default (or set) Timezone.
     *
     * @return the Date representing the moment of the molad in Yerushalayim standard time (GMT + 2)
     */
    public getMoladAsDate(): Date {
        const molad: JewishDate = this.getMolad();
        const locationName: string = "Jerusalem, Israel";

        const latitude: number = 31.778; // Har Habayis latitude
        const longitude: number = 35.2354; // Har Habayis longitude

        // The molad calculation always expects output in standard time. Using "Asia/Jerusalem" timezone will incorrect
        // adjust for DST.
        const yerushalayimStandardTZ: string = "Etc/GMT-2";
        const geo: GeoLocation = new GeoLocation(locationName, latitude, longitude, yerushalayimStandardTZ);

        const moladSeconds: number = molad.getMoladChalakim() * 10 / 3;
        // subtract local time difference of 20.94 minutes (20 minutes and 56.496 seconds) to get to Standard time
        const milliseconds: number = Math.trunc(1000 * (moladSeconds - Math.trunc(moladSeconds)));
        const moment: Moment = MomentTimezone.tz({
            year: molad.getGregorianYear(),
            month: molad.getGregorianMonth(),
            day: molad.getGregorianDayOfMonth(),
            hours: molad.getMoladHours(),
            minutes: molad.getMoladMinutes(),
            seconds: Math.trunc(moladSeconds),
            milliseconds
        }, geo.getTimeZone());
        moment.subtract({milliseconds: Math.trunc(geo.getLocalMeanTimeOffset())});

        return moment.toDate();
    }

    /**
     * Returns the earliest time of <em>Kiddush Levana</em> calculated as 3 days after the molad. This method returns the time
     * even if it is during the day when <em>Kiddush Levana</em> can't be said. Callers of this method should consider
     * displaying the next <em>tzais</em> if the zman is between <em>alos</em> and <em>tzais</em>.
     *
     * @return the Date representing the moment 3 days after the molad.
     *
     * @see net.sourceforge.zmanim.ComplexZmanimCalendar#getTchilasZmanKidushLevana3Days()
     * @see net.sourceforge.zmanim.ComplexZmanimCalendar#getTchilasZmanKidushLevana3Days(Date, Date)
     */
    public getTchilasZmanKidushLevana3Days(): Date {
        const molad: Date = this.getMoladAsDate();

        const moment: Moment = MomentTimezone(molad).add({hours: 72});

        return moment.toDate();
    }

    /**
     * Returns the earliest time of Kiddush Levana calculated as 7 days after the molad as mentioned by the <a
     * href="http://en.wikipedia.org/wiki/Yosef_Karo">Mechaber</a>. See the <a
     * href="http://en.wikipedia.org/wiki/Yoel_Sirkis">Bach's</a> opinion on this time. This method returns the time
     * even if it is during the day when <em>Kiddush Levana</em> can't be said. Callers of this method should consider
     * displaying the next <em>tzais</em> if the zman is between <em>alos</em> and <em>tzais</em>.
     *
     * @return the Date representing the moment 7 days after the molad.
     *
     * @see net.sourceforge.zmanim.ComplexZmanimCalendar#getTchilasZmanKidushLevana7Days()
     * @see net.sourceforge.zmanim.ComplexZmanimCalendar#getTchilasZmanKidushLevana7Days(Date, Date)
     */
    public getTchilasZmanKidushLevana7Days(): Date {
        const molad: Date = this.getMoladAsDate();

        const moment: Moment = MomentTimezone(molad).add({hours: 168});

        return moment.toDate();
    }

    /**
     * Returns the latest time of Kiddush Levana according to the <a
     * href="http://en.wikipedia.org/wiki/Yaakov_ben_Moshe_Levi_Moelin">Maharil's</a> opinion that it is calculated as
     * halfway between molad and molad. This adds half the 29 days, 12 hours and 793 chalakim time between molad and
     * molad (14 days, 18 hours, 22 minutes and 666 milliseconds) to the month's molad. This method returns the time
     * even if it is during the day when <em>Kiddush Levana</em> can't be said. Callers of this method should consider
     * displaying <em>alos</em> before this time if the zman is between <em>alos</em> and <em>tzais</em>.
     *
     * @return the Date representing the moment halfway between molad and molad.
     * @see #getSofZmanKidushLevana15Days()
     * @see net.sourceforge.zmanim.ComplexZmanimCalendar#getSofZmanKidushLevanaBetweenMoldos()
     * @see net.sourceforge.zmanim.ComplexZmanimCalendar#getSofZmanKidushLevanaBetweenMoldos(Date, Date)
     */
    public getSofZmanKidushLevanaBetweenMoldos(): Date {
        const molad: Date = this.getMoladAsDate();

        const moment: Moment = MomentTimezone(molad).add({
            day: 14,
            hours: 18,
            minutes: 22,
            seconds: 1,
            milliseconds: 666
        });

        return moment.toDate();
    }

    /**
     * Returns the latest time of Kiddush Levana calculated as 15 days after the molad. This is the opinion brought down
     * in the Shulchan Aruch (Orach Chaim 426). It should be noted that some opinions hold that the
     * <a href="http://en.wikipedia.org/wiki/Moses_Isserles">Rema</a> who brings down the opinion of the <a
     * href="http://en.wikipedia.org/wiki/Yaakov_ben_Moshe_Levi_Moelin">Maharil's</a> of calculating
     * {@link #getSofZmanKidushLevanaBetweenMoldos() half way between molad and mold} is of the opinion that Mechaber
     * agrees to his opinion. Also see the Aruch Hashulchan. For additional details on the subject, See Rabbi Dovid
     * Heber's very detailed writeup in Siman Daled (chapter 4) of <a
     * href="http://www.worldcat.org/oclc/461326125">Shaarei Zmanim</a>. This method returns the time even if it is during
     * the day when <em>Kiddush Levana</em> can't be said. Callers of this method should consider displaying <em>alos</em>
     * before this time if the zman is between <em>alos</em> and <em>tzais</em>.
     *
     * @return the Date representing the moment 15 days after the molad.
     * @see #getSofZmanKidushLevanaBetweenMoldos()
     * @see net.sourceforge.zmanim.ComplexZmanimCalendar#getSofZmanKidushLevana15Days()
     * @see net.sourceforge.zmanim.ComplexZmanimCalendar#getSofZmanKidushLevana15Days(Date, Date)
     */
    public getSofZmanKidushLevana15Days(): Date {
        const molad: Date = this.getMoladAsDate();

        const moment: Moment = MomentTimezone(molad).add({days: 15});

        return moment.toDate();
    }

    /**
     * Returns the Daf Yomi (Bavli) for the date that the calendar is set to. See the
     * {@link HebrewDateFormatter#formatDafYomiBavli(Daf)} for the ability to format the daf in Hebrew or transliterated
     * masechta names.
     *
     * @return the daf as a {@link Daf}
     */
    public getDafYomiBavli(): Daf {
        return YomiCalculator.getDafYomiBavli(this);
    }

    /**
     * Returns the Daf Yomi (Yerushalmi) for the date that the calendar is set to. See the
     * {@link HebrewDateFormatter#formatDafYomiYerushalmi(Daf)} for the ability to format the daf in Hebrew or transliterated
     * masechta names.
     *
     * @return the daf as a {@link Daf}
     */
    public getDafYomiYerushalmi(): Daf {
        return YerushalmiYomiCalculator.getDafYomiYerushalmi(this);
    }

    /**
     * @see Object#equals(Object)
     */
    public equals(object: object): boolean {
        if (this === object) {
            return true;
        }
        if (!(object instanceof JewishCalendar)) {
            return false;
        }
        const jewishCalendar: JewishCalendar = object as JewishCalendar;
        return this.getAbsDate() === jewishCalendar.getAbsDate() && this.getInIsrael() === jewishCalendar.getInIsrael();
    }
}
