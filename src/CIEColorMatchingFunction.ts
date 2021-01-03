import XYZ from "./XYZ";
import cie1964 from "./Data/ColorMatching/cie1964";

/**
 * Class to match a wavelength to a CIE xyz color
 */
export default class CIEColorMatchingFunction
{
    //[[x-coordinate, y-coordinate, z-coordinate],...]
    private matchingFunction = cie1964;

    //TODO constructor to set what matching function to use

    /**
     * Matches a given wavelength to an xyz color
     *
     * @param  {number} wavelength  the wavelength to get the color for
     * @return {XYZ} the xyz color represented by the wavelength
     */
    public match(wavelength: number): XYZ
    {
        const index = Math.round(wavelength-380);
        const temp = this.matchingFunction[index];
        return new XYZ(temp[0], temp[1], temp[2]);
    }
}
