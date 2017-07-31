class RGB
{
    public r: number;
    public g: number;
    public b: number;

    constructor(r: number, g: number, b: number)
    {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    public getRed(): number
    {
        return Math.round(this.r*255);
    }

    public getGreen(): number
    {
        return Math.round(this.g*255);
    }

    public getBlue(): number
    {
        return Math.round(this.b*255);
    }
}

export default RGB;