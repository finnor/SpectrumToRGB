var SpectrumToRGB =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
/**
 * Composite data type for an CIE XYZ color
 */
var XYZ = (function () {
    function XYZ(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    return XYZ;
}());
exports["default"] = XYZ;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
/**
 * Class to represent a reflectance spectrum
 */
var Spectrum = (function () {
    /**
     * @constructor
     * @param {number[][]} data  the input spectral data
     * @param {Boolean} isReflectance  is the data reflectance or absorbance
     */
    function Spectrum(data, isReflectance) {
        if (isReflectance === void 0) { isReflectance = true; }
        this.data = this.normalize(data);
        //if the data is not reflectance, i.e. absorbance
        //flip the data
        if (!isReflectance)
            this.toggleAbsorbReflect();
    }
    /**
     * Scales the spectrum so that the
     * max reflectance/absorbance = 1
     *
     * @param  {number[][]} data  the input spectral data
     * @return {number[][]} the normalized spectral data
     */
    Spectrum.prototype.normalize = function (data) {
        var max = this.findMax(data);
        for (var i = 0; i < data.length; i++) {
            data[i][1] /= max;
        }
        return data;
    };
    /**
     * Toggles the spectrum between absorbance and reflectance
     * assumes that there is no emissive portion
     * Reflectance = 1 - Absorbance
     */
    Spectrum.prototype.toggleAbsorbReflect = function () {
        var max = this.findMax(this.data);
        for (var i = 0; i < this.data.length; i++) {
            this.data[i][1] = 1 - this.data[i][1];
        }
    };
    /**
     * Returns the max absorbance/reflectance value
     *
     * @param  {number[][]} data  the spectral data to find the max for
     * @return {number} the max value
     */
    Spectrum.prototype.findMax = function (data) {
        var max = 0;
        for (var i = 0; i < data.length; i++) {
            if (data[i][1] > max)
                max = data[i][1];
        }
        return max;
    };
    /**
     * Tests if a portion of the spectrum is within
     * the visible spectrum
     *
     * @return {boolean} is this spectrum visible
     */
    Spectrum.prototype.isVisible = function () {
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i][0] >= 380 && this.data[i][0] <= 780 && this.data[i][1] > 0)
                return true;
        }
        return false;
    };
    return Spectrum;
}());
exports["default"] = Spectrum;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var ColorSystem_1 = __webpack_require__(4);
var RGB_1 = __webpack_require__(5);
var XYZ_1 = __webpack_require__(0);
var CIEColorMatchingFunction_1 = __webpack_require__(3);
/**
 * Class to convert a spectrum to an rgb
 */
