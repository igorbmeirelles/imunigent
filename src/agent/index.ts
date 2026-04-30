import { createAgent, initChatModel, tool } from "langchain";

import { MemorySaver } from "@langchain/langgraph";
import { getVaccinesTool } from "../tools/get-vaccines";
import { vec_search } from "../tools/vector-search";
import { fetchTextFromUrl } from "../tools/internet-search";
import { SYSTEM_PROMPT } from "../prompts/agent";

export async function execute(): Promise<string> {
  const model = await initChatModel("gpt-5.4", {
    temperature: 0.5,
    maxTokens: 25000,
  });
  const checkpointer = new MemorySaver();

  const agent = createAgent({
    model,
    tools: [fetchTextFromUrl, vec_search, getVaccinesTool],
    systemPrompt: SYSTEM_PROMPT,
    checkpointer,
  });

  try {
    const response = await agent.invoke(
      {
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Monte um cronograma de vacinação para criança que perdeu todas as vacinas após 6 meses de idade.",
              },
            ],
          },
        ],
      },
      {
        configurable: {
          thread_id: "default",
        },
      },
    );

    const messages = response.messages;

    return messages[messages.length - 1]!.content as string;
  } catch (ex) {
    return "Ocorreu um erro ao tentar responder, por favor tente mais tarde";
  }
}
