# v0.7.0
### Breaking Changes:
* Some of the names and types of members of the `Zman` class have been changed.

# v0.6.0
### Breaking Changes:
* Moment and Moment Timezone have been replaced with [Luxon](https://moment.github.io/luxon/index.html).  
  Any methods that previously took `Moment` instances as arguments now take Luxon class instances.
* `AstronomicalCalendar.getTimeOffset()` has been changed to a static method.

# v0.5.0
### Breaking Changes:
* The spelling has changed from `Parshah` to `Parsha`.
* `JewishCalendar.getParshahIndex()` has been renamed to `JewishCalendar.getParsha()`.
* The signatures for `HebrewDateFormatter.getTransliteratedParshiosList()` and `HebrewDateFormatter.getTransliteratedParshiosList()` have changed.

# v0.4.0
### Breaking Changes:
* The default calculator is now NOAA (af66119d).
* Options for formatting years ending in מנצפ״ך (af66119d).  
The default is now using non-final form for years ending in מנצפ״ך,
so that 5780 will be default format as תש״פ, while it can optionally
be set to format it as תש״ף.
* Removed `KosherZmanim.getZmanimXML()`.

# v0.3.1
### Bug fixes
* Fixed the UMD bundle and example for the new API.

# v0.3.0
### Breaking Changes:
* `KosherZmanim` is no longer an instantiable class, and the classes are no longer exported under `KosherZmanim.lib.*`.
Instead, everything is exported as named exports. See the Usage section in the [README](./README.md) for more details.
* Default exports have been converted to named exports.
* `KosherZmanim.getZmanimXML()` and `ZmanimFormatter.toXML()` have been deprecated.
* Fixes based on KosherJava updates may have breaking changes. For example, `ZmanimCalculator` was removed. See KosherJava for more details.
