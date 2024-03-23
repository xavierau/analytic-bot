import {ChatCompletionMessageParam} from "openai/src/resources";
import {
    ChatMessageDTO,
    countChatMessages,
    createChatMessage,
    getChatMessages
} from "../database/repositories/chatMessage";
import {Memory} from "../types";

export class PostgresMemory implements Memory {
    constructor(
        private readonly identifier: string
    ) {
    }

    async getMessages(limit: number, meta: {
        [key: string]: any;
    }): Promise<ChatCompletionMessageParam[]> {
        return getChatMessages(this.identifier, limit)
            .then((results: ChatMessageDTO[]) => results.map((result: ChatMessageDTO) => {
                return {
                    role: result.role,
                    content: result.content,
                } as ChatCompletionMessageParam
            }).reverse())
    }

    async addMessage(message: ChatCompletionMessageParam, meta: { [key: string]: any; }): Promise<void> {
        await createChatMessage({
            identifier: this.identifier,
            role: message.role,
            content: (message.content) as string || "",
        })
    }

    async count(): Promise<number> {
        return countChatMessages(this.identifier)
            .then((count) => count)
    }

    getIdentifier(): string {
        return this.identifier
    }
}