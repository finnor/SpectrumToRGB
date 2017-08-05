import ColorSystem from "./ColorSystem";
import RGB from "./RGB";
import XYZ from "./XYZ";
import CIEColorMatchingFunction from "./CIEColorMatchingFunction";
import Spectrum from "./Spectrum";
import * as d65 from "./Data/Illuminant/d65";

/**
 * Class to convert a spectrum to an rgb
 */
class SpectrumToRGB {

    //The class for a "function"(algorithm not jargon function)
    //to calculate a the additive portion a wavelength
    //contributes to an XYZ color
    private matchingFunction = new CIEColorMatchingFunction();

    //White point chromaticities
    private IlluminantCx = 0.3101;        //For NTSC television
    private IlluminantCy = 0.3162;
    private IlluminantD65x = 0.3127;      //For EBU and SMPTE
    private IlluminantD65y = 0.3291;
    private IlluminantEx = 0.33333333;    //CIE equal-energy illuminant
    private IlluminantEy = 0.33333333;

    //The illuminant spectrum
    private illuminantSpectrum = d65.default;

    //Gamma correction system
    //TODO move this to either an enum or
    //     a class with the gamma correction function
    private GAMMA_REC709 = 0;               //Rec. 709

    //Color Systems
    private NTSCsystem = new ColorSystem("NTSC", 0.67, 0.33, 0.21, 0.71, 0.14, 0.08, this.IlluminantCx, this.IlluminantCy, this.GAMMA_REC709);
    private EBUsystem = new ColorSystem("EBU (PAL/SECAM)", 0.64, 0.33, 0.29, 0.60, 0.15, 0.06, this.IlluminantD65x, this.IlluminantD65y, this.GAMMA_REC709);
    private SMPTEsystem = new ColorSystem("SMPTE", 0.630, 0.340, 0.310, 0.595, 0.155, 0.070, this.IlluminantD65x, this.IlluminantD65y, this.GAMMA_REC709);
    private HDTVsystem = new ColorSystem("HDTV", 0.670, 0.330, 0.210, 0.710, 0.150, 0.060, this.IlluminantD65x, this.IlluminantD65y, this.GAMMA_REC709);
    private CIEsystem = new ColorSystem("CIE", 0.7355, 0.2645, 0.2658, 0.7243, 0.1669, 0.0085, this.IlluminantEx, this.IlluminantEy, this.GAMMA_REC709);
    private Rec709system = new ColorSystem("CIE REC 709", 0.64, 0.33, 0.30, 0.60, 0.15, 0.06, this.IlluminantD65x, this.IlluminantD65y, this.GAMMA_REC709);

    /**
     * Takes an xyz color and returns the rgb color in the input color system
     *
     * @param  {ColorSystem} cs  The color system to render the rgb color in
     * @param  {XYZ} xyz  The xyz chromaticity to convert from
     * @return {RGB} The converted rgb color
     */
    private xyzToRGB(cs: ColorSystem, xyz: XYZ): RGB
    {
        let xr, yr, zr, xg, yg, zg, xb, yb, zb;
        let xw, yw, zw;
        let rx, ry, rz, gx, gy, gz, bx, by, bz;
        let rw, gw, bw;
        let r, g, b;

        //x + y + z = 1, therefore z = 1 - (x + y)
        xr = cs.xRed;    yr = cs.yRed;    zr = 1. - (xr + yr);
        xg = cs.xGreen;  yg = cs.yGreen;  zg = 1. - (xg + yg);
        xb = cs.xBlue;   yb = cs.yBlue;   zb = 1. - (xb + yb);

        xw = cs.xWhite;  yw = cs.yWhite;  zw = 1. - (xw + yw);

        //xyz -> rgb matrix, before scaling to white.
        rx = (yg * zb) - (yb * zg);  ry = (xb * zg) - (xg * zb);  rz = (xg * yb) - (xb * yg);
        gx = (yb * zr) - (yr * zb);  gy = (xr * zb) - (xb * zr);  gz = (xb * yr) - (xr * yb);
        bx = (yr * zg) - (yg * zr);  by = (xg * zr) - (xr * zg);  bz = (xr * yg) - (xg * yr);

        //White scaling factors.
        //Dividing by yw scales the white luminance to unity, as conventional.
        rw = ((rx * xw) + (ry * yw) + (rz * zw)) / yw;
        gw = ((gx * xw) + (gy * yw) + (gz * zw)) / yw;
        bw = ((bx * xw) + (by * yw) + (bz * zw)) / yw;

        //xyz -> rgb matrix, correctly scaled to white.
        rx = rx / rw;  ry = ry / rw;  rz = rz / rw;
        gx = gx / gw;  gy = gy / gw;  gz = gz / gw;
        bx = bx / bw;  by = by / bw;  bz = bz / bw;

        //rgb of the desired point
        r = (rx * xyz.x) + (ry * xyz.y) + (rz * xyz.z);
        g = (gx * xyz.x) + (gy * xyz.y) + (gz * xyz.z);
        b = (bx * xyz.x) + (by * xyz.y) + (bz * xyz.z);

        return this.constrainRGBTruncate(new RGB(r, g, b));
    }

   /**
    * Tests if the rgb color is inside the gamut achieveable
    * where all component colors are positive
    *
    * @param  {RGB} rgb  the rgb color to test
    * @return {boolean} is the color inside the color gamut
    */
    public insideGamut(rgb: RGB): boolean
    {
        return (rgb.r >= 0) && (rgb.g >= 0) && (rgb.b >= 0);
    }

