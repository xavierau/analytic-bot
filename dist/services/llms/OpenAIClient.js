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
exports.OpenAIClient = void 0;
const config_1 = __importDefault(require("../../config"));
const openai_1 = __importDefault(require("openai"));
class OpenAIClient {
    constructor(API_KEY = config_1.default.openaiApiKey || "", tools) {
        this.API_KEY = API_KEY;
        this.tools = tools;
        this.client = new openai_1.default({ apiKey: config_1.default.openaiApiKey });
    }
    setTools(tools) {
        this.tools = tools;
        return this;
    }
    generate(messages, chatConfig) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const toolConfig = this.getLlmConfig();
            const configWithTools = Object.assign(Object.assign({}, chatConfig), toolConfig);
            console.log("configWithTools: ", configWithTools);
            console.log('messages', messages);
            const chatResponse = configWithTools ?
                yield this.client.chat.completions.create({
                    messages: messages,
                    model: (chatConfig === null || chatConfig === void 0 ? void 0 : chatConfig.model) || config_1.default.openaiLLMModel,
                    tools: configWithTools.tools,
                    tool_choice: configWithTools.tool_choice
                }) :
                yield this.client.chat.completions.create({
                    messages: messages,
                    model: (chatConfig === null || chatConfig === void 0 ? void 0 : chatConfig.model) || config_1.default.openaiLLMModel,
                });
            console.log('chatResponse', chatResponse, chatResponse.choices[0].message);
            if ((_a = chatResponse.choices[0].message) === null || _a === void 0 ? void 0 : _a.tool_calls) {
                console.log('chatResponse.choices[0].message.toolCalls', chatResponse.choices[0].message.tool_calls);
                if (chatResponse.choices[0].message.tool_calls.length) {
                    messages.push({
                        role: "assistant",
                        tool_calls: chatResponse.choices[0].message.tool_calls,
                        content: JSON.stringify(chatResponse.choices[0].message)
                    });
                    for (const toolCall of chatResponse.choices[0].message.tool_calls) {
                        const toolResponse = yield this.executeToolCall(toolCall);
                        console.log('tool', toolCall);
                        console.log('toolResponse', toolResponse);
                        messages.push({
                            role: "tool",
                            tool_call_id: toolCall.id,
                            content: JSON.stringify(toolResponse)
                        });
                    }
                    return yield this.generate(messages, chatConfig);
                }
            }
            console.log('overall messages: ', messages);
            return chatResponse.choices[0];
        });
    }
    getLlmConfig() {
        var _a;
        if (!this.tools) {
            return {};
        }
        return {
            tools: (_a = this.tools) === null || _a === void 0 ? void 0 : _a.map(tool => tool.getSchema()),
            tool_choice: "auto"
        };
    }
    executeToolCall(toolCall) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.tools) {
                const tool = this.tools.find(tool => tool.name === toolCall.function.name);
                if (tool) {
                    const args = JSON.parse(toolCall.function.arguments);
                    return yield tool.run(args);
                }
            }
            throw new Error("Tool not found");
        });
    }
}
exports.OpenAIClient = OpenAIClient;
