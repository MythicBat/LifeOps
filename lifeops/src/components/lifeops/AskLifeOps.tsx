"use client";

import { useState } from "react";

import { ArrowUp, Sparkles } from "lucide-react";

import { runLifeOpsCommand, type LifeOpsCommandResult } from "@/lib/command-center";
import { CommandResult } from "./CommandResult";

interface Message {
    role: "user" | "assistant";
    content : string;
}

export function AskLifeOps() {
    const [input, setInput] = useState("");

    const [messages, setMessages] = useState<Message[]>([]);

    const [sessionId, setSessionId] = useState<string | null>(null);

    const [loading, setLoading] = useState(false);

    const [commandResult, setCommandResult] = useState<LifeOpsCommandResult | null>(null);

    const submit = async(event: React.SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();

        const message = input.trim();

        const commandPrompts = [
            "clean up my month",
            "review my month",
            "organise my month",
            "what needs my attention",
            "review my subscriptions",
        ];

        const shouldUseCommandCenter = commandPrompts.some((command) => 
            message.toLowerCase().includes(command));

        if (!message || loading) { return; }

        setMessages((current) => [
            ...current,
            {
                role: "user",
                content: message,
            },
        ]);

        setInput("");
        setLoading(true);

        try {
            if (shouldUseCommandCenter) {
                try {
                    setCommandResult(null);

                    const result = await runLifeOpsCommand(message);

                    setCommandResult(result);

                    setMessages((current) => [
                        ...current,
                        {
                            role: "assistant",
                            content: result.summary,
                        },
                    ]);
                } catch (error) {
                    console.error(error);

                    setMessages((current) => [
                        ...current,
                        {
                            role: "assistant",
                            content: "I could not complete that LifeOps command.",
                        },
                    ]);
                } finally {
                    setLoading(false);
                }

                return;
            }

            const response = await fetch("/api/ask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message,
                    userId: "demo-user",
                    sessionId,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.detail || data.error || "LifeOps could not respond."
                );
            }
            
            setSessionId(data.sessionId);
            setMessages((current) => [
                ...current,
                {
                    role: "assistant",
                    content: data.answer,
                },
            ]);
        } catch (error) {
            console.error(error);

            setMessages((current) => [
                ...current,
                {
                    role: "assistant",
                    content: "I could not reach LifeOps agent.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="overflow-hidden rounded-[32px] border border-black/[0.05] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.035)]">
            {messages.length > 0 && (
                <div className="max-h-[420px] space-y-5 overflow-y-auto p-6 sm:p-8">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
                        >
                            <div className={message.role === "user"
                                ? "max-w-[78%] rounded-[22px] bg-zinc-950 px-4 py-3 text-sm leading-6 text-white"
                                : "max-w-[86%] text-[15px] leading-7 text-zinc-700"
                            }>
                                {message.content}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <Sparkles size={14} />
                            LifeOps is thinking...
                        </div>
                    )}
                </div>
            )}

            {messages.length === 0 && (
                <div className="px-7 pb-2 pt-8 sm:px-8">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[15px] bg-zinc-950 text-white">
                        <Sparkles size={17} />
                    </div>

                    <h2 className="mt-6 text-[26px] font-semibold tracking-[-0.04em] text-zinc-950">
                        Ask LifeOps
                    </h2>

                    <p className="mt-2 max-w-md text-sm leading-6 text-zinc-400">
                        Ask about anything LifeOps is tracking across your life.
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                        {[
                            "What needs my attention?",
                            "What's coming up?",
                            "Review my subscriptions",
                            "Clean up my month",
                        ].map((prompt) => (
                            <button
                                key={prompt}
                                type="button"
                                onClick={() => setInput(prompt)}
                                className="rounded-full border border-black/[0.06] bg-white px-3.5 py-2 text-xs font-medium text-zinc-500 transition hover:border-black/[0.12] hover:text-zinc-950"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {commandResult && (
                <div className="px-4 pb-2 sm:px-5">
                    <CommandResult 
                        result={commandResult}
                        onDecision={() => {
                            document.getElementById("decisions")?.scrollIntoView({
                                behavior: "smooth",
                                block: "start"
                            });
                        }}
                    />
                </div>
            )}

            <form
                onSubmit={submit}
                className="p-4 sm:p-5"
            >
                <div className="flex items-center gap-3 rounded-[22px] bg-[#f5f5f7] p-2 pl-5">
                    <input
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder="What needs my attention?"
                        className="min-w-0 flex-1 bg-transparent py-2 text-[15px] text-zinc-950 outline-none placeholder:text-zinc-400"
                    />

                    <button
                        type="button"
                        disabled={loading || !input.trim()}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-white transition hover:scale-[1.03] disabled:opacity-30"
                    >
                        <ArrowUp size={17} />
                    </button>
                </div>
            </form>
        </div>
    );
}