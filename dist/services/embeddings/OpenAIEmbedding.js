"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAIEmbedding = void 0;
const openai_1 = __importDefault(require("openai"));
const config_1 = __importDefault(require("../../config"));
class OpenAIEmbedding {
    encode(input_1) {
        return __awaiter(this, arguments, void 0, function* (input, model = "text-embedding-3-small") {
            const openai = new openai_1.default({ apiKey: config_1.default.openaiApiKey });
            const embedding = yield openai.embeddings.create({
                model,
                input,
                encoding_format: "float",
            });
            return {
                embedding: embedding.data[0].embedding,
                tokens: embedding.usage.total_tokens
            };
        });
    }
}
exports.OpenAIEmbedding = OpenAIEmbedding;
