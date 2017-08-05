/**
 * Composite data type for an RGB color
 */
class RGB
{
    public r: number;            //r component
    public g: number;            //g component
    public b: number;            //b component

    constructor(r: number, g: number, b: number)
    {
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
    public getRed(): number
    {
        return Math.round(this.r*255);
    }

    /**
     * Getter that scales the green component
     * to 0-255 range
     *
     * @return {number} scaled green
     */
    public getGreen(): number
    {
        return Math.round(this.g*255);
    }

    /**
     * Getter that scales the blue component
     * to 0-255 range
     *
     * @return {number} scaled blue
     */
    public getBlue(): number
    {
        return Math.round(this.b*255);
    }
}

export default RGB;