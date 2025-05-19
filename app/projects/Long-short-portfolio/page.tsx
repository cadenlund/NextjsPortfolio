"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import markdownContent from "./content"; // ← Import your .ts file with markdown
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeRaw from "rehype-raw";


export default function AlphaFactorPage() {
    return (
        <motion.div
            initial={{ scale: 0.2, opacity: 0, originX: 0.5, originY: 0.5 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 bg-gray-300 dark:bg-neutral-900 overflow-auto p-6"
        >
            <Link
                href="/projects"
                className="fixed top-6 left-6 bg-gray-400 dark:bg-neutral-800 px-3 py-1 rounded-lg text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-500 dark:hover:bg-neutral-700 z-50"
            >
                ← Back
            </Link>

            <div className="w-full max-w-7xl mx-auto mt-16 bg-gray-200 dark:bg-neutral-800 px-12 py-8 rounded-2xl shadow-lg">
                <article className="prose dark:prose-invert max-w-none prose-pre:bg-transparent prose-pre:p-0 prose-pre:shadow-none prose-pre:border-0">
                    <ReactMarkdown rehypePlugins={[rehypeRaw]}
                        components={{
                            code({ node, inline, className, children, ...props }) {
                                const match = /language-(\w+)/.exec(className || "");
                                if (!inline && match) {
                                    return (
                                        <SyntaxHighlighter
                                            style={vscDarkPlus}
                                            language={match[1]}
                                            PreTag="div"
                                            {...props}
                                        >
                                            {String(children).replace(/\n$/, "")}
                                        </SyntaxHighlighter>
                                    );
                                }
                                return <code className={className} {...props}>{children}</code>;
                            },
                        }}
                    >
                        {markdownContent}
                    </ReactMarkdown>
                </article>
            </div>
        </motion.div>
    );
}
