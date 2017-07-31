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

import ColorSystem from "./ColorSystem";
import RGB from "./RGB";
import XYZ from "./XYZ";
import CIEColorMatchingFunction from "./CIEColorMatchingFunction";
import CIEColorMatch from "./CIEColorMatch";
import Spectrum from "./Spectrum";

class SpectrumToRGB {
    private matchingFunction = new CIEColorMatchingFunction();
    /* White point chromaticities. */
    private IlluminantCx = 0.3101;        /* For NTSC television */
    private IlluminantCy = 0.3162;
    private IlluminantD65x = 0.3127;      /* For EBU and SMPTE */
    private IlluminantD65y = 0.3291;
    private IlluminantEx = 0.33333333;    /* CIE equal-energy illuminant */
    private IlluminantEy = 0.33333333;

    /*  Gamma of nonlinear correction.

        See Charles Poynton's ColorFAQ Item 45 and GammaFAQ Item 6 at:

           http://www.poynton.com/ColorFAQ.html
           http://www.poynton.com/GammaFAQ.html

    */
    private GAMMA_REC709 = 0;               /* Rec. 709 */

    private NTSCsystem = new ColorSystem("NTSC", 0.67, 0.33, 0.21, 0.71, 0.14, 0.08, this.IlluminantCx, this.IlluminantCy, this.GAMMA_REC709);
    private EBUsystem = new ColorSystem("EBU (PAL/SECAM)", 0.64, 0.33, 0.29, 0.60, 0.15, 0.06, this.IlluminantD65x, this.IlluminantD65y, this.GAMMA_REC709);
    private SMPTEsystem = new ColorSystem("SMPTE", 0.630, 0.340, 0.310, 0.595, 0.155, 0.070, this.IlluminantD65x, this.IlluminantD65y, this.GAMMA_REC709);
    private HDTVsystem = new ColorSystem("HDTV", 0.670, 0.330, 0.210, 0.710, 0.150, 0.060, this.IlluminantD65x, this.IlluminantD65y, this.GAMMA_REC709);
    private CIEsystem = new ColorSystem("CIE", 0.7355, 0.2645, 0.2658, 0.7243, 0.1669, 0.0085, this.IlluminantEx, this.IlluminantEy, this.GAMMA_REC709);
    private Rec709system = new ColorSystem("CIE REC 709", 0.64, 0.33, 0.30, 0.60, 0.15, 0.06, this.IlluminantD65x, this.IlluminantD65y, this.GAMMA_REC709);

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
    private xyz_to_rgb(cs: ColorSystem, xyz: XYZ): RGB
    {
        let xr, yr, zr, xg, yg, zg, xb, yb, zb;
        let xw, yw, zw;
        let rx, ry, rz, gx, gy, gz, bx, by, bz;
        let rw, gw, bw;
        let r, g, b;

        xr = cs.xRed;    yr = cs.yRed;    zr = 1. - (xr + yr);
        xg = cs.xGreen;  yg = cs.yGreen;  zg = 1. - (xg + yg);
        xb = cs.xBlue;   yb = cs.yBlue;   zb = 1. - (xb + yb);

        xw = cs.xWhite;  yw = cs.yWhite;  zw = 1. - (xw + yw);

        /* xyz -> rgb matrix, before scaling to white. */

        rx = (yg * zb) - (yb * zg);  ry = (xb * zg) - (xg * zb);  rz = (xg * yb) - (xb * yg);
        gx = (yb * zr) - (yr * zb);  gy = (xr * zb) - (xb * zr);  gz = (xb * yr) - (xr * yb);
        bx = (yr * zg) - (yg * zr);  by = (xg * zr) - (xr * zg);  bz = (xr * yg) - (xg * yr);

        /* White scaling factors.
           Dividing by yw scales the white luminance to unity, as conventional. */

        rw = ((rx * xw) + (ry * yw) + (rz * zw)) / yw;
        gw = ((gx * xw) + (gy * yw) + (gz * zw)) / yw;
        bw = ((bx * xw) + (by * yw) + (bz * zw)) / yw;

        /* xyz -> rgb matrix, correctly scaled to white. */

        rx = rx / rw;  ry = ry / rw;  rz = rz / rw;
        gx = gx / gw;  gy = gy / gw;  gz = gz / gw;
        bx = bx / bw;  by = by / bw;  bz = bz / bw;

        /* rgb of the desired point */

        r = (rx * xyz.x) + (ry * xyz.y) + (rz * xyz.z);
        g = (gx * xyz.x) + (gy * xyz.y) + (gz * xyz.z);
        b = (bx * xyz.x) + (by * xyz.y) + (bz * xyz.z);

        let rgb = new RGB(r, g, b);
        this.constrain_rgb(rgb);
        return rgb;
    }

