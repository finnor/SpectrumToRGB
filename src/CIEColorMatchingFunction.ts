import XYZ from "./XYZ";
import * as cie1964 from "./Data/ColorMatching/cie1964";

/**
 * Class to match a wavelength to a CIE xyz color
 */
class CIEColorMatchingFunction
{
    //[[x-coordinate, y-coordinate, z-coordinate],...]
    private matchingFunction = cie1964.default;

    //TODO constructor to set what matching function to use

    /**
     * Matches a given wavelength to an xyz color
     *
     * @param  {number} wavelength  the wavelength to get the color for
     * @return {XYZ} the xyz color represented by the wavelength
     */
    public match(wavelength: number): XYZ
    {
        let index = Math.round(wavelength-380);
        let temp = this.matchingFunction[index];
        return new XYZ(temp[0], temp[1], temp[2]);
    }
}

export default CIEColorMatchingFunction;