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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Spectrum = (function () {
    function Spectrum(data, isReflectance) {
        if (isReflectance === void 0) { isReflectance = true; }
        this.data = data;
        if (!isReflectance)
            this.flipAbsRefl();
    }
    Spectrum.prototype.flipAbsRefl = function () {
        var max = this.findMax();
        for (var i = 0; i < this.data.length; i++) {
            this.data[i][1] = max - this.data[i][1];
        }
    };
    Spectrum.prototype.findMax = function () {
        var max = 0;
        for (var i = 0; i < this.data.length; i++) {
            if (this.data[i][1] > max)
                max = this.data[i][1];
        }
        return max;
    };
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
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/*
                Colour Rendering of Spectra

                       by John Walker
                  http://www.fourmilab.ch/

                 Last updated: March 9, 2003

           This program is in the public domain.

    For complete information about the techniques employed in
    this program, see the World-Wide Web document:

             http://www.fourmilab.ch/documents/specrend/

    The xyz_to_rgb() function, which was wrong in the original
    version of this program, was corrected by:

            Andrew J. S. Hamilton 21 May 1999
            Andrew.Hamilton@Colorado.EDU
            http://casa.colorado.edu/~ajsh/

    who also added the gamma correction facilities and
    modified constrain_rgb() to work by desaturating the
    colour by adding white.

    A program which uses these functions to plot CIE
    "tongue" diagrams called "ppmcie" is included in
    the Netpbm graphics toolkit:
        http://netpbm.sourceforge.net/
    (The program was called cietoppm in earlier
    versions of Netpbm.)

*/
exports.__esModule = true;
var ColorSystem_1 = __webpack_require__(4);
var RGB_1 = __webpack_require__(5);
var XYZ_1 = __webpack_require__(6);
var CIEColorMatchingFunction_1 = __webpack_require__(3);
var SpectrumToRGB = (function () {
    function SpectrumToRGB() {
        this.matchingFunction = new CIEColorMatchingFunction_1["default"]();
        /* White point chromaticities. */
        this.IlluminantCx = 0.3101; /* For NTSC television */
        this.IlluminantCy = 0.3162;
        this.IlluminantD65x = 0.3127; /* For EBU and SMPTE */
        this.IlluminantD65y = 0.3291;
        this.IlluminantEx = 0.33333333; /* CIE equal-energy illuminant */
        this.IlluminantEy = 0.33333333;
        /*  Gamma of nonlinear correction.
    
            See Charles Poynton's ColorFAQ Item 45 and GammaFAQ Item 6 at:
    
               http://www.poynton.com/ColorFAQ.html
               http://www.poynton.com/GammaFAQ.html
    
        */
        this.GAMMA_REC709 = 0; /* Rec. 709 */
        this.NTSCsystem = new ColorSystem_1["default"]("NTSC", 0.67, 0.33, 0.21, 0.71, 0.14, 0.08, this.IlluminantCx, this.IlluminantCy, this.GAMMA_REC709);
        this.EBUsystem = new ColorSystem_1["default"]("EBU (PAL/SECAM)", 0.64, 0.33, 0.29, 0.60, 0.15, 0.06, this.IlluminantD65x, this.IlluminantD65y, this.GAMMA_REC709);
        this.SMPTEsystem = new ColorSystem_1["default"]("SMPTE", 0.630, 0.340, 0.310, 0.595, 0.155, 0.070, this.IlluminantD65x, this.IlluminantD65y, this.GAMMA_REC709);
        this.HDTVsystem = new ColorSystem_1["default"]("HDTV", 0.670, 0.330, 0.210, 0.710, 0.150, 0.060, this.IlluminantD65x, this.IlluminantD65y, this.GAMMA_REC709);
        this.CIEsystem = new ColorSystem_1["default"]("CIE", 0.7355, 0.2645, 0.2658, 0.7243, 0.1669, 0.0085, this.IlluminantEx, this.IlluminantEy, this.GAMMA_REC709);
        this.Rec709system = new ColorSystem_1["default"]("CIE REC 709", 0.64, 0.33, 0.30, 0.60, 0.15, 0.06, this.IlluminantD65x, this.IlluminantD65y, this.GAMMA_REC709);
    }
    /*                             XYZ_TO_RGB

        Given an additive tricolour system CS, defined by the CIE x
        and y chromaticities of its three primaries (z is derived
        trivially as 1-(x+y)), and a desired chromaticity (XC, YC,
        ZC) in CIE space, determine the contribution of each
        primary in a linear combination which sums to the desired
        chromaticity.  If the  requested chromaticity falls outside
        the Maxwell  triangle (colour gamut) formed by the three
        primaries, one of the r, g, or b weights will be negative.

        Caller can use constrain_rgb() to desaturate an
        outside-gamut colour to the closest representation within
        the available gamut and/or norm_rgb to normalise the RGB
        components so the largest nonzero component has value 1.

    */
    SpectrumToRGB.prototype.xyz_to_rgb = function (cs, xyz) {
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
        /* xyz -> rgb matrix, before scaling to white. */
        rx = (yg * zb) - (yb * zg);
        ry = (xb * zg) - (xg * zb);
        rz = (xg * yb) - (xb * yg);
        gx = (yb * zr) - (yr * zb);
        gy = (xr * zb) - (xb * zr);
        gz = (xb * yr) - (xr * yb);
        bx = (yr * zg) - (yg * zr);
        by = (xg * zr) - (xr * zg);
        bz = (xr * yg) - (xg * yr);
        /* White scaling factors.
           Dividing by yw scales the white luminance to unity, as conventional. */
        rw = ((rx * xw) + (ry * yw) + (rz * zw)) / yw;
        gw = ((gx * xw) + (gy * yw) + (gz * zw)) / yw;
        bw = ((bx * xw) + (by * yw) + (bz * zw)) / yw;
        /* xyz -> rgb matrix, correctly scaled to white. */
        rx = rx / rw;
        ry = ry / rw;
        rz = rz / rw;
        gx = gx / gw;
        gy = gy / gw;
        gz = gz / gw;
        bx = bx / bw;
        by = by / bw;
        bz = bz / bw;
        /* rgb of the desired point */
        r = (rx * xyz.x) + (ry * xyz.y) + (rz * xyz.z);
        g = (gx * xyz.x) + (gy * xyz.y) + (gz * xyz.z);
        b = (bx * xyz.x) + (by * xyz.y) + (bz * xyz.z);
        var rgb = new RGB_1["default"](r, g, b);
        this.constrain_rgb(rgb);
        return rgb;
    };
    /*                            INSIDE_GAMUT

         Test whether a requested colour is within the gamut
         achievable with the primaries of the current colour
         system.  This amounts simply to testing whether all the
         primary weights are non-negative.

    */
    SpectrumToRGB.prototype.inside_gamut = function (rgb) {
        return (rgb.r >= 0) && (rgb.g >= 0) && (rgb.b >= 0);
    };
    /*                          CONSTRAIN_RGB

        If the requested RGB shade contains a negative weight for
        one of the primaries, it lies outside the colour gamut
        accessible from the given triple of primaries.  Desaturate
        it by adding white, equal quantities of R, G, and B, enough
        to make RGB all positive.  The function returns 1 if the
        components were modified, zero otherwise.

    */
    SpectrumToRGB.prototype.constrain_rgb = function (rgb) {
        var w;
        /* Amount of white needed is w = - min(0, *r, *g, *b) */
        w = (0 < rgb.r) ? 0 : rgb.r;
        w = (w < rgb.g) ? w : rgb.g;
        w = (w < rgb.b) ? w : rgb.b;
        w = -w;
        /* Add just enough white to make r, g, b all positive. */
        if (w > 0) {
            rgb.r += w;
            rgb.g += w;
            rgb.b += w;
            return true; /* Colour modified to fit RGB gamut */
        }
        return false; /* Colour within RGB gamut */
    };
    /*                          GAMMA_CORRECT_RGB

        Transform linear RGB values to nonlinear RGB values. Rec.
        709 is ITU-R Recommendation BT. 709 (1990) ``Basic
        Parameter Values for the HDTV Standard for the Studio and
        for International Programme Exchange'', formerly CCIR Rec.
        709. For details see

           http://www.poynton.com/ColorFAQ.html
           http://www.poynton.com/GammaFAQ.html

    */
    SpectrumToRGB.prototype.gamma_correct = function (cs, c) {
        var gamma;
        gamma = cs.gamma;
        if (gamma == this.GAMMA_REC709) {
            /* Rec. 709 gamma correction. */
            var cc = 0.018;
            if (c < cc) {
                c *= ((1.099 * Math.pow(cc, 0.45)) - 0.099) / cc;
            }
            else {
                c = (1.099 * Math.pow(c, 0.45)) - 0.099;
            }
        }
        else {
            /* Nonlinear colour = (Linear colour)^(1/gamma) */
            c = Math.pow(c, 1.0 / gamma);
        }
        return c;
    };
    SpectrumToRGB.prototype.gamma_correct_rgb = function (cs, rgb) {
        rgb.r = this.gamma_correct(cs, rgb.r);
        rgb.g = this.gamma_correct(cs, rgb.g);
        rgb.b = this.gamma_correct(cs, rgb.b);
        return rgb;
    };
    /*                          NORM_RGB

        Normalise RGB components so the most intense (unless all
        are zero) has a value of 1.

    */
    SpectrumToRGB.prototype.norm_rgb = function (rgb) {
        var max = (rgb.r > rgb.g) ? rgb.r : rgb.g;
        max = (max > rgb.b) ? max : rgb.b;
        if (max > 0) {
            rgb.r /= max;
            rgb.g /= max;
            rgb.b /= max;
        }
        return rgb;
    };
    /*                          SPECTRUM_TO_XYZ

        Calculate the CIE X, Y, and Z coordinates corresponding to
        a light source with spectral distribution given by  the
        function SPEC_INTENS, which is called with a series of
        wavelengths between 380 and 780 nm (the argument is
        expressed in meters), which returns emittance at  that
        wavelength in arbitrary units.  The chromaticity
        coordinates of the spectrum are returned in the x, y, and z
        arguments which respect the identity:

                x + y + z = 1.
    */
    SpectrumToRGB.prototype.spectrum_to_xyz = function (spectrum) {
        var xBar = 0;
        var yBar = 0;
        var zBar = 0;
        var xyzSum;
        var reflectance;
        for (var i = 0; i < spectrum.data.length; i++) {
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
    SpectrumToRGB.prototype.convert = function (spectrum) {
        var cs = this.SMPTEsystem;
        var xyz = this.spectrum_to_xyz(spectrum);
        var rgb = this.xyz_to_rgb(cs, xyz);
        return this.gamma_correct_rgb(cs, rgb);
    };
    return SpectrumToRGB;
}());
exports["default"] = SpectrumToRGB;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var CIEColorMatch = (function () {
    function CIEColorMatch(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    return CIEColorMatch;
}());
exports["default"] = CIEColorMatch;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var CIEColorMatch_1 = __webpack_require__(2);
var CIEColorMatchingFunction = (function () {
    function CIEColorMatchingFunction() {
        /* CIE colour matching functions xBar, yBar, and zBar for
           wavelengths from 380 through 780 nanometers, every 5
           nanometers.  For a wavelength lambda in this range:
    
                cie_colour_match[(lambda - 380) / 5][0] = xBar
                cie_colour_match[(lambda - 380) / 5][1] = yBar
                cie_colour_match[(lambda - 380) / 5][2] = zBar
    
            To save memory, this table can be declared as floats
            rather than doubles; (IEEE) float has enough
            significant bits to represent the values. It's declared
            as a double here to avoid warnings about "conversion
            between floating-point types" from certain persnickety
            compilers. */
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
    CIEColorMatchingFunction.prototype.match = function (wavelength) {
        var index = Math.round((wavelength - 380) / 5);
        var temp = this.cieColorMatch[index];
        return new CIEColorMatch_1["default"](temp[0], temp[1], temp[2]);
    };
    return CIEColorMatchingFunction;
}());
exports["default"] = CIEColorMatchingFunction;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
/*
   A color system is defined by the CIE x and y coordinates of
   its three primary illuminants and the x and y coordinates of
   the white point.

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
var RGB = (function () {
    function RGB(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    RGB.prototype.getRed = function () {
        return Math.round(this.r * 255);
    };
    RGB.prototype.getGreen = function () {
        return Math.round(this.g * 255);
    };
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

exports.__esModule = true;
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

exports.__esModule = true;
var Spectrum_1 = __webpack_require__(0);
exports.Spectrum = Spectrum_1["default"];
var SpectrumToRGB_1 = __webpack_require__(1);
exports.Converter = SpectrumToRGB_1["default"];


/***/ })
/******/ ]);