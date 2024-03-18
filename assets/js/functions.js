"use strict";

// Handle mobile hamburger toggle.
document.querySelector( "#menu-toggle" ).addEventListener( "click", (e) => {
	document.body.classList.toggle( "mobile-menu-opened" );
	e.preventDefault();
	return false;
});

document.querySelectorAll( ".main-navigation .menu-item-has-children > a" ).forEach( menu_link => {
	menu_link.addEventListener( "click", (e) => {
		// check if we are in mobile view (if mobile hamburger toggle is visible)
		if ( null !== document.querySelector( "#menu-toggle" ).offsetParent ) {
			// Handle sub-menus visibility for mobile view
			var parent = e.target.parentElement;
			if ( ! parent.classList.contains( "menu-item-has-children" ) ) {
				parent = parent.parentElement;
			}
			parent.classList.toggle( "collapse" );
			e.preventDefault();
			return false;
		} else {
			if ( window.matchMedia( "(any-hover: none)" ).matches ) {
				// prevent click events on touch based devices
				e.preventDefault();
				return false;
			}
		}
	})
});
// By default, collapse current sub-menus for mobile view
document.querySelectorAll( ".main-navigation .current-menu-parent, .main-navigation .current-menu-ancestor" ).forEach( menu_item => {
	menu_item.classList.add( "collapse" );
});

// Handle hover events for menu items
document.querySelectorAll( ".main-navigation li:not(.menu-item-scheme,.menu-item-search,.menu-item-cart)" ).forEach( menu_item => {
	menu_item.addEventListener( "pointerenter", (e) => {
		if ( ! window.matchMedia( "(any-hover: none)" ).matches ) {
			e.target.classList.add( "hover" );
		}
	});
	menu_item.addEventListener( "pointerleave", (e) => {
		if ( ! window.matchMedia( "(any-hover: none)" ).matches ) {
			e.target.classList.remove( "hover" );
		}
	});
});

// Toggle visibility of dropdowns on keyboard focus events.
function menuItemBlurFocus( el, type ) {
	var closest_hover = el.closest( ".hover" );
	if ( null === closest_hover ) {
		document.querySelectorAll( ".main-navigation .menu-item-has-children.hover" ).forEach( el_hover => {
			if ( el_hover !== closest_hover ) {
				el_hover.classList.remove( "hover" );
			}
		});
	}
	if ( el.classList.contains( "menu-item-has-children" ) ) {
		el.classList.add( "hover" );
	}
}
document.querySelectorAll( ".main-navigation li > a, .site-identity a, .main-navigation .menu-item-search input[type=search], .site-header .social-navigation a" ).forEach( item => {
	item.addEventListener( "focus", (e) => {
		if ( null === document.querySelector( "#menu-toggle" ).offsetParent ) {
			menuItemBlurFocus( e.target.parentElement, "focus" );
			e.preventDefault();
		}
	});
	item.addEventListener( "blur", (e) => {
		if ( null === document.querySelector( "#menu-toggle" ).offsetParent ) {
			menuItemBlurFocus( e.target.parentElement, "blur" );
			e.preventDefault();
		}
	});
});

// // Toggle visibility of dropdowns if touched outside the menu area.
document.addEventListener( "click", (e) => {
	if ( null === e.target.closest( ".main-navigation" ) ) {
		document.querySelectorAll( ".main-navigation .menu-item-has-children.hover" ).forEach( el_hover => {
			el_hover.classList.remove( "hover" );
		});
	}
});

// Toggle color scheme (default or alt, see also detect-support.js).
document.querySelector( ".main-navigation .menu-item-scheme > a" ).addEventListener( "click", (e) => {
	var current_scheme = document.documentElement.getAttribute( "data-scheme" );
	if ( ! current_scheme || "default" === current_scheme ) {
		current_scheme = "alt";
	} else {
		current_scheme = "default";
	}
	document.documentElement.setAttribute( "data-scheme", current_scheme );
	localStorage.setItem( "colorSchemeOperali", current_scheme );

	e.preventDefault();
	return false;
});

