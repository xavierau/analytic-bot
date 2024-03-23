import OpenAI from "openai";
import FunctionDefinition = OpenAI.FunctionDefinition;
import {ChatCompletionMessageParam, ChatCompletionTool} from "openai/src/resources/chat/completions";
import {ChatCompletion} from "openai/resources";
import Choice = ChatCompletion.Choice;

export type ChatCompletionsOptions = {
    tools?: FunctionDefinition[],
    tool_choice?: "auto" | "none" | { "type": "function", "function": { "name": string } }
    model?: string,
}

export interface ToolResponse {
    status: string
    result: any,
    message?: string,
    errors?: object[]
}

export interface Tool {
    name: string
    description: string

    getSchema(): ChatCompletionTool

    run(args: any): Promise<ToolResponse>
}

export interface LLM {
    generate(messages: ChatCompletionMessageParam[], config?: ChatCompletionsOptions): Promise<Choice | undefined>
}

export interface Memory {
    getMessages(limit: number, meta: { [key: string]: any }):
        ChatCompletionMessageParam[] | Promise<ChatCompletionMessageParam[]>

    addMessage(message: ChatCompletionMessageParam, meta: { [key: string]: any }): void

    count(): Promise<number> | number

    getIdentifier(): string
}

export interface Embedding {
    encode(text: string, model: string): Promise<{ embedding: Array<number>, tokens: number }>
}
