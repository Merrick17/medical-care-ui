export class GeminiService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.baseUrl = "https://generativelanguage.googleapis.com/v1beta";
  }

  async generateContent(prompt: string) {
    try {
      const response = await fetch(
        `${this.baseUrl}/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }]
              }
            ]
          })
        }
      );

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Error generating content:", error);
      throw error;
    }
  }

  async chatWithContext(messages: { role: "user" | "assistant"; content: string }[]) {
    try {
      // Convert chat history to a structured prompt
      const formattedPrompt = messages
        .map(msg => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n") + "\nAssistant:";

      const response = await this.generateContent(formattedPrompt);
      return response;
    } catch (error) {
      console.error("Error in chat:", error);
      throw error;
    }
  }
} 