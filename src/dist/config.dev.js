"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.API_BASE_URL = void 0;
var API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';
exports.API_BASE_URL = API_BASE_URL;