## This project is at an alpha stage.

Things will break, and APIs will change. Do not use this in production yet.

# Introduction
Kosher Zmanim is a TS/JS port of the [KosherJava](KosherJava/zmanim) library.

# Installation
**NPM:**
```
npm install --save kosher-zmanim
```

**UMD (browser):**
```html
<script src="https://unpkg.com/kosher-zmanim/dist/kosher-zmanim.min.js"></script>
```

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
The classes are exposed as named exports. You can instatiate or extend those classes as necessary, the same way you would in Java.

```javascript
const zmanimCalendar = new KosherZmanim.ZmanimCalendar();
```

#### Simple usage
Alternatively, there is a `getZmanimJson()` utility method.

```javascript
const zmanim = KosherZmanim.getZmanimJson(options);
```
(See [here](/examples/frontend-example/frontend-example.html) for an example).

##### `options` object
The `options` object has the following structure:
```
{
    date: Date | string | number;
    timeZoneId: string;
    locationName: string;
    latitude: number;
    longitude: number;
    elevation?: number;
    complexZmanim?: boolean
}
```

## Note about how zmanim are calculated
The zmanim are calculated based on the day of year, which is not dependent on timezone. This means that the zmanim will be calculated for the location selected, on the day of year passed, and then displayed at the equivalent time in the selected timezone.

# Breaking changes from KosherJava
* `AstronomicalCalendar.getTemporalHour()` returns `null` instead of `Long.MIN_VALUE` if the calculations cannot be completed.
* JS/TS does not have a parallel to Java's `Long.MIN_VALUE`, so `Long_MIN_VALUE` is set to `NaN`.
