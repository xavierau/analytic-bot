import OpenAI from "openai";
import config from "../../config";
import {Embedding} from "../../types";

export class OpenAIEmbedding implements Embedding {
    async encode(input: string, model = "text-embedding-3-small") {
        const openai = new OpenAI({apiKey: config.openaiApiKey});
        const embedding = await openai.embeddings.create({
            model,
            input,
            encoding_format: "float",
        });

        return {
            embedding: embedding.data[0].embedding,
            tokens: embedding.usage.total_tokens
        };
    }

}