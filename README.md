## This project is at an alpha stage.

Things will break, and APIs will change. Do not use this in production yet.

# Introduction
Kosher Zmanim is a TS/JS port of the [KosherJava](KosherJava/zmanim) library.

# Installation
**Node:**
```
npm install --save kosher-zmanim
```

**Browser:**
```html
<script src="https://rawgit.com/BehindTheMath/KosherZmanim/dev/dist/kosher-zmanim.min.js"></script>
```

# Usage and Documentation
#### Library:
**Node / ES6:**
```javascript
import KosherZmanim from "kosher-zmanim";

const zmanimcalendar = new KosherZmanim.lib.ZmanimCalendar;
```

**ES5:**
```javascript
var zmanimcalendar = new KosherZmanim.default.lib.ZmanimCalendar;
```
The KosherJava library has been ported to JS, following the original API as close as possible. This is exposed as either `KosherZmanim.lib.*` or `KosherZmanim.default.lib.*`, following the above examples. You can instatiate or extend those classes as necessary, the same way you would in Java.

#### Simple usage
Alternatively, KosherZmanim can be instatiated, and then there are 2 utility methods: `getZmanimJson()`, and `getZmanimXML()`

**Node / ES6:**
```javascript
import KosherZmanim from "kosher-zmanim";

const zmanim = new KosherZmanim(options);
console.dir(zmanim.getZmanimJson());
```

**ES5:**
```javascript
var zmanim = new KosherZmanim.default(options);
console.dir(zmanim.getZmanimJson());
```
(See [here](/examples/frontend-example/frontend-example.html) for an example).

##### `options` object
The options object has the following structure:
```
{
    date: Date | string | number;
    timeZoneId: string;
    locationName: string;
    latitude: number;
    longitude: number;
    elevation?: number;
}
```

# Breaking changes from KosherJava
* `AstronomicalCalendar.getTemporalHour()` returns `null` instead of `Long.MIN_VALUE` if the calculations cannot be completed.