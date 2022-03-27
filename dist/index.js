"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _PrismaClient = require("./dao/PrismaClient.js");

var _UserDao = require("./dao/UserDao.js");

function main() {
  return _main.apply(this, arguments);
}

function _main() {
  _main = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var admin, seeWhatHappens;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _PrismaClient.connect)();

          case 2:
            _context2.next = 4;
            return (0, _UserDao.getAdminByName)('dago');

          case 4:
            admin = _context2.sent;
            console.log({
              admin: admin
            });
            _context2.prev = 6;
            _context2.next = 9;
            return (0, _UserDao.getAdminByName)(function () {});

          case 9:
            seeWhatHappens = _context2.sent;
            console.log(seeWhatHappens);
            _context2.next = 17;
            break;

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2["catch"](6);
            console.log('stay calm');
            console.log(_context2.t0);

          case 17:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[6, 13]]);
  }));
  return _main.apply(this, arguments);
}

main()["catch"](function (e) {
  throw e;
})["finally"]( /*#__PURE__*/(0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  return _regenerator["default"].wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return (0, _PrismaClient.disconnect)();

        case 2:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
})));