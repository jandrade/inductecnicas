/**
 * @fileOverview Helpers
 * @author Juan David Andrade <juandavidandrade@gmail.com>
 * @version 0.2
 */

/*global jQuery:true, $:true */
(function(exports, $) {

  exports.utils = {
    /**
     * matches a translate3D coordinate (from translate3D CSS3 property)
     * @param value {String} The translate3D property string: 'translate3D(10px,0,-50px)'
     * @param coordinate {String} The coordinate needed: 'x' || 'y' || 'z'
     * @returns {Number}  Gets the selected coordinate value
     */
    getTranslateCoordinate: function(value, coordinate) {
      var coordinateValue = 0,
        arrMatches = value.toString().match(/([0-9\-]+)+(?![3d]\()/gi);

      //  matches all the 3D coordinates (from translate3D CSS3 property)
      if (arrMatches && arrMatches.length) {
        //  Gets the array position: [x, y, z]
        var coordinatePosition = coordinate === 'x' ? 0 : coordinate === 'y' ? 1 : 2;
        coordinateValue = parseFloat(arrMatches[coordinatePosition]);
      }

      return coordinateValue;
    },
    getParam: function(key, url) {
      if (typeof url === 'undefined') {
        url = location.search;
      }
      var temp = url.match(new RegExp('[\\?&]' + key + '=([^&#]*)', "i"));
      if(!temp) {
        return;
      }
      return temp[1];
    },
    touch: function() {
      return ('ontouchstart' in window);
    },
    mobileBreak: function() {
      return window.matchMedia("(max-width: 768px)").matches;
    }
  };
  
  /**
   * Define input events based on touch support
   */
  exports.Input = (function() {
    return exports.utils.touch() ? {
      START: 'touchstart',
      MOVE: 'touchmove',
      END: 'touchend',
      CLICK: 'touchend',
      RESIZE: 'orientationchange'
    } : {
      START: 'mousedown',
      MOVE: 'mousemove',
      END: 'mouseup',
      CLICK: 'click',
      RESIZE: 'resize'
    };
  })();


  /**
   * handle events invoking directly a method inside the DOM Element
   */
  if (!Element.prototype.addEventListener) {
    Element.prototype.addEventListener = function(type, handler, useCapture) {
      if (this.attachEvent) {
        this.attachEvent('on' + type, function(event) {
          event.preventDefault = function() {
            event.returnValue = false;
            return false;
          };

          event.stopPropagation = function() {
            window.event.cancelBubble = true;
            return false;
          };

          event.target = event.srcElement;
          event.currentTarget = event.srcElement;


          handler(event);
        });
      }
      return this;
    };
  }

  if (!Element.prototype.removeEventListener) {
    Element.prototype.removeEventListener = function(type, handler, useCapture) {
      if (this.detachEvent) {
        this.detachEvent('on' + type, handler);
      }
      return this;
    };
  }

})(window.idc = window.idc || {}, jQuery || $);
