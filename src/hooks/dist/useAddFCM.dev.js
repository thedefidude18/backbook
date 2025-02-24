"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAddFCM = void 0;

var _reactQuery = require("@tanstack/react-query");

var _axios = _interopRequireDefault(require("axios"));

var _jsCookie = _interopRequireDefault(require("js-cookie"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var AddFCM = function AddFCM(_ref) {
  var fcm, _ref2, data;

  return regeneratorRuntime.async(function AddFCM$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          fcm = _ref.fcm;
          _context.next = 3;
          return regeneratorRuntime.awrap(_axios["default"].post("".concat(process.env.REACT_APP_BACKEND_URL, "/api/v1/users/fcm"), {
            fcmToken: fcm
          }, {
            withCredentials: true
          }));

        case 3:
          _ref2 = _context.sent;
          data = _ref2.data;
          return _context.abrupt("return", data);

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
};

var useAddFCM = function useAddFCM() {
  return (0, _reactQuery.useMutation)({
    mutationKey: "useAddFCM",
    mutationFn: AddFCM,
    onSuccess: function onSuccess(data) {
      _jsCookie["default"].set("fcm", JSON.stringify(data.fcmToken), {
        expires: 90
      });
    }
  });
};

exports.useAddFCM = useAddFCM;