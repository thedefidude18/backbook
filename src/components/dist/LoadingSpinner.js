"use strict";
exports.__esModule = true;
var LoadingSpinner = function (_a) {
    var _b = _a.size, size = _b === void 0 ? 'md' : _b, _c = _a.color, color = _c === void 0 ? '#7440FF' : _c;
    var sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    };
    return (React.createElement("img", { src: "/icons/bantahblue.svg", alt: "Loading...", className: "animate-pulse " + sizeClasses[size], style: { filter: color !== '#7440FF' ? "brightness(0) saturate(100%) " + color : 'none' } }));
};
exports["default"] = LoadingSpinner;
