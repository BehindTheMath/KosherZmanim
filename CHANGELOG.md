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

