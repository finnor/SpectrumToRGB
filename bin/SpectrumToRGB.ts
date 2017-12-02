#! /usr/bin/env node

import Spectrum from "../src/Spectrum";
import SpectrumToRGB from "../src/SpectrumToRGB";

let spectrumDataPath = argv.f || argv.file;;
let spectrumDataFile = require(spectrumDataPath);

let spectrum = new Spectrum(spectrumDataFile.spectrum, spectrumDataFile.isReflectance);
let converter = new SpectrumToRGB();

let color = converter.convert(spectrum);

console.log("rgb(" + color.getRed() +"," + color.getGreen() + "," + color.getBlue() + ")");

