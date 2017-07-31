/*
   A color system is defined by the CIE x and y coordinates of
   its three primary illuminants and the x and y coordinates of
   the white point.

*/
class ColorSystem
{
    public name: string;                   /* Color system name */
    public xRed: number;                   /* Red x, y */
    public yRed: number;
    public xGreen: number;                 /* Green x, y */
    public yGreen: number;
    public xBlue: number;                  /* Blue x, y */
    public yBlue: number;
    public xWhite: number;                 /* White point x, y */
    public yWhite: number;
    public gamma: number;                  /* Gamma correction for system */

    constructor(name: string, xRed: number, yRed: number,
        xGreen: number, yGreen: number,
        xBlue: number, yBlue: number,
        xWhite: number, yWhite: number,
        gamma: number)
    {

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
}

export default ColorSystem;