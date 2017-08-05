/**
 * Composite data type for an CIE XYZ color
 */
class XYZ
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

export default XYZ;