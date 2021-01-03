/**
 * Composite data type for an CIE XYZ chromaticity
 */
export default class XYZ
{
    public x: number;        //x-coordinate
    public y: number;        //y-coordinate
    public z: number;        //z-coordinate

    constructor(x: number, y: number, z: number)
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
