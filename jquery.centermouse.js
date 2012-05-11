/**
 * jQuery mouseCenter v1.0.0
 * 
 * Author: Adrien Gibrat <adrien.gibrat@gmail.com>
 * 
 * Trigger special events when mouse enter / leave element center area.
 * 
 * You can specify a distance that define the center area, it can be an integer or 
 * a function taking cursor coordinates x,y relative to center as arguments and returning a boolean.
 * The distance is passed in or as data argument when you bind your function.
 * 
 * Usage exemples:
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

 */
;( function ( $ ) {
	/**
	 * Add function binding to JavaScript prior 1.8.5
	 * @see https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Function/bind
	 */
	if ( ! Function.prototype.bind ) {
		Function.prototype.bind = function ( context ) {
			var args  = Array.prototype.slice.call( arguments, 1 ), 
				bind  = this, 
				nop   = function () {},
				bound = function () {
					return bind.apply( 
						this instanceof nop ? this : context || window, 
						args.concat( Array.prototype.slice.call( arguments ) )
					);
				};
			nop.prototype   = this.prototype;
			bound.prototype = new nop();
			return bound;
		};
	}
	var 
		/**
		 * Call event type handler when cursor enter/leave element center area
		 * @param type string, type of event (enter or leave)
		 * @param distance int|function, distance in pixel or function returning if given point (x, y) is within an area
		 * @param handleObj object, original event handle
		 * @param event object, jQuery event
		 * @return mixed
		 */
		handler = function ( type, distance, handleObj, event ) {
			var self     = $( this )
				// All states of binded events
				, state  = self.data( 'centermouse' )
				// Previous state
				, inside = state[ handleObj.guid ]
				// Default center area is a circle
				, within = $.isFunction( distance ) ? distance : $.centermouse( 'circle', distance )
				, offset = self.offset()
			;
			// Is within area relative to center 
			if ( within( event.pageX - offset.left - self.width() / 2, event.pageY - offset.top - self.height() / 2 ) ) {
				if ( ! inside ) {
					// Store new state
					state[ handleObj.guid ] = true;
					if ( 'enter' === type ) {
						event.type = 'centermouseenter';
						return handleObj.handler.call( this, event );
					}
				}
			} else {
				if ( inside ) {
					// Store new state
					state[ handleObj.guid ] = false;
					if ( 'leave' === type ) {
						event.type = 'centermouseleave';
						return handleObj.handler.call( this, event );
					}
				}
			}
		};
	/**
	 * Add events to jQuery
	 */
	$.each( [ 'enter', 'leave' ], function ( i, type ) {
		var name = 'centermouse' + type;
		// Add special event methods
		$.event.special[ name ] = {
			// Add data to store state
			setup      : function () {
				$( this )
					.data( 'centermouse', {} )
				;
			}
			// Bind special handler and init state
			, add      : function ( handleObj ) {
				var distance = ( $.isPlainObject( handleObj.data ) ? handleObj.data.distance : handleObj.data ) || 50;
				$( this )
					.bind( 'mousemove.centermouse' + handleObj.guid, handler.bind( this, type, distance, handleObj ) )
					.data( 'centermouse' )[ handleObj.guid ] = false
				;
			}
			// Unbind special handler and delete state from data
			, remove   : function ( handleObj ) {
				delete $( this )
					.unbind( 'mousemove.centermouse' + handleObj.guid )
					.data( 'centermouse' )[ handleObj.guid ]
				;
			}
			// Clean up data if state hash is empty
			, teardown : function () {
				var self = $( this );
				$.isEmptyObject( self.data( 'centermouse' ) ) && self.removeData( 'centermouse' );
			}
		};
		// Add event binding / triggering methods
		$.fn[ name ]            = function( data, fn ) {
			if ( fn == null ) {
				fn   = data;
				data = null;
			}
			return arguments.length ? this.on( name, null, data, fn ) : this.trigger( name );
		};
		// Allow binding for the $( html, props ) case
		$.attrFn[ name ]        = true;
	} );
	/**
	 * Add helper to jQuery
	 */
	$.extend( {
		centermouse: $.extend(
			/**
			 * Create function that check if a point inside a shape
			 * @param shape string, name of the shape to create (must be a helper name)
			 * @param size int, size of the shape
			 * @return function, that take point coordinates to check if it's inside the shape
			 */
			function ( shape, size ) {
				shape = arguments.callee[ shape ];
				return shape && shape.bind( size );
			}
			, {
				/**
				 * Helper function to check if a point inside a square (side = 2 * this)
				 * @param x int, x coordinate of point relative to center
				 * @param y int, y coordinate of point relative to center
				 * @return boolean, is point inside square
				 */
				square   : function ( x, y ) {
					return this >= Math.abs( x ) && this >= Math.abs( y );
				}
				/**
				 * Helper function to check if a point inside a circle (radius = 2 * this)
				 * @param x int, x coordinate of point relative to center
				 * @param y int, y coordinate of point relative to center
				 * @return boolean, is point inside circle
				 */
				, circle : function ( x, y ) {
					return this >= Math.sqrt( Math.pow( x, 2 ) + Math.pow( y, 2 ) );
				}
				// now, you can extend $.centermouse with you own shapes !
			}
		)
	} );
} )( jQuery );