    /*                            INSIDE_GAMUT

         Test whether a requested colour is within the gamut
         achievable with the primaries of the current colour
         system.  This amounts simply to testing whether all the
         primary weights are non-negative.

    */
    private inside_gamut(rgb: RGB): boolean
    {
        return (rgb.r >= 0) && (rgb.g >= 0) && (rgb.b >= 0);
    }

    /*                          CONSTRAIN_RGB

        If the requested RGB shade contains a negative weight for
        one of the primaries, it lies outside the colour gamut
        accessible from the given triple of primaries.  Desaturate
        it by adding white, equal quantities of R, G, and B, enough
        to make RGB all positive.  The function returns 1 if the
        components were modified, zero otherwise.

    */
    private constrain_rgb(rgb: RGB): boolean
    {
        let w;

        /* Amount of white needed is w = - min(0, *r, *g, *b) */

        w = (0 < rgb.r) ? 0 : rgb.r;
        w = (w < rgb.g) ? w : rgb.g;
        w = (w < rgb.b) ? w : rgb.b;
        w = -w;

        /* Add just enough white to make r, g, b all positive. */

        if (w > 0) {
            rgb.r += w;  rgb.g += w; rgb.b += w;
            return true;                     /* Colour modified to fit RGB gamut */
        }

        return false;                         /* Colour within RGB gamut */
    }

    /*                          GAMMA_CORRECT_RGB

        Transform linear RGB values to nonlinear RGB values. Rec.
        709 is ITU-R Recommendation BT. 709 (1990) ``Basic
        Parameter Values for the HDTV Standard for the Studio and
        for International Programme Exchange'', formerly CCIR Rec.
        709. For details see

           http://www.poynton.com/ColorFAQ.html
           http://www.poynton.com/GammaFAQ.html

    */
    private gamma_correct(cs: ColorSystem, c: number)
    {
        let gamma: number;

        gamma = cs.gamma;

        if (gamma == this.GAMMA_REC709) {
            /* Rec. 709 gamma correction. */
            let cc = 0.018;

            if (c < cc) {
                c *= ((1.099 * Math.pow(cc, 0.45)) - 0.099) / cc;
            } else {
                c = (1.099 * Math.pow(c, 0.45)) - 0.099;
            }
        } else {
            /* Nonlinear colour = (Linear colour)^(1/gamma) */
            c = Math.pow(c, 1.0 / gamma);
        }

        return c;
    }

    private gamma_correct_rgb(cs: ColorSystem, rgb: RGB)
    {
        rgb.r = this.gamma_correct(cs, rgb.r);
        rgb.g = this.gamma_correct(cs, rgb.g);
        rgb.b = this.gamma_correct(cs, rgb.b);

        return rgb;
    }

    /*                          NORM_RGB

        Normalise RGB components so the most intense (unless all
        are zero) has a value of 1.

    */
    private norm_rgb(rgb: RGB)
    {
        let max = (rgb.r>rgb.g) ? rgb.r : rgb.g;
        max = (max>rgb.b) ? max : rgb.b;

        if (max > 0) {
            rgb.r /= max;
            rgb.g /= max;
            rgb.b /= max;
        }

        return rgb;
    }

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
    private spectrum_to_xyz(spectrum: Spectrum): XYZ
    {
        let xBar = 0;
        let yBar = 0;
        let zBar = 0;
        let xyzSum: number;
        let reflectance: number;


        for (let i = 0; i < spectrum.data.length; i++) {

            if(spectrum.data[i][0]>=380 && spectrum.data[i][0]<=780) {
                let colorMatch = this.matchingFunction.match(spectrum.data[i][0]);

                reflectance = spectrum.data[i][1];
                xBar += reflectance * colorMatch.x;
                yBar += reflectance * colorMatch.y;
                zBar += reflectance * colorMatch.z;
            }
        }
        xyzSum = (xBar + yBar + zBar);
        let x = xBar / xyzSum;
        let y = yBar / xyzSum;
        let z = zBar / xyzSum;
        return new XYZ(x, y, z);
    }

    public convert(spectrum: Spectrum): RGB
    {
        let cs = this.SMPTEsystem;
        let xyz = this.spectrum_to_xyz(spectrum);
        let rgb = this.xyz_to_rgb(cs, xyz);
        return this.gamma_correct_rgb(cs, rgb);
    }
}

export default SpectrumToRGB;