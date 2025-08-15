// API client for interacting with the AI gateway

// Base URL for the API
const API_BASE_URL = "https://secret-ai-gateway.onrender.com";

// Available models (Render API)
export type AIModel = "gemini-2.5-flash" | "gemini-2.5-pro" | "gemini-2.0-flash";

// Function to get available models
export async function getModels() {
	try {
		const response = await fetch(`${API_BASE_URL}/api/models`, {
			headers: {
				"Accept": "application/json"
			}
		});
		if (!response.ok) {
			throw new Error(`Failed to fetch models: ${response.status}`);
		}
		return await response.json();
	} catch (error) {
		console.error("Error fetching models:", error);
		return { models: ["gemini-2.5-flash", "gemini-2.5-pro", "gemini-2.0-flash"] };
	}
}

// Function to check API health
export async function checkHealth() {
	try {
		const response = await fetch(`${API_BASE_URL}/api/health`, {
			headers: {
				Accept: "application/json",
			},
		});
		return response.ok;
	} catch (error) {
		console.error("Health check failed:", error);
		return false;
	}
}

// Function to get chat response
export async function getChatResponse(
	prompt: string,
	model: AIModel = "gemini-2.5-flash"
) {
	try {
		const q = new URLSearchParams({ prompt, model });
		const response = await fetch(`${API_BASE_URL}/api/chat?${q.toString()}`, {
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`Chat API error: ${response.status}`, errorText);
			throw new Error(`Chat API error: ${response.status}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error getting chat response:", error);
		throw error;
	}
}

// Improve prompt (JSON body)
export async function improvePrompt(prompt: string, target: "text" | "image" = "text") {
	try {
		const response = await fetch(`${API_BASE_URL}/api/improve-prompt`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify({ prompt, target }),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`Improve prompt API error: ${response.status}`, errorText);
			// Return original prompt if fail
			return prompt;
		}

		const result = await response.json();
		// Try common fields
		if (typeof result === "string") return result;
		if (result?.response) return result.response;
		if (result?.prompt) return result.prompt;
		if (result?.improved) return result.improved;
		return prompt;
	} catch (error) {
		console.error("Error improving prompt:", error);
		return prompt;
	}
}
