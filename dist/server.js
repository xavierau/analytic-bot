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
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./config"));
const cors_1 = __importDefault(require("cors"));
const PostgresMemory_1 = require("./memories/PostgresMemory");
const OpenAIClient_1 = require("./services/llms/OpenAIClient");
const DataQuery_1 = require("./tools/DataQuery");
const query_1 = require("./database/repositories/query");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(express_1.default.static('public'));
app.get('/', (req, res) => res.send('Hello World from analytic bot!'));
app.get('/api/messages', (req, res) => {
    const identifier = req.header("x-identifier") || "default";
    console.log('identifier', identifier);
    const memory = new PostgresMemory_1.PostgresMemory(identifier);
    memory.getMessages(99, {})
        .then((messages) => res.send(messages))
        .catch((error) => res.status(500).send(error));
});
app.post('/api/messages', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { query } = req.body;
    const identifier = req.header("x-identifier") || "default";
    const memory = new PostgresMemory_1.PostgresMemory(identifier);
    const previousMessages = yield memory.getMessages(6, {});
    const llm = new OpenAIClient_1.OpenAIClient(config_1.default.openaiApiKey, [new DataQuery_1.DataQuery()]);
    const messages = [
        {
            'role': 'system',
            content: "You are a business analyst. Reply in markdown format." + "\n\nCurrent Date: " + (new Date).toDateString()
        },
        ...previousMessages,
        {
            role: "user",
            content: query,
        },
    ];
    llm.generate(messages)
        .then((response) => __awaiter(void 0, void 0, void 0, function* () {
        yield memory.addMessage({
            role: 'user',
            content: query
        }, {});
        yield memory.addMessage({
            role: 'assistant',
            content: response === null || response === void 0 ? void 0 : response.message.content
        }, {});
        res.json({
            message: response === null || response === void 0 ? void 0 : response.message.content
        });
    }))
        .catch((error) => {
        res.send(error);
    });
}));
app.get('/create_embeddings', (req, res) => {
    (0, query_1.embeddingQuery)()
        .then((result) => res.send(result))
        .catch((error) => {
        console.error(error);
        res.status(500).send(error);
    });
});
app.listen(config_1.default.appPort, () => console.log(`Example app listening at http://localhost:${config_1.default.appPort}`));
