/**
 * @fileOverview Accordion plugin
 * @author Juan David Andrade <juandavidandrade@gmail.com>
 * @version 0.1
 */

/*global jQuery:true, $:true */
(function(idc, $) {
	'use strict';

	/**
	 * Represents a Accordion component instance
	 * @constructor
	 * @return {Object} Exposed methods
	 */
	var Accordion = function(selector, options) {

		/**
		 * Main Element
		 * @type {HTMLElement}
		 */
		var element,
			
			selectedItem,

			items,

			link,

			content,

			numItems,

			/**
			 * Default Settings
			 * @type {Object}
			 */
			SETTINGS = {
				active: 'active',
				items: '.item',
				link: '.header',
				content: '.body',
				opened: undefined
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

			items = element.find(SETTINGS.items);
			numItems = items.length;

			link = items.find(SETTINGS.link);
			
			addEventListeners();
		}

		/**
		 * Add event handlers
		 * @private
		 */
		function addEventListeners() {
			link.on('click', link_clickHandler);			
		}

		function open(name) {
			openSection(items.filter(name));
		}

		function close() {
			element.removeClass('open');
		}

		function transitionendHandler(e) {
			if (e.originalEvent.propertyName === 'width' || e.originalEvent.propertyName === 'height') {
				if (typeof SETTINGS.opened === 'function') {
					SETTINGS.opened($(e.target));
				}
			}
		}

		function openSection(currentItem) {
			if (idc.utils.mobileBreak()) {
				link.height($(window).height() / numItems);
			} else {
				link.width($(window).width() / numItems);
			}

			items.off(Prefixr.transitionend, transitionendHandler);

			if (currentItem.hasClass(SETTINGS.active)) {

				element.removeClass('open');
				items.removeClass(SETTINGS.active);
			// open accordion
			} else {
				items.removeClass(SETTINGS.active);
				currentItem.on(Prefixr.transitionend, transitionendHandler);
				currentItem.addClass(SETTINGS.active);
				element.addClass('open');
			}

			selectedItem = currentItem;

			items.find('.body').removeClass('detail-open');

			setTimeout(function() {
				link.width('').height('');
			}, 500);
		}

		function link_clickHandler(e) {
			e.preventDefault();
			var currentItem = $(e.currentTarget).closest(SETTINGS.items);

			openSection(currentItem);
		}

		// public methods
		return {
			close: close,
			open: open
		};
	};

	/**
	 * Create jQuery plugin
	 * @param  {Object} options Overwritten settings
	 * @return {Dropdown}
	 */
	$.fn.accordion = function(options) {
		return this.each(function() {
			$(this).data('module', new Accordion(this, options));
			return this;
		});
	};

}(window.idc = window.idc || {}, jQuery || $));
