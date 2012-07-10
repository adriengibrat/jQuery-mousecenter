/**
 * jQuery mouseCenter v1.1.1
 * 
 * Author: Adrien Gibrat <adrien.gibrat@gmail.com>
 * 
 * Trigger special events when mouse enter / leave element center area.
 * 
 * You can specify shape and distance that define the center area. 
 * It can be an integer, in that case the default shape is a circle,
 * or a function defining a shape taking cursor coordinates x,y 
 * relative to center of element as arguments and returning a boolean.
 * 
 * The shape/distance is passed in or as data argument when you bind your function: 
 * you can pass integer and function as data or in a hash as 'distance' property.
 * 
 * Usage examples:
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
// In this example: square40 === $.mousecenter( 'square', 20 )
// You can extend $.mousecenter to create new resizable shapes (@see end of jquery.mousecenter.js)

 */
( function ( $ ) {
	var 
		namespace = 'mousecenter'
		/**
		 * Call event type handler when cursor enter/leave element center area
		 * @param type string, type of event (enter or leave)
		 * @param distance int|function, distance in pixel or function returning if given point (x, y) is within an area
		 * @param handleObj object, original event handle
		 * @param event object, jQuery event
		 * @return mixed
		 */
		, handler = function ( type, distance, handleObj, event ) {
			var self     = $( this )
				// All states of binded events
				, state  = self.data( namespace )
				// Previous state
				, inside = state[ handleObj.guid ]
				// Default center area is a circle
				, within = $.isFunction( distance ) ? distance : $.mousecenter( 'circle', distance )
				, offset = self.offset()
			;
			// Is within area relative to center 
			if ( within( event.pageX - offset.left - self.width() / 2, offset.top - event.pageY + self.height() / 2 ) ) {
				if ( ! inside ) {
					// Store new state
					state[ handleObj.guid ] = true;
					if ( 'enter' === type ) {
						event.type = namespace + type;
						return handleObj.handler.call( this, event );
					}
				}
			} else {
				if ( inside ) {
					// Store new state
					state[ handleObj.guid ] = false;
					if ( 'leave' === type ) {
						event.type = namespace + type;
						return handleObj.handler.call( this, event );
					}
				}
			}
		};
	/**
	 * Add events to jQuery
	 */
	$.each( [ 'enter', 'leave' ], function ( i, type ) {
		var name = namespace + type;
		// Add special event methods
		$.event.special[ name ] = {
			// Add data to store state
			setup      : function () {
				$( this )
					.data( namespace, {} )
				;
			}
			// Bind special handler and init state
			, add      : function ( handleObj ) {
				var distance = ( $.isPlainObject( handleObj.data ) ? handleObj.data.distance : handleObj.data ) || 50;
				$( this )
					.bind( 'mousemove.' + namespace + handleObj.guid, $.proxy( handler, this, type, distance, handleObj ) )
					.data( namespace )[ handleObj.guid ] = false
				;
			}
			// Unbind special handler and delete state from data
			, remove   : function ( handleObj ) {
				delete $( this )
					.unbind( 'mousemove.' + namespace + handleObj.guid )
					.data( namespace )[ handleObj.guid ]
				;
			}
			// Clean up data if state hash is empty
			, teardown : function () {
				var self = $( this );
				$.isEmptyObject( self.data( namespace ) ) && self.removeData( namespace );
			}
		};
		// Add event binding / triggering methods
		$.fn[ name ]            = function( data, fn ) {
			if ( ! fn ) {
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
	$[ namespace ] = $.extend(
		/**
		 * Create function that check if a point inside a shape
		 * @param shape string, name of the shape to create (must be a helper name)
		 *           or array list of shape or shape & size (ex: ['top',['square',60]])
		 * @param size int, size of the shape ( but you could pass any object for your custom shape helper)
		 * @param elment dom, element will be the shape function context
		 * @return function, that take point coordinates to check if it's inside the shape
		 */
		function ( shape, size, elment ) {
			if ( $.isArray( shape ) )
				return function ( x, y ) {
					var within;
					$.each( shape, function ( index, item ) {
						var fn = $.isArray( item ) ? 
							$[ namespace ]( item[0], item[1] ) : 
							$[ namespace ]( item, size );
						return within = fn && fn( x, y );
					} );
					return within;
				}
			return ( shape = $[ namespace ][ shape ] ) && $.proxy( shape, elment, size );
		}
		, {
			/**
			 * Helper function to check if a point inside a square (side = 2 * this)
			 * @param halfside int, halfside of the square
			 * @param x int, x coordinate of point relative to center
			 * @param y int, y coordinate of point relative to center
			 * @return boolean, is point inside square
			 */
			square   : function ( halfside, x, y ) {
				return halfside >= Math.abs( x ) && halfside >= Math.abs( y );
			}
			/**
			 * Helper function to check if a point inside a circle
			 * @param radius int, radius of the circle
			 * @param x int, x coordinate of point relative to center
			 * @param y int, y coordinate of point relative to center
			 * @return boolean, is point inside circle
			 */
			, circle : function ( radius, x, y ) {
				return radius >= Math.sqrt( Math.pow( x, 2 ) + Math.pow( y, 2 ) );
			}
			/**
			 * Helper function to check if a point inside a square losange
			 * @param halfdiagonal int, halfdiagonal of the losange
			 * @param x int, x coordinate of point relative to center
			 * @param y int, y coordinate of point relative to center
			 * @return boolean, is point inside losange
			 */
			, losange : function ( halfdiagonal, x, y ) {
				return ( Math.abs( y ) + Math.abs( x ) ) / halfdiagonal < 1;
			}
			/**
			 * Helper functions to check point position relative to center
			 * @param limit int, limit zone (use negative number to invert)
			 * @param x int, x coordinate of point relative to center
			 * @param y int, y coordinate of point relative to center
			 * @return boolean, is point on top / right / bottom / left
			 */
			, top    : function ( limit, x, y ) {
				return limit < 0 && -limit < y || 0 < y && y < limit;
			}
			, right  : function ( limit, x ) {
				return limit < 0 && -limit < x || 0 < x && x < limit;
			}
			, bottom : function ( limit, x, y ) {
				return limit < 0 && limit > y || 0 > y && y > -limit;
			}
			, left   : function ( limit, x ) {
				return limit < 0 && limit > x || 0 > x && x > -limit;
			}
		}
	);
} )( jQuery );
