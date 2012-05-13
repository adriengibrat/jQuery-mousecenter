jQuery-mousecenter
==================

Trigger special events when mouse enter / leave element center area.

You can specify shape and distance that define the center area. 
It can be an integer, in that case the default shape is a circle,
or a function defining a shape taking cursor coordinates x,y 
relative to center of element as arguments and returning a boolean.

The shape/distance is passed in or as data argument when you bind your function: 
you can pass interger or function as data or in a hash as 'distance' property.

Usage exemples:
```javascript
$( 'selector' )

	// Default distance is 50 pixels, center area is a 50px radius circle.
	.mousecenterenter( function () {
		... your code ...
	} )

	// Distance integer as data argument, center area is a 20px radius circle.
	.mousecenterleave( 20, function () {
		... your code ...
	} )

	// Distance in data argument, center area is a 20px radius circle.
	.mousecenterenter( { distance: 20, customdata: 'foo' }, function () {
		... your code ...
	} )
	;
var square40 = function ( x, y ) {
	return 20 >= Math.abs( x ) && 20 >= Math.abs( y );
};
$( 'selector' )
	// Distance function as data, center area is a 2 * 20px side square.
	// You can pass function in data argument as well.
	.mousecenterleave( square40, function () {
		... your code ...
	} )
	;
// For example clarity sake, i used the square40 plain function
// But you can use $.mousecenter( 'square', size ) to easily create function for various "square size",
// In this exemple: square40 === $.mousecenter( 'square', 20 )
// You can extend $.mousecenter to create new resizable shapes (@see end of jquery.mousecenter.js)

```
