jQuery-mousecenter
==================

Trigger special events when mouse enter / leave element center area.

You can specify a distance that define the center area, it can be an integer or 
a function taking cursor coordinates x,y relative to center as arguments and returning a boolean.

The distance is passed in or as data argument when you bind your function.

Usage exemples:
```javascript
$( 'selector' )

	// Default distance is 50 pixels, center area is a 50px radius circle.
	.centermouseenter( function () {
		... your code ...
	} )

	// Distance integer as data argument, center area is a 20px radius circle.
	.centermouseleave( 20, function () {
		... your code ...
	} )

	// Distance in data argument, center area is a 20px radius circle.
	.centermouseenter( { distance: 20, customdata: 'foo' }, function () {
		... your code ...
	} )
	;
var square40 = function ( x, y ) {
	return 20 >= Math.abs( x ) && 20 >= Math.abs( y );
};
$( 'selector' )
	// Distance function as data, center area is a 2 * 20px side square.
	// You can pass function in data argument as well.
	.centermouseleave( square40, function () {
		... your code ...
	} )
	;
// For example clarity sake, i used the square40 plain function
// But you can use $.centermouse( 'square', size ) to easily create function for various "square size",
// In this exemple: square40 === $.centermouse( 'square', 20 )
// You can extend $.centermouse to create new resizable shapes (@see end of jquery.centermouse.js)

```
