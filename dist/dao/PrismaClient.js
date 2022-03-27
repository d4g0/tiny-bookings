"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.connect = connect;
exports.disconnect = disconnect;
exports.prisma = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _client = require("@prisma/client");

/**
 * The Prisma Singleton Instace
 */
var prisma = new _client.PrismaClient();
exports.prisma = prisma;

function connect() {
  return _connect.apply(this, arguments);
}

function _connect() {
  _connect = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt("return", prisma.$connect);

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _connect.apply(this, arguments);
}

function disconnect() {
  return _disconnect.apply(this, arguments);
}

function _disconnect() {
  _disconnect = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt("return", prisma.disconnect);

          case 1:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _disconnect.apply(this, arguments);
}