// Handle quantity fields (custom -/+ buttons in a input[type=number])

document.querySelectorAll( ".quantity .quantity-change" ).forEach( quantityChange => {
	quantityChange.addEventListener( "click", (e) => {
		var input    = e.target.parentElement.querySelector( "input[type=number]" );
		var min      = input.getAttribute( "min" );
		var max      = input.getAttribute( "max" );
		var oldValue = parseFloat( input.value );
		var newVal;
		if ( ! oldValue ) {
			oldValue = parseFloat( input.getAttribute( "placeholder" ) );
			if ( ! oldValue ) {
				oldValue = 0;
			}
		}

		if ( e.target.classList.contains( "decrease" ) ) {
			if ( ! min ) {
				min = 1;
			}
			if ( oldValue <= min ) {
				return;
			} else {
				newVal = oldValue - 1;
			}
		} else {
			if ( ! max ) {
				max = Number.MAX_SAFE_INTEGER;
			}
			if ( oldValue >= max ) {
				return;
			} else {
				newVal = oldValue + 1;
			}
		}

		input.value = newVal;
		input.dispatchEvent( new Event( "change" ) );

		e.preventDefault();
	});
});

// Handle tab navigation with hash links.
var custom_tabs = document.querySelectorAll( ".block-tabs" );
if ( custom_tabs.length > 0 ) {
	custom_tabs.forEach( tabs => {
		tabs.querySelectorAll( ":scope > ul a" ).forEach( tab_link => {
			tab_link.addEventListener( "click", (e) => {
				if ( e.target.classList.contains( "is-active" ) ) {
					e.preventDefault();
					return false;
				}

				var target = document.querySelector( e.target.getAttribute( "href" ) );
				target.setAttribute( "data-id", target.getAttribute( "id" ) );
				target.removeAttribute( "id" );
			});
		});
		tabs.classList.add( "loaded" );
	});

	window.addEventListener( "hashchange", (e) => {
		if ( ! window.location.hash ) {
			return;
		}

		var active_tab_content = document.querySelector( '.block-tab-content[data-id="' + window.location.hash.substring( 1 ) + '"]' );
		if ( null === active_tab_content ) {
			return;
		}

		active_tab_content.setAttribute( "id", active_tab_content.getAttribute( "data-id" ) );

		var tab_container = active_tab_content.parentElement;
		tab_container.querySelectorAll( ".block-tab-content:not(#" + active_tab_content.getAttribute( "data-id" ) + ")" ).forEach( inactive_container => {
			inactive_container.classList.remove( "is-active" );
		});
		active_tab_content.classList.add( "is-active" );

		tab_container.querySelectorAll( ":scope > ul a" ).forEach( tab_link => {
			if ( tab_link.getAttribute( "href" ) == window.location.hash ) {
				tab_link.classList.add( "is-active" );
			} else {
				tab_link.classList.remove( "is-active" );
			}
		});
	});

	if ( window.location.hash ) {
		var active_tab = document.querySelector( '.block-tabs > ul a[href="' + window.location.hash + '"]' );
		if ( null !== active_tab ) {
			active_tab.dispatchEvent( new Event( "click" ) );
			window.dispatchEvent( new Event( "hashchange" ) );
		}
	}
}

