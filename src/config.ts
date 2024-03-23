import dotenv from 'dotenv';

dotenv.config();

const config = {
    openaiApiKey: process.env.OPENAI_API_KEY || "",
    openaiLLMModel: process.env.OPENAI_LLM_MODEL || "gpt-4-1106-preview",
    appPort: (process.env.PORT || 3000) as number,
    database: {
        host: process.env.PGSQL_HOST || "localhost",
        port: (process.env.PGSQL_PORT || 5432) as number,
        user: process.env.PGSQL_USER || "postgres",
        password: process.env.PGSQL_PASSWORD || "password",
        database: process.env.PGSQL_DATABASE || "data-analytic-bot",
        requireSSL: process.env.PGSQL_REQUIRE_SSL === "true",
        timeout: (process.env.PGSQL_TIMEOUT || 2000) as number
    }
}

export default config;