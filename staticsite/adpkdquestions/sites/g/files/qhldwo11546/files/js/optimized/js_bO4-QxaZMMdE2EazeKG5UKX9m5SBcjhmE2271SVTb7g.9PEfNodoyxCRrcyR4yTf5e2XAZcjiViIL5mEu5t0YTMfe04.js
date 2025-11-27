"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

(function ($, Drupal) {
  'use strict';

  Drupal.behaviors.otsukaFacebookSdkApi = {
    attach: function attach(context, drupalSettings) {
      if (context !== document) {
        return;
      }
    }
  };
  Drupal.otsukaFacebookSdkApi = {
    getID: function getID() {
      return Math.random().toString(16).slice(2);
    },
    getEventID: function getEventID(eventName, eventId) {
      return eventName + '_uid_' + eventId;
    },
    addEventToDataLayer: function addEventToDataLayer(eventName, eventId) {
      var eventObj = {
        event: 'fb_eventId',
        fb_eventId_value: this.getEventID(eventName, eventId)
      };
      DTM_DATA.push(eventObj);

      _satellite.track('fb_eventId');

      window.dataLayer.push(eventObj);
    },
    getOneTrustCookie: function getOneTrustCookie() {
      var _decodeURIComponent$s;

      var activeGroup = [];
      var cookieValues = ((_decodeURIComponent$s = decodeURIComponent(document.cookie).split("; ").find(function (row) {
        return row.startsWith("OptanonConsent=");
      })) === null || _decodeURIComponent$s === void 0 ? void 0 : _decodeURIComponent$s.replace("OptanonConsent=", "")) || false;

      if (cookieValues) {
        var _cookieValues$split$f;

        cookieValues = ((_cookieValues$split$f = cookieValues.split("&").find(function (row) {
          return row.startsWith("groups=");
        })) === null || _cookieValues$split$f === void 0 ? void 0 : _cookieValues$split$f.split("=")[1]) || '';
        activeGroup = cookieValues.split(",").map(function (item) {
          var _item$split = item.split(':'),
              _item$split2 = _slicedToArray(_item$split, 2),
              group = _item$split2[0],
              active = _item$split2[1];

          return parseInt(active) ? group : null;
        }).filter(function (item) {
          return !!item;
        });
      }

      return activeGroup;
    },
    validateFireEvent: function validateFireEvent() {
      if (!!drupalSettings.otsuka_facebook_api_onetrust_ag) {
        var requiredGroup = drupalSettings.otsuka_facebook_api_onetrust_ag.split(',');
        var activeGroups = this.getOneTrustCookie();
        return requiredGroup.every(function (item) {
          return activeGroups.includes(item);
        });
      }

      return true;
    },
    fireEvent: function fireEvent(eventType, eventName) {
      if (!this.validateFireEvent()) {
        return;
      }

      var currentEventId = this.getID();
      var arr = {
        "event": eventType,
        "eventName": eventName,
        "eventId": this.getEventID(eventName, currentEventId),
        "eventUri": window.location.href
      };
      $.ajax({
        url: '/otsuka_facebook_api/backend/event',
        type: 'POST',
        data: JSON.stringify(arr),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        async: false
      });
      this.addEventToDataLayer(eventName, currentEventId);
    }
  };
})(jQuery, Drupal);
