class Spectrum
{
    public data: number[][];

    constructor(data: number[][], isReflectance = true)
    {
        this.data = data;
        if (!isReflectance)
            this.flipAbsRefl();
    }

    private flipAbsRefl()
    {
        let max = this.findMax();

        for(let i=0; i<this.data.length; i++) {
            this.data[i][1] = max - this.data[i][1];
        }
    }

    private findMax(): number
    {
        let max = 0;
        for(let i=0; i<this.data.length; i++) {
            if(this.data[i][1]>max)
                max = this.data[i][1];
        }

        return max;
    }

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