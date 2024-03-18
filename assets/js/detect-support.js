(function() { "use strict";
	var reJS = new RegExp( "(^|\\s)no-js(\\s|$)" );
	var className = document.documentElement.className.replace( reJS, "$1js$2" ); // Change `no-js` to `js`

	if ( ! className.match( "customizing" ) ) {
		var scheme = localStorage.getItem( "colorSchemeOperali" );
		if ( null !== scheme ) {
			document.documentElement.setAttribute( "data-scheme", scheme );
		} else {
			var defaultScheme = document.documentElement.getAttribute( "data-scheme" );
			if ( ! defaultScheme ) {
				// if no default scheme set, use OS preference
				if ( window.matchMedia ) {
					var matchDark = window.matchMedia( "(prefers-color-scheme: dark)" );
					var updateColorSchemeHandler = function (e) {
						if ( matchDark.matches ) {
							document.documentElement.setAttribute( "data-scheme", "alt" );
						} else {
							document.documentElement.removeAttribute( "data-scheme" );
						}
					};
					matchDark.addEventListener( "change", updateColorSchemeHandler );
					updateColorSchemeHandler();
				}
			}
		}
	}

	function checkCSSSupport( fName ) {
		var pref = [ "Webkit", "Moz", "ms", "O" ];
		var el = document.createElement( "div" );

		if ( el.style[fName] !== undefined ) {
			return true;
		} else {
			for( var i = 0; i < pref.length; i++ ) {
				if ( el.style[ pref[i] + fName.charAt(0).toUpperCase() + fName.substr(1) ] !== undefined ) {
					return true;
				}
			}
		}
		return false;
	}

	className += ( ( "ontouchstart" in window ) || window.DocumentTouch && document instanceof DocumentTouch ) ? " touchevents" : " no-touchevents";

	className += checkCSSSupport( "transition" ) ? " csstransitions" : " no-csstransitions";

	document.documentElement.className = className;
})();
