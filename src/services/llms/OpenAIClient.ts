import {
    ChatCompletionMessageParam,
    ChatCompletionTool,
    ChatCompletionToolChoiceOption
} from "openai/src/resources/chat/completions";
import config from "../../config";
import OpenAI from "openai";
import {Chat, ChatCompletion} from "openai/resources";
import ChatCompletionMessageToolCall = Chat.ChatCompletionMessageToolCall;
import Choice = ChatCompletion.Choice;
import {ChatCompletionsOptions, LLM, Tool} from "../../types";


export class OpenAIClient implements LLM {

    private readonly client: OpenAI;

    constructor(private API_KEY = config.openaiApiKey || "",
                private tools?: Tool[]) {

        this.client = new OpenAI({apiKey: config.openaiApiKey})
    }

    setTools(tools: Tool[]) {
        this.tools = tools
        return this
    }

    async generate(messages: ChatCompletionMessageParam[], chatConfig ?: ChatCompletionsOptions | undefined): Promise<Choice | undefined> {


        const toolConfig = this.getLlmConfig();
        const configWithTools = {
            ...chatConfig,
            ...toolConfig
        }

        console.log("configWithTools: ", configWithTools)

        console.log('messages', messages)

        const chatResponse = configWithTools ?
            await this.client.chat.completions.create({
                messages: messages,
                model: chatConfig?.model || config.openaiLLMModel,
                tools: configWithTools.tools as ChatCompletionTool[],
                tool_choice: configWithTools.tool_choice as ChatCompletionToolChoiceOption
            }) :
            await this.client.chat.completions.create({
                messages: messages,
                model: chatConfig?.model || config.openaiLLMModel,
            })

        console.log('chatResponse', chatResponse, chatResponse.choices[0].message)

        if (chatResponse.choices[0].message?.tool_calls) {

            console.log('chatResponse.choices[0].message.toolCalls', chatResponse.choices[0].message.tool_calls)

            if (chatResponse.choices[0].message.tool_calls.length) {
                messages.push({
                    role: "assistant",
                    tool_calls: chatResponse.choices[0].message.tool_calls,
                    content: JSON.stringify(chatResponse.choices[0].message)
                })
                for (const toolCall of chatResponse.choices[0].message.tool_calls) {

                    const toolResponse = await this.executeToolCall(toolCall)

                    console.log('tool', toolCall)
                    console.log('toolResponse', toolResponse)

                    messages.push({
                        role: "tool",
                        tool_call_id: toolCall.id,
                        content: JSON.stringify(toolResponse)
                    })
                }

                return await this.generate(messages, chatConfig)
            }
        }

        console.log('overall messages: ', messages)
        return chatResponse.choices[0]
    }

    private getLlmConfig() {
        if (!this.tools) {
            return {}
        }
        return {
            tools: this.tools?.map(tool => tool.getSchema()),
            tool_choice: "auto"
        };
    }

    private async executeToolCall(toolCall: ChatCompletionMessageToolCall) {
        if (this.tools) {
            const tool = this.tools.find(tool => tool.name === toolCall.function.name)
            if (tool) {
                const args = JSON.parse(toolCall.function.arguments)
                return await tool.run(args)
            }
        }

        throw new Error("Tool not found")
    }
}