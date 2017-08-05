/**
 * Class to represent a reflectance spectrum
 */
class Spectrum
{
    public data: number[][];      //an array of [wavelengths, reflectance]

    /**
     * @constructor
     * @param {number[][]} data  the input spectral data
     * @param {Boolean} isReflectance  is the data reflectance or absorbance
     */
    constructor(data: number[][], isReflectance = true)
    {
        this.data = this.normalize(data);

        //if the data is not reflectance, i.e. absorbance
        //flip the data
        if (!isReflectance)
            this.toggleAbsorbReflect();
    }

    /**
     * Scales the spectrum so that the
     * max reflectance/absorbance = 1
     *
     * @param  {number[][]} data  the input spectral data
     * @return {number[][]} the normalized spectral data
     */
    private normalize(data: number[][]): number[][]
    {
        let max = this.findMax(data);
        for(let i=0; i<data.length; i++) {
            data[i][1] /= max;
        }

        return data;
    }

    /**
     * Toggles the spectrum between absorbance and reflectance
     * assumes that there is no emissive portion
     * Reflectance = 1 - Absorbance
     */
    private toggleAbsorbReflect()
    {
        for(let i=0; i<this.data.length; i++) {
            this.data[i][1] = 1 - this.data[i][1];
        }
    }

    /**
     * Returns the max absorbance/reflectance value
     *
     * @param  {number[][]} data  the spectral data to find the max for
     * @return {number} the max value
     */
    private findMax(data: number[][]): number
    {
        let max = 0;
        for(let i=0; i<data.length; i++) {
            if(data[i][1]>max)
                max = data[i][1];
        }

        return max;
    }

    /**
     * Tests if a portion of the spectrum is within
     * the visible spectrum
     *
     * @return {boolean} is this spectrum visible
     */
    public isVisible(): boolean
    {
        for(let i=0; i<this.data.length; i++) {
            if(this.data[i][0]>=380 && this.data[i][0]<=780 && this.data[i][1]>0)
                return true;
        }
        return false;
    }
}

export default Spectrum;