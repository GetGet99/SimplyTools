export { }
declare global {
    // ------------------- Enums -------------------
    type LanguageModelMessageRole  = "system" | "user" |  "assistant"
    type LanguageModelMessageType  = "text" | "image" |  "audio"

    // ------------------- Type Aliases -------------------
    type LanguageModelMessageValue = ImageBitmapSource | AudioBuffer | BufferSource | string;

    type LanguageModelPrompt =
        | LanguageModelMessage[]
        | string;

    type LanguageModelToolFunction = (...args: any[]) => Promise<string>;

    // ------------------- Interfaces -------------------
    interface LanguageModelMessageContent {
        type: LanguageModelMessageType;
        value: LanguageModelMessageValue;
    }

    interface LanguageModelMessage {
        role: LanguageModelMessageRole;
        content: string | LanguageModelMessageContent[];
        prefix?: boolean;
    }

    interface LanguageModelTool {
        name: string;
        description: string;
        inputSchema: object;
        execute: LanguageModelToolFunction;
    }

    interface LanguageModelExpected {
        type: LanguageModelMessageType;
        languages: string[];
    }

    interface LanguageModelCreateCoreOptions {
        topK?: number;          // unrestricted double -> number
        temperature?: number;   // unrestricted double -> number
        expectedInputs?: LanguageModelExpected[];
        expectedOutputs?: LanguageModelExpected[];
        tools?: LanguageModelTool[];
    }

    interface LanguageModelCreateOptions extends LanguageModelCreateCoreOptions {
        signal?: AbortSignal;
        monitor?: CreateMonitorCallback;
        initialPrompts?: LanguageModelMessage[];
    }

    interface LanguageModelPromptOptions {
        responseConstraint?: object;
        omitResponseConstraintInput?: boolean;
        signal?: AbortSignal;
    }

    interface LanguageModelAppendOptions {
        signal?: AbortSignal;
    }

    interface LanguageModelCloneOptions {
        signal?: AbortSignal;
    }

    interface LanguageModelParams {
        readonly defaultTopK: number;
        readonly maxTopK: number;
        readonly defaultTemperature: number;
        readonly maxTemperature: number;
    }

    // ------------------- Main Interface -------------------
    interface LanguageModel extends EventTarget {
        readonly inputUsage: number;
        readonly inputQuota: number;
        onquotaoverflow: ((this: LanguageModel, ev: Event) => any) | null;
        readonly topK: number;
        readonly temperature: number;

        prompt(input: LanguageModelPrompt, options?: LanguageModelPromptOptions): Promise<string>;
        promptStreaming(input: LanguageModelPrompt, options?: LanguageModelPromptOptions): ReadableStream;
        append(input: LanguageModelPrompt, options?: LanguageModelAppendOptions): Promise<void>;
        measureInputUsage(input: LanguageModelPrompt, options?: LanguageModelPromptOptions): Promise<number>;
        clone(options?: LanguageModelCloneOptions): Promise<LanguageModel>;
        destroy(): void;

        // Static methods
        // Using namespace pattern in TS for static methods
    }

    interface LanguageModelConstructor {
        create(options?: LanguageModelCreateOptions): Promise<LanguageModel>;
        availability(options?: LanguageModelCreateCoreOptions): Promise<Availability>;
        params(): Promise<LanguageModelParams | null>;
    }

    declare const LanguageModel: LanguageModelConstructor;
}
