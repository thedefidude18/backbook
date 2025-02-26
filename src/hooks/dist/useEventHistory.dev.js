"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useEventHistory = useEventHistory;

var _react = require("react");

var _axios = _interopRequireDefault(require("../utils/axios"));

var _reactRedux = require("react-redux");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function useEventHistory() {
  var _useState = (0, _react.useState)([]),
      _useState2 = _slicedToArray(_useState, 2),
      history = _useState2[0],
      setHistory = _useState2[1];

  var _useState3 = (0, _react.useState)([]),
      _useState4 = _slicedToArray(_useState3, 2),
      createdEvents = _useState4[0],
      setCreatedEvents = _useState4[1];

  var _useState5 = (0, _react.useState)(true),
      _useState6 = _slicedToArray(_useState5, 2),
      loading = _useState6[0],
      setLoading = _useState6[1];

  var user = (0, _reactRedux.useSelector)(function (state) {
    return state.user.userinfo;
  });
  var fetchEventHistory = (0, _react.useCallback)(function _callee() {
    var participatedResponse, createdResponse;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (user) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return");

          case 2:
            _context.prev = 2;
            setLoading(true); // Fetch events the user has participated in

            _context.next = 6;
            return regeneratorRuntime.awrap(_axios["default"].get('/events/participated'));

          case 6:
            participatedResponse = _context.sent;
            _context.next = 9;
            return regeneratorRuntime.awrap(_axios["default"].get('/events/created'));

          case 9:
            createdResponse = _context.sent;
            setHistory(participatedResponse.data.events || []);
            setCreatedEvents(createdResponse.data.events || []);
            _context.next = 17;
            break;

          case 14:
            _context.prev = 14;
            _context.t0 = _context["catch"](2);
            console.error('Error fetching event history:', _context.t0);

          case 17:
            _context.prev = 17;
            setLoading(false);
            return _context.finish(17);

          case 20:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[2, 14, 17, 20]]);
  }, [user]);
  var editEvent = (0, _react.useCallback)(function _callee2(eventId, updatedData) {
    var response;
    return regeneratorRuntime.async(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return regeneratorRuntime.awrap(_axios["default"].put("/events/".concat(eventId), updatedData));

          case 3:
            response = _context2.sent;
            // Update local state
            setCreatedEvents(function (prev) {
              return prev.map(function (event) {
                return event.id === eventId ? _objectSpread({}, event, {}, updatedData) : event;
              });
            });
            return _context2.abrupt("return", response.data);

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](0);
            console.error('Error updating event:', _context2.t0);
            throw _context2.t0;

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[0, 8]]);
  }, []);
  (0, _react.useEffect)(function () {
    fetchEventHistory();
  }, [fetchEventHistory]);
  return {
    history: history,
    createdEvents: createdEvents,
    loading: loading,
    editEvent: editEvent,
    refreshEvents: fetchEventHistory
  };
}