var SpectrumToRGB = (function () {
    function SpectrumToRGB() {
        //The class for a "function"(algorithm not jargon function)
        //to calculate a the additive portion a wavelength
        //contributes to an XYZ color
        this.matchingFunction = new CIEColorMatchingFunction_1["default"]();
        //White point chromaticities
        this.IlluminantCx = 0.3101; //For NTSC television
        this.IlluminantCy = 0.3162;
        this.IlluminantD65x = 0.3127; //For EBU and SMPTE
        this.IlluminantD65y = 0.3291;
        this.IlluminantEx = 0.33333333; //CIE equal-energy illuminant
        this.IlluminantEy = 0.33333333;
        //Gamma correction system
        //TODO move this to either an enum or
        //     a class with the gamma correction function
        this.GAMMA_REC709 = 0; //Rec. 709
        //Color Systems
        this.NTSCsystem = new ColorSystem_1["default"]("NTSC", 0.67, 0.33, 0.21, 0.71, 0.14, 0.08, this.IlluminantCx, this.IlluminantCy, this.GAMMA_REC709);
        this.EBUsystem = new ColorSystem_1["default"]("EBU (PAL/SECAM)", 0.64, 0.33, 0.29, 0.60, 0.15, 0.06, this.IlluminantD65x, this.IlluminantD65y, this.GAMMA_REC709);
        this.SMPTEsystem = new ColorSystem_1["default"]("SMPTE", 0.630, 0.340, 0.310, 0.595, 0.155, 0.070, this.IlluminantD65x, this.IlluminantD65y, this.GAMMA_REC709);
        this.HDTVsystem = new ColorSystem_1["default"]("HDTV", 0.670, 0.330, 0.210, 0.710, 0.150, 0.060, this.IlluminantD65x, this.IlluminantD65y, this.GAMMA_REC709);
        this.CIEsystem = new ColorSystem_1["default"]("CIE", 0.7355, 0.2645, 0.2658, 0.7243, 0.1669, 0.0085, this.IlluminantEx, this.IlluminantEy, this.GAMMA_REC709);
        this.Rec709system = new ColorSystem_1["default"]("CIE REC 709", 0.64, 0.33, 0.30, 0.60, 0.15, 0.06, this.IlluminantD65x, this.IlluminantD65y, this.GAMMA_REC709);
    }
    /**
     * Takes an xyz color and returns the rgb color in the input color system
     *
     * @param  {ColorSystem} cs  The color system to render the rgb color in
     * @param  {XYZ} xyz  The xyz color to convert from
     * @return {RGB} The converted rgb color
     */
    SpectrumToRGB.prototype.xyzToRGB = function (cs, xyz) {
        var xr, yr, zr, xg, yg, zg, xb, yb, zb;
        var xw, yw, zw;
        var rx, ry, rz, gx, gy, gz, bx, by, bz;
        var rw, gw, bw;
        var r, g, b;
        xr = cs.xRed;
        yr = cs.yRed;
        zr = 1. - (xr + yr);
        xg = cs.xGreen;
        yg = cs.yGreen;
        zg = 1. - (xg + yg);
        xb = cs.xBlue;
        yb = cs.yBlue;
        zb = 1. - (xb + yb);
        xw = cs.xWhite;
        yw = cs.yWhite;
        zw = 1. - (xw + yw);
        //xyz -> rgb matrix, before scaling to white.
        rx = (yg * zb) - (yb * zg);
        ry = (xb * zg) - (xg * zb);
        rz = (xg * yb) - (xb * yg);
        gx = (yb * zr) - (yr * zb);
        gy = (xr * zb) - (xb * zr);
        gz = (xb * yr) - (xr * yb);
        bx = (yr * zg) - (yg * zr);
        by = (xg * zr) - (xr * zg);
        bz = (xr * yg) - (xg * yr);
        //White scaling factors.
        //Dividing by yw scales the white luminance to unity, as conventional.
        rw = ((rx * xw) + (ry * yw) + (rz * zw)) / yw;
        gw = ((gx * xw) + (gy * yw) + (gz * zw)) / yw;
        bw = ((bx * xw) + (by * yw) + (bz * zw)) / yw;
        //xyz -> rgb matrix, correctly scaled to white.
        rx = rx / rw;
        ry = ry / rw;
        rz = rz / rw;
        gx = gx / gw;
        gy = gy / gw;
        gz = gz / gw;
        bx = bx / bw;
        by = by / bw;
        bz = bz / bw;
        //rgb of the desired point
        r = (rx * xyz.x) + (ry * xyz.y) + (rz * xyz.z);
        g = (gx * xyz.x) + (gy * xyz.y) + (gz * xyz.z);
        b = (bx * xyz.x) + (by * xyz.y) + (bz * xyz.z);
        var rgb = new RGB_1["default"](r, g, b);
        if (!this.insideGamut(rgb))
            rgb = this.constrainRGB(rgb);
        return rgb;
    };
    /**
     * Tests if the rgb color is inside the gamut achieveable
     * where all component colors are positive
     *
     * @param  {RGB} rgb  the rgb color to test
     * @return {boolean} is the color inside the color gamut
     */
    SpectrumToRGB.prototype.insideGamut = function (rgb) {
        return (rgb.r >= 0) && (rgb.g >= 0) && (rgb.b >= 0);
    };
    /**
     * Adds white to a color until it is inside the gamut
     *
     * @param  {RGB} rgb  the rgb color to constrain; used as an inout parameter
     * @return {RGB} The color constrained inside the gamut
     */
    SpectrumToRGB.prototype.constrainRGB = function (rgb) {
        var w;
        var red = rgb.r;
        var green = rgb.g;
        var blue = rgb.b;
        //Amount of white needed is w = - min(0, red, green, blue)
        w = (0 < red) ? 0 : red;
        w = (w < green) ? w : green;
        w = (w < blue) ? w : blue;
        w = -w;
        //Add just enough white to make red, green, blue all positive.
        if (w > 0) {
            red += w;
            green += w;
            blue += w;
        }
        return new RGB_1["default"](red, green, blue);
    };
    /**
     * Gamma corrects a single component color for a given color system
     *
     * @param {ColorSystem} cs  The color system to gamma correct for
     * @param {number} c  the value of a component color to correct for
     * @return {number} the gamma corrected value
     */
    SpectrumToRGB.prototype.gammaCorrect = function (cs, c) {
        var gamma;
        gamma = cs.gamma;
        if (gamma === this.GAMMA_REC709) {
            //Rec. 709 gamma correction.
            var cc = 0.018;
            if (c < cc) {
                c *= ((1.099 * Math.pow(cc, 0.45)) - 0.099) / cc;
            }
            else {
                c = (1.099 * Math.pow(c, 0.45)) - 0.099;
            }
        }
        else {
            //Nonlinear colour = (Linear colour)^(1/gamma)
            c = Math.pow(c, 1.0 / gamma);
        }
        return c;
    };
    /**
     * Gamma corrects an rgb color for a given color system
     *
     * @param {ColorSystem} cs  The color system to gamma correct for
     * @param {RGB} rgb  the rgb color to gamma correct
     * @return {RGB} the gamma corrected rgb
     */
    SpectrumToRGB.prototype.gammaCorrectRGB = function (cs, rgb) {
        return new RGB_1["default"](this.gammaCorrect(cs, rgb.r), this.gammaCorrect(cs, rgb.g), this.gammaCorrect(cs, rgb.b));
    };
    /**
     * Scales a color so the max component color has a value of 1
     *
     * @param {RGB} rgb  the color to be normalized
     * @return {RGB} the gamma corrected rgb
     */
    SpectrumToRGB.prototype.normRGB = function (rgb) {
        var red = rgb.r;
        var green = rgb.g;
        var blue = rgb.b;
        //Find max color
        var max = (red > green) ? red : green;
        max = (max > blue) ? max : blue;
        if (max > 0) {
            red /= max;
            green /= max;
            blue /= max;
        }
        return new RGB_1["default"](red, green, blue);
    };
    /**
     * Converts an input spectrum into a CIE XYZ color
     *
     * @param  {Spectrum} spectrum  The spectrum to convert from
     * @return {XYZ} the xyz color representing the spectrum
     */
    SpectrumToRGB.prototype.spectrumToXYZ = function (spectrum) {
        var xBar = 0;
        var yBar = 0;
        var zBar = 0;
        var xyzSum;
        var reflectance;
        for (var i = 0; i < spectrum.data.length; i++) {
            //Skip values outside the visibile range 380-780
            //that do not contribute to a color
            if (spectrum.data[i][0] >= 380 && spectrum.data[i][0] <= 780) {
                var colorMatch = this.matchingFunction.match(spectrum.data[i][0]);
                reflectance = spectrum.data[i][1];
                xBar += reflectance * colorMatch.x;
                yBar += reflectance * colorMatch.y;
                zBar += reflectance * colorMatch.z;
            }
        }
        xyzSum = (xBar + yBar + zBar);
        var x = xBar / xyzSum;
        var y = yBar / xyzSum;
        var z = zBar / xyzSum;
        return new XYZ_1["default"](x, y, z);
    };
    /**
     * Entry point for class. Converts a spectrum to an rgb color
     *
     * @param  {Spectrum} spectrum the input spectrum to be converted
     * @return {RGB} the rgb color the spectrum represents
     */
    SpectrumToRGB.prototype.convert = function (spectrum) {
        var cs = this.SMPTEsystem;
        var xyz = this.spectrumToXYZ(spectrum);
        var rgb = this.xyzToRGB(cs, xyz);
        return this.gammaCorrectRGB(cs, rgb);
    };
    return SpectrumToRGB;
}());
exports["default"] = SpectrumToRGB;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var XYZ_1 = __webpack_require__(0);
/**
 * Class to match a wavelength to a CIE xyz color
 */