   /**
    * Adds white to a color until it is inside the gamut
    *
    * @param  {RGB} rgb  the rgb color to constrain; used as an inout parameter
    * @return {RGB} The color constrained inside the gamut
    */
    private constrainRGBAddWhite(rgb: RGB): RGB
    {
        let w;

        let red = rgb.r;
        let green = rgb.g;
        let blue = rgb.b;

        //Amount of white needed is w = - min(0, red, green, blue)
        w = (0 < red) ? 0 : red;
        w = (w < green) ? w : green;
        w = (w < blue) ? w : blue;
        w = -w;

        //Add just enough white to make red, green, blue all positive.
        if (w > 0) {
            red += w;  green += w; blue += w;
        }

        return new RGB(red, green, blue);
    }

    /**
    * Scales the rgb to max component=1 when a component is > 1 and zeros negative components
    *
    * @param  {RGB} rgb  the rgb color to constrain; used as an inout parameter
    * @return {RGB} The color constrained inside the gamut
    */
    private constrainRGBTruncate(rgb: RGB): RGB
    {
        let red = rgb.r;
        let green = rgb.g;
        let blue = rgb.b;

        //Find max color
        let max = (red>green) ? red : green;
        max = (max>blue) ? max : blue;

        if(max>1) {
            red /= max;
            green /= max;
            blue /= max;
        }


        red = (red<0) ? 0 : red;
        green = (green<0) ? 0 : green;
        blue = (blue<0) ? 0 : blue;

        return new RGB(red, green, blue);
    }

   /**
    * Gamma corrects a single component color for a given color system
    *
    * @param {ColorSystem} cs  The color system to gamma correct for
    * @param {number} c  the value of a component color to correct for
    * @return {number} the gamma corrected value
    */
    private gammaCorrect(cs: ColorSystem, c: number): number
    {
        let gamma: number;

        gamma = cs.gamma;

        if (gamma===this.GAMMA_REC709) {
            //Rec. 709 gamma correction.
            let cc = 0.018;

            if (c < cc) {
                c *= ((1.099 * Math.pow(cc, 0.45)) - 0.099) / cc;
            } else {
                c = (1.099 * Math.pow(c, 0.45)) - 0.099;
            }
        } else {
            //Nonlinear colour = (Linear colour)^(1/gamma)
            c = Math.pow(c, 1.0 / gamma);
        }

        return c;
    }

    /**
     * Gamma corrects an rgb color for a given color system
     *
     * @param {ColorSystem} cs  The color system to gamma correct for
     * @param {RGB} rgb  the rgb color to gamma correct
     * @return {RGB} the gamma corrected rgb
     */
    public gammaCorrectRGB(cs: ColorSystem, rgb: RGB): RGB
    {
        return new RGB(this.gammaCorrect(cs, rgb.r), this.gammaCorrect(cs, rgb.g), this.gammaCorrect(cs, rgb.b));
    }

   /**
    * Scales a color so the max component color has a value of 1
    *
    * @param {RGB} rgb  the color to be normalized
    * @return {RGB} the gamma corrected rgb
    */
    public normRGB(rgb: RGB): RGB
    {
        let red = rgb.r;
        let green = rgb.g;
        let blue = rgb.b;

        //Find max color
        let max = (red>green) ? red : green;
        max = (max>blue) ? max : blue;

        if (max > 0) {
            red /= max;
            green /= max;
            blue /= max;
        }

        return new RGB(red, green, blue);
    }

   /**
    * Converts an input spectrum into a CIE XYZ color
    *
    * @param  {Spectrum} spectrum  The spectrum to convert from
    * @return {XYZ} the xyz color representing the spectrum
    */
    private spectrumToXYZ(spectrum: Spectrum): XYZ
    {
        let xBar = 0;
        let yBar = 0;
        let zBar = 0;
        let xyzSum: number;
        let reflected: number;
        let colorMatch: XYZ;

        for (let i = 0; i < spectrum.data.length; i++) {
            //Skip values outside the visibile range 380-780
            //that do not contribute to a color
            if(spectrum.data[i][0]>=380 && spectrum.data[i][0]<=780) {
                colorMatch = this.matchingFunction.match(spectrum.data[i][0]);

                reflected = spectrum.data[i][1] * this.illuminantSpectrum[(spectrum.data[i][0]-380)];
                xBar += reflected * colorMatch.x;
                yBar += reflected * colorMatch.y;
                zBar += reflected * colorMatch.z;
            }
        }

        xBar /= yBar;
        zBar /= yBar;
        yBar /= yBar;

        xyzSum = (xBar + yBar + zBar);
        let x = xBar / xyzSum;
        let y = yBar / xyzSum;
        let z = zBar / xyzSum;
        return new XYZ(x, y, z);
    }

    /**
     * Entry point for class. Converts a spectrum to an rgb color
     *
     * @param  {Spectrum} spectrum the input spectrum to be converted
     * @return {RGB} the rgb color the spectrum represents
     */
    public convert(spectrum: Spectrum): RGB
    {
        let cs = this.SMPTEsystem;
        let xyz = this.spectrumToXYZ(spectrum);
        return this.xyzToRGB(cs, xyz);
    }
}

export default SpectrumToRGB;