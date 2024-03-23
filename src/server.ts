import express from "express";
import config from "./config";
import cors from "cors";
import {PostgresMemory} from "./memories/PostgresMemory";
import {OpenAIClient} from "./services/llms/OpenAIClient";
import {DataQuery} from "./tools/DataQuery";
import {ChatCompletionMessageParam} from "openai/src/resources/chat/completions";
import {embeddingQuery, getQueries} from "./database/repositories/query";

const app = express();
app.use(express.json())
app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => res.send('Hello World from analytic bot!'))

app.get('/api/messages', (req, res) => {
    const identifier = req.header("x-identifier") || "default"
    console.log('identifier', identifier)
    const memory = new PostgresMemory(identifier)
    memory.getMessages(99, {})
        .then((messages) => res.send(messages))
        .catch((error) => res.status(500).send(error))
})

app.post('/api/messages', async (req, res) => {
    const {query} = req.body
    const identifier = req.header("x-identifier") || "default"
    const memory = new PostgresMemory(identifier)
    const previousMessages = await memory.getMessages(6, {})
    const llm = new OpenAIClient(config.openaiApiKey, [new DataQuery()])
    const messages: ChatCompletionMessageParam[] = [
        {
            'role': 'system',
            content: "You are a business analyst. Reply in markdown format." + "\n\nCurrent Date: " + (new Date).toDateString()
        },
        ...previousMessages,
        {
            role: "user",
            content: query,
        },
    ]


    llm.generate(messages)
        .then(async (response) => {
            await memory.addMessage({
                role: 'user',
                content: query
            }, {})
            await memory.addMessage({
                role: 'assistant',
                content: response?.message.content
            }, {})
            res.json({
                message: response?.message.content
            })
        })
        .catch((error) => {
            res.send(error)
        })
})

app.get('/create_embeddings', (req, res) => {
    embeddingQuery()
        .then((result) => res.send(result))
        .catch((error) => {
            console.error(error)
            res.status(500).send(error)
        })
})

app.listen(config.appPort, () => console.log(`Example app listening at http://localhost:${config.appPort}`))