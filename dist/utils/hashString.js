"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateHashedPassword = generateHashedPassword;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

// const bcrypt = require('bcryptjs')
var salt = _bcryptjs["default"].genSaltSync(10);

var hash = _bcryptjs["default"].hashSync("B4c0/\/", salt); // Store hash in your password DB.
// 


function generateHashedPassword() {
  return _generateHashedPassword.apply(this, arguments);
}

function _generateHashedPassword() {
  _generateHashedPassword = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var start_time, password, hash, hashPasw, comparationResult, execution_time;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            start_time = Date.now();
            password = 'supper-foo-pass';
            _context.next = 4;
            return _bcryptjs["default"].genSalt(10);

          case 4:
            hash = _context.sent;
            _context.next = 7;
            return _bcryptjs["default"].hash(password, hash);

          case 7:
            hashPasw = _context.sent;
            _context.next = 10;
            return _bcryptjs["default"].compare(password, hashPasw);

          case 10:
            comparationResult = _context.sent;
            execution_time = Date.now() - start_time;
            console.log({
              hashPasw: hashPasw,
              comparationResult: comparationResult,
              execution_time: execution_time
            });

          case 13:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _generateHashedPassword.apply(this, arguments);
}

function printHashedPass() {
  return _printHashedPass.apply(this, arguments);
}

function _printHashedPass() {
  _printHashedPass = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var password, hashedPassword;
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            password = process.argv[2];
            _context2.next = 3;
            return generateHashedPassword(password);

          case 3:
            hashedPassword = _context2.sent;
            console.log(hashedPassword);

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _printHashedPass.apply(this, arguments);
}

printHashedPass();