// Handle collapsible elements
var custom_collapses = document.querySelectorAll( ".block-collapse > a" );
if ( custom_collapses.length > 0 ) {
	var updateCollapsibleBoxes = function (e) {
		document.querySelectorAll( ".block-collapse.is-opened > a" ).forEach( collapse => {
			var target = document.querySelector( collapse.getAttribute( "href" ) );
			target.style.maxHeight = target.scrollHeight + "px";
		});
	}
	custom_collapses.forEach( collapse => {
		collapse.addEventListener( "click", (e) => {
			var target = document.querySelector( collapse.getAttribute( "href" ) );
			collapse.parentElement.classList.toggle( "is-opened" );
			if ( collapse.parentElement.classList.contains( "is-opened" ) ) {
				target.style.maxHeight = ( target.scrollHeight + 1 ) + "px";
				if ( collapse.parentElement.parentElement.classList.contains( "style-accordion" ) ) {
					for ( let sibling of collapse.parentElement.parentNode.children ) {
						if ( sibling !== collapse.parentElement && sibling.classList.contains( "is-opened" ) ) {
							sibling.classList.remove( "is-opened" );
							var sibling_link = sibling.querySelector( sibling.querySelector( ":scope > a").getAttribute( "href" ) );
							sibling_link.style.maxHeight = 0;
						}
					}
				}
			} else {
				target.style.maxHeight = 0;
			}

			e.preventDefault();
		});
	});

	window.addEventListener( "resize", updateCollapsibleBoxes );
	updateCollapsibleBoxes();
}

// Performant smooth scrolling using requestAnimationFrame
function smoothScrollTo( yPos, animDuration = 1000 ) {
	var startY = window.pageYOffset;
	var difference = yPos - startY;
	var startTime = window.performance.now();

	function smoothScrollStep() {
		var progress = ( window.performance.now() - startTime ) / animDuration - 1;
		var amount = progress * progress * progress + 1; // easeOutCubic
		window.scrollTo({ top: startY + amount * difference });
		if ( progress < 0 ) {
			window.requestAnimFrame( smoothScrollStep );
		}
	}
	smoothScrollStep();
}

// Toggle go-to-top visibility and avoid using any event on mobile devices (for better performance).
var scrollTopButton = document.querySelector( "#scroll-to-top" );
if ( null !== scrollTopButton ) {
	var scrollTopAction = false;
	var scrollTopDuration = getComputedStyle(document.body).getPropertyValue( "--custom--animation-duration-more" );
	if ( scrollTopDuration ) {
		scrollTopDuration = parseInt( parseFloat( scrollTopDuration ) * ( scrollTopDuration.indexOf( "ms" ) !== -1 ? 1 : 1000 ), 10);
	} else {
		scrollTopDuration = 1000;
	}

	// Scroll to top functionality.
	scrollTopButton.addEventListener( "click", (e) => {
		scrollTopButton.classList.add( "scrolling" );
		scrollTopButton.classList.remove( "active" );
		smoothScrollTo( 0, scrollTopDuration );
		setTimeout(function(){
			scrollTopButton.classList.remove( "scrolling" );
		}, scrollTopDuration);
		e.preventDefault();
		return false;
	});

	var scrollTopLimit = 200;
	var scrollTopHandler = function (e) {
		scrollTopButton.classList.toggle( "active", window.pageYOffset > scrollTopLimit );
	};
	var scrollResizeHandler = function (e) {
		if ( scrollTopButton.classList.contains( "scrolling" ) ) return;
		if ( null === document.querySelector( "#menu-toggle" ).offsetParent ) {
			if ( ! scrollTopButton.classList.contains( "watching" ) ) {
				scrollTopButton.classList.add( "watching" );
				window.addEventListener( "scroll", scrollTopHandler, false );
				scrollTopHandler();
			}
		} else {
			if ( scrollTopButton.classList.contains( "watching" ) ) {
				scrollTopButton.classList.remove( "watching" );
				window.removeEventListener( "scroll", scrollTopHandler, false );
			}
		}
	};
	window.addEventListener( "resize", scrollResizeHandler );
	scrollResizeHandler();
}

if ( typeof Fancybox !== "undefined" ) {
	Fancybox.defaults.hideScrollbar = false;
	//jQuery( ".single-attachment .attachment a" ).has( "img" ).attr( "data-fancybox", "" );
}

window.requestAnimFrame = ( function() {
	return window.requestAnimationFrame  ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame    ||
		window.oRequestAnimationFrame      ||
		window.msRequestAnimationFrame     ||
		function( callback ){
			window.setTimeout( callback, 1000 / 60 );
		};
})();
