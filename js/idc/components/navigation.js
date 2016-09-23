/**
 * @fileOverview Navigation plugin
 * @author Juan David Andrade <juandavidandrade@gmail.com>
 * @version 0.1
 */

/*global jQuery:true, $:true, Prefixr */
(function(idc, $) {
	'use strict';

	/**
	 * Represents a Navigation component instance
	 * @constructor
	 * @return {Object} Exposed methods
	 */
	idc.Navigation = function(selector, options) {

		/**
		 * Main Element
		 * @type {HTMLElement}
		 */
		var element,

			menuItems,
			
			submenuItems,

			items,

			headerHeight = 80,

			numItems,

			menu,

			/**
			* Scroll optimization
			* @type {Number}
			*/
			timerID,

			currentIndex = 0,

			isScrolling = false,

			lastScroll = 0,

			/**
			 * Default Settings
			 * @type {Object}
			 */
			SETTINGS = {
				active: 'active',
				items: '.section',
				menu: '.menu-btn',
				menuItems: '.menu .menu-item',
				submenuItems: '.menu-sub a',
				onSubOpen: undefined,
				changed: function(){}
			},
			/**
			 * Module Templates
			 * @type {Object}
			 */
			TEMPLATES = {
			};
		/**
		 * @constructs Dropdown
		 */
		(function() {
			$.extend(SETTINGS, options);
			init();
		})();

		/**
		 * Initialize component
		 */
		function init() {
			element = $(selector);

			menu = $(SETTINGS.menu);
			menuItems = $(SETTINGS.menuItems);
			submenuItems = $(SETTINGS.submenuItems);
			items = $(SETTINGS.items);

			headerHeight = idc.utils.mobileBreak() ? 0 : element.height();

			numItems = items.length;

			if (idc.utils.mobileBreak()) {
				setMenu();
			}

			addEventListeners();
		}

		/**
		 * Add event handlers
		 * @private
		 */
		function addEventListeners() {
			menu.on(idc.Input.CLICK, menu_clickHandler);
			menuItems.find('> a').on(idc.Input.CLICK, menuItems_clickHandler);
			submenuItems.on(idc.Input.CLICK, submenuItems_clickHandler);
			$(window).on('scroll', window_scrollHandler);
			$(window).on(idc.Input.RESIZE, window_resizeHandler);
		}

		function hideMenu(force) {
			$('.wrapper')[0].style[Prefixr.transform] = 'none';
			if (force) {
				$('.menu')[0].style[Prefixr.transform] = 'none';
			}
			$('.wrapper').off(idc.Input.CLICK);
			$('body').removeClass('menu-open');
		}

		function toggleMenu() {
			if (!idc.utils.mobileBreak()) {
				$('.wrapper')[0].style[Prefixr.transform] = 'none';
				return;
			}
			
			var x = $(window).width() * 0.9;

			// hide menu
			if ($('body').hasClass('menu-open')) {
				hideMenu();
			// show menu
			} else {
				$('.wrapper')[0].style[Prefixr.transform] = 'translate3d(' + x + 'px, 0, 0)';
				setTimeout(function() {
					$('.wrapper').on(idc.Input.CLICK, function(e) {
						toggleMenu();
					});
				}, 500);

				$('body').addClass('menu-open');
			}

			
		}

		function snapToGrid() {
			scrollToIndex(currentIndex);
		}

		
		function changeTransition(time) {
			$('.menu')[0].style[Prefixr.transition] = 'all ' + time + 's';
		}

		function setMenu() {
			changeTransition(0);
			$('.menu')[0].style[Prefixr.transform] = 'translate3d(-' + $(window).width()*0.9 + 'px, 0, 0)';
			setTimeout(changeTransition, 500, 0.5);
		}

		function window_resizeHandler() {
			setMenu();
			hideMenu(!idc.utils.mobileBreak());
		}

		function menu_clickHandler(e) {
			e.preventDefault();
			toggleMenu();
		}

		function menuItems_clickHandler(e) {
			e.preventDefault();
			var currentItem = $(e.currentTarget),
				index = menuItems.index(currentItem.parent());

			$('.about').removeClass('about-open');
			toggleMenu();

			var delay = idc.utils.mobileBreak() ? 500 : 0;

			setTimeout(function () {
				scrollToIndex(index);
			}, delay);
		}

		function submenuItems_clickHandler(e) {
			e.preventDefault();
			
			var currentItem = $(e.currentTarget),
				link = currentItem.attr('href').replace('#', '.'),
				parentName = currentItem.closest('.menu-sub').siblings('a').attr('href').replace('#', '.'),
				index = menuItems.index(currentItem.closest(SETTINGS.menuItems));


			$('.about').removeClass('about-open');

			toggleMenu();

			var delay = idc.utils.mobileBreak() ? 500 : 0;

			setTimeout(function () {
				scrollToIndex(index);
				// open submenu item
				if (typeof SETTINGS.onSubOpen === 'function') {
					SETTINGS.onSubOpen(link, parentName);
				}
			}, delay);
		}

		function scroll() {
			var currentScroll = $(window).scrollTop(),
				index = currentIndex,
				lastInd = Math.round(lastScroll / idc.size),
				curInd = Math.round(currentScroll / idc.size),
				delta = Math.abs(lastInd - curInd);

			if (delta === 0) {
				delta = 1;
			}


			// scrolls down
			if (currentScroll > lastScroll) {
				index += delta;
			// scrolls up
			} else {
				index -= delta;
			}
			
			// set boundaries
			if (index < 0) {
				index = 0;
			}

			if (index >= numItems) {
				index = numItems-1;
			}

			//var index = Math.round($(window).scrollTop() / idc.size);

			scrollToIndex(index);
		}

		function scrollToIndex(index) {

			var section = $(items[index]),
				duration = 150 * (Math.abs(index - currentIndex) + 1);

			$('.menu li').removeClass(SETTINGS.active);
			$(menuItems[index]).addClass(SETTINGS.active);
			
			$('body, html').animate({
				'scrollTop': section.offset().top - headerHeight
			}, {
				duration : duration,
				start: function() {
					isScrolling = true;
				},
				complete: function() {
					lastScroll = $(window).scrollTop();
					$('body').clearQueue();
					setTimeout(function() {
						isScrolling = false;
					}, 200);
				}
			});

			if (index !== currentIndex) {
				SETTINGS.changed(index, section.attr('id'));
			}

			currentIndex = index;
		}

		function window_scrollHandler() {
			if (isScrolling) {
				return;
			}

			clearTimeout(timerID);
			timerID = setTimeout(scroll, 100);
		}

		// public methods
		return {
			toggleMenu: toggleMenu,
			scrollToIndex: scrollToIndex,
			snapToGrid: snapToGrid
		};
	};

}(window.idc = window.idc || {}, jQuery || $));
