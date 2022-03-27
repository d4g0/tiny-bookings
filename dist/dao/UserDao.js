"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;
exports.getAdminByName = getAdminByName;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _PrismaClient = require("./PrismaClient.js");

var _utils = require("../utils");

/**
 * Retrives a user obj from db 
 * based in is user name, 
 * @param {String} username 
 */
function getAdminByName(_x) {
  return _getAdminByName.apply(this, arguments);
}

function _getAdminByName() {
  _getAdminByName = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(adminName) {
    var data, admin;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if ((0, _utils.isValidString)(adminName)) {
              _context.next = 2;
              break;
            }

            throw new Error("Non valid string provided: ".concat(adminName));

          case 2:
            _context.next = 4;
            return _PrismaClient.prisma.admins.findFirst({
              where: {
                admin_name: adminName
              },
              include: {
                user_roles: true
              }
            });

          case 4:
            data = _context.sent;

            /**
            Query response data like
               {
                    admin: {
                        id: 1,
                        user_role: 1,
                        admin_name: 'dago',
                        admin_description: 'system creator',
                        hash_password: '$2a$10$2nZp/EGj.aQY/PyyqGAMze2.a1C4H1knpdNSAO.TX/92katjMo75C',
                        reset_token: null,
                        created_at: 2022-03-26T05:02:30.090Z,
                        user_roles: { id: 1, user_role: 'full-admin' }
                    }
                }
             */
            // map to a user
            admin = {
              id: data.id,
              user_role: data.user_roles.user_role,
              admin_name: data.admin_name,
              admin_description: data.admin_description,
              hash_password: data.hash_password,
              reset_token: data.reset_token,
              created_at: data.created_at
            };
            return _context.abrupt("return", admin);

          case 7:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _getAdminByName.apply(this, arguments);
}

function foo() {
  return _foo.apply(this, arguments);
}

function _foo() {
  _foo = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    return _regenerator["default"].wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _foo.apply(this, arguments);
}