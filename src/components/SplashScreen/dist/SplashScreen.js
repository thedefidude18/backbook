"use strict";
exports.__esModule = true;
var react_1 = require("react");
var SplashScreen = function (_a) {
    var onComplete = _a.onComplete;
    var _b = react_1.useState(false), fadeOut = _b[0], setFadeOut = _b[1];
    react_1.useEffect(function () {
        // Start fade out after 2 seconds
        var fadeTimer = setTimeout(function () {
            setFadeOut(true);
        }, 2000);
        // Complete animation and call onComplete after fade out
        var completeTimer = setTimeout(function () {
            if (onComplete) {
                onComplete();
            }
        }, 2500);
        return function () {
            clearTimeout(fadeTimer);
            clearTimeout(completeTimer);
        };
    }, [onComplete]);
    return (react_1["default"].createElement("div", { className: "fixed inset-0 bg-[#000000] flex flex-col items-center justify-center z-50 transition-opacity duration-500 " + (fadeOut ? 'opacity-0' : 'opacity-100') },
        react_1["default"].createElement("div", { className: "relative" },
            react_1["default"].createElement("img", { src: "/icons/bantahblue.svg", alt: "Bantah", className: "w-24 h-24" }),
            react_1["default"].createElement("div", { className: "absolute -bottom-8 left-1/2 -translate-x-1/2" },
                react_1["default"].createElement("div", { className: "flex gap-2" }, [0, 1, 2].map(function (i) { return (react_1["default"].createElement("div", { key: i, className: "w-2 h-2 bg-[#1876f2] rounded-full animate-bounce", style: {
                        animationDelay: i * 0.2 + "s",
                        animationDuration: '1s'
                    } })); }))))));
};
exports["default"] = SplashScreen;
