## This project is at an alpha stage.

Things will break, and APIs might change. Be cautious using this in production.
Additionally, not all methods have been tested for accuracy.

# Introduction
Kosher Zmanim is a TS/JS port of the [KosherJava](KosherJava/zmanim) library.

# Installation
**NPM:**
```
npm install kosher-zmanim
```

**UMD (browser):**
```html
<script src="https://unpkg.com/kosher-zmanim/dist/kosher-zmanim.min.js"></script>
```

It is highly recommended that you pin the version (e.g. `https://unpkg.com/kosher-zmanim@0.6.0/dist/kosher-zmanim.min.js`),
so updates don't break your app.

# Usage and Documentation
#### Importing
**ES6 modules / Typescript:**
```javascript
import * as KosherZmanim from "kosher-zmanim";
```
Or:
```javascript
import { ComplexZmanimCalendar, getZmanimJson } from "kosher-zmanim";
```

**CommonJS modules:**
```javascript
const KosherZmanim = require("kosher-zmanim");
```
Or:
```javascript
const { ComplexZmanimCalendar, getZmanimJson } = require("kosher-zmanim");
```

**UMD (browser):**

For UMD, a global `KosherZmanim` object is exposed.

#### Library Usage:
The KosherJava library has been ported to JS, following the original API as close as possible.
The classes are exposed as named exports. You can instantiate or extend those classes as necessary, the same way you would in Java.

```javascript
const zmanimCalendar = new KosherZmanim.ZmanimCalendar();
```

See the [KosherJava API documentation](https://kosherjava.com/zmanim/docs/api/index.html?overview-summary.html) for more details.

#### Simple usage
Alternatively, there is a `getZmanimJson()` utility method.

```javascript
const zmanim = KosherZmanim.getZmanimJson(options);
```

Check out the [demo](https://behindthemath.github.io/KosherZmanim/), and look at the [code](./docs/index.html) to see an example of how it's used.

##### `options` object
The `options` object has the following structure and defaults:
```
{
    date: Date | string | number = new Date(),
    timeZoneId: string
    locationName?: string,
    latitude: number,
    longitude: number,
    elevation?: number = 0,
    complexZmanim?: boolean = false,
}
```

## Note about how zmanim are calculated
This library uses [Luxon](https://moment.github.io/luxon) as a date/time library, since
Javascript's `Date` object does not support setting timezones other than the system timezone.
All class methods that return a `DateTime` object will be in UTC.

# Breaking changes from KosherJava
* `AstronomicalCalendar.getTemporalHour()` returns `null` instead of `Long.MIN_VALUE` if the calculations cannot be completed.
* JS/TS does not have a parallel to Java's `Long.MIN_VALUE`, so `Long_MIN_VALUE` is set to `NaN`.
* The following methods are not supported:
  * `AstronomicalCalendar.toString()`
  * `AstronomicalCalendar.toJSON()`
  (Use `ZmanimFormatter.toJSON(astronomicalCalendar)` instead).
  * `AstronomicalCalculator.getDefault()`
  (Use `new NOAACalculator()` instead).
  * `JewishCalendar.getDafYomiBavli()`
  (Use `YomiCalculator.getDafYomiBavli(jewishCalendar)` instead).
  * `JewishCalendar.getDafYomiYerushalmi()`
  (Use `YerushalmiYomiCalculator.getDafYomiYerushalmi(jewishCalendar)` instead).
  * `Time.toString()`
  (Use `new ZmanimFormatter(TimeZone.getTimeZone("UTC")).format(time)` instead).
  * `ZmanimFormatter.toXML()`
* Some method signatures are different, due to the differences between Java and JS.
* The `Zman` class uses public members instead of getters and setters.