var CIEColorMatchingFunction = (function () {
    function CIEColorMatchingFunction() {
        //[[x-coordinate, y-coordinate, z-coordinate],...]
        this.cieColorMatch = [
            [0.0014, 0.0000, 0.0065], [0.0022, 0.0001, 0.0105], [0.0042, 0.0001, 0.0201],
            [0.0076, 0.0002, 0.0362], [0.0143, 0.0004, 0.0679], [0.0232, 0.0006, 0.1102],
            [0.0435, 0.0012, 0.2074], [0.0776, 0.0022, 0.3713], [0.1344, 0.0040, 0.6456],
            [0.2148, 0.0073, 1.0391], [0.2839, 0.0116, 1.3856], [0.3285, 0.0168, 1.6230],
            [0.3483, 0.0230, 1.7471], [0.3481, 0.0298, 1.7826], [0.3362, 0.0380, 1.7721],
            [0.3187, 0.0480, 1.7441], [0.2908, 0.0600, 1.6692], [0.2511, 0.0739, 1.5281],
            [0.1954, 0.0910, 1.2876], [0.1421, 0.1126, 1.0419], [0.0956, 0.1390, 0.8130],
            [0.0580, 0.1693, 0.6162], [0.0320, 0.2080, 0.4652], [0.0147, 0.2586, 0.3533],
            [0.0049, 0.3230, 0.2720], [0.0024, 0.4073, 0.2123], [0.0093, 0.5030, 0.1582],
            [0.0291, 0.6082, 0.1117], [0.0633, 0.7100, 0.0782], [0.1096, 0.7932, 0.0573],
            [0.1655, 0.8620, 0.0422], [0.2257, 0.9149, 0.0298], [0.2904, 0.9540, 0.0203],
            [0.3597, 0.9803, 0.0134], [0.4334, 0.9950, 0.0087], [0.5121, 1.0000, 0.0057],
            [0.5945, 0.9950, 0.0039], [0.6784, 0.9786, 0.0027], [0.7621, 0.9520, 0.0021],
            [0.8425, 0.9154, 0.0018], [0.9163, 0.8700, 0.0017], [0.9786, 0.8163, 0.0014],
            [1.0263, 0.7570, 0.0011], [1.0567, 0.6949, 0.0010], [1.0622, 0.6310, 0.0008],
            [1.0456, 0.5668, 0.0006], [1.0026, 0.5030, 0.0003], [0.9384, 0.4412, 0.0002],
            [0.8544, 0.3810, 0.0002], [0.7514, 0.3210, 0.0001], [0.6424, 0.2650, 0.0000],
            [0.5419, 0.2170, 0.0000], [0.4479, 0.1750, 0.0000], [0.3608, 0.1382, 0.0000],
            [0.2835, 0.1070, 0.0000], [0.2187, 0.0816, 0.0000], [0.1649, 0.0610, 0.0000],
            [0.1212, 0.0446, 0.0000], [0.0874, 0.0320, 0.0000], [0.0636, 0.0232, 0.0000],
            [0.0468, 0.0170, 0.0000], [0.0329, 0.0119, 0.0000], [0.0227, 0.0082, 0.0000],
            [0.0158, 0.0057, 0.0000], [0.0114, 0.0041, 0.0000], [0.0081, 0.0029, 0.0000],
            [0.0058, 0.0021, 0.0000], [0.0041, 0.0015, 0.0000], [0.0029, 0.0010, 0.0000],
            [0.0020, 0.0007, 0.0000], [0.0014, 0.0005, 0.0000], [0.0010, 0.0004, 0.0000],
            [0.0007, 0.0002, 0.0000], [0.0005, 0.0002, 0.0000], [0.0003, 0.0001, 0.0000],
            [0.0002, 0.0001, 0.0000], [0.0002, 0.0001, 0.0000], [0.0001, 0.0000, 0.0000],
            [0.0001, 0.0000, 0.0000], [0.0001, 0.0000, 0.0000], [0.0000, 0.0000, 0.0000]
        ];
    }
    /**
     * Matches a given wavelength to an xyz color
     *
     * @param  {number} wavelength  the wavelength to get the color for
     * @return {XYZ} the xyz color represented by the wavelength
     */
    CIEColorMatchingFunction.prototype.match = function (wavelength) {
        var index = Math.round((wavelength - 380) / 5);
        var temp = this.cieColorMatch[index];
        return new XYZ_1["default"](temp[0], temp[1], temp[2]);
    };
    return CIEColorMatchingFunction;
}());
exports["default"] = CIEColorMatchingFunction;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
/**
 * Composite data type for a color system
 */
