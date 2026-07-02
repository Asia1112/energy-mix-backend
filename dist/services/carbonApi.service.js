"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGenerationMix = fetchGenerationMix;
const axios_1 = __importDefault(require("axios"));
const BASE_URL = "https://api.carbonintensity.org.uk";
async function fetchGenerationMix(from, to) {
    const response = await axios_1.default.get(`${BASE_URL}/generation/${from}/${to}`);
    return response.data.data;
}
