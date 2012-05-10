jQuery-mousecenter
==================

Trigger special events when mouse enter / leave element center area.

You can specify a distance that define the center area, it can be an integer or 
a function taking cursor coordinates x,y relative to center as arguments and returning a boolean.

The distance is passed in or as data argument when you bind your function.

Usage exemples:
```javascript
$( 'selector' )

  // default distance is 50 pixels, center area is a 50px radius circle.
	.centermouseenter( function () {
		... your code ...
	} )

	// distance integer as data argument, center area is a 20px radius circle.
	.centermouseleave( 20, function () {
		... your code ...
	} )

	// distance in data argument, center area is a 20px radius circle.
	.centermouseenter( { distance: 20, customdata: 'foo' }, function () {
		... your code ...
	} )
	;
var square40 = function ( x, y ) {
	return 20 >= Math.abs( x ) && 20 >= Math.abs( y );
};
$( 'selector' )
	// distance function as data, center area is a 2 * 20px side square.
	// you can pass function in data argument as well.
	// you can use $.centermouse( 'square', size ) to easily create function checking various "square size" :
	// in this exemple, square40 === $.centermouse( 'square', 20 )
	// you can extend $.centermouse to create new resizable shapes (@see end of file)
	.centermouseleave( square40, function () {
		... your code ...
	} )
	;
```