var ColorSystem = (function () {
    function ColorSystem(name, xRed, yRed, xGreen, yGreen, xBlue, yBlue, xWhite, yWhite, gamma) {
        this.name = name;
        this.xRed = xRed;
        this.yRed = yRed;
        this.xGreen = xGreen;
        this.yGreen = yGreen;
        this.xBlue = xBlue;
        this.yBlue = yBlue;
        this.xWhite = xWhite;
        this.yWhite = yWhite;
        this.gamma = gamma;
    }
    return ColorSystem;
}());
exports["default"] = ColorSystem;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
/**
 * Composite data type for an RGB color
 */
var RGB = (function () {
    function RGB(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    /**
     * Getter that scales the red component
     * to 0-255 range
     *
     * @return {number} scaled red
     */
    RGB.prototype.getRed = function () {
        return Math.round(this.r * 255);
    };
    /**
     * Getter that scales the green component
     * to 0-255 range
     *
     * @return {number} scaled green
     */
    RGB.prototype.getGreen = function () {
        return Math.round(this.g * 255);
    };
    /**
     * Getter that scales the blue component
     * to 0-255 range
     *
     * @return {number} scaled blue
     */
    RGB.prototype.getBlue = function () {
        return Math.round(this.b * 255);
    };
    return RGB;
}());
exports["default"] = RGB;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
    SpectrumToRGB
    Adrian Flannery
    https://github.com/finnor/SpectrumToRGB
    http://finnor.github.io/

    Modification of algorithm that calculates RGB color
    from an emissive blackbody radiation spectrum
    Colour Rendering of Spectra
    by John Walker
    http://www.fourmilab.ch/documents/specrend/
    http://www.fourmilab.ch/
*/
exports.__esModule = true;
var Spectrum_1 = __webpack_require__(1);
exports.Spectrum = Spectrum_1["default"];
var SpectrumToRGB_1 = __webpack_require__(2);
exports.Converter = SpectrumToRGB_1["default"];


/***/ })
/******/ ]);