/**
 * Zoho Catalyst Generative AI Service (Simulated)
 * 
 * This service mimics a backend API call to Zoho Catalyst.
 * It currently uses a simulated delay and mock data. Once the real API
 * is available, you can simply replace the contents of `generateZiaResponse`
 * with a real `fetch()` call to your Catalyst endpoint.
 */


/**
 * Simulates a call to Zoho Catalyst GenAI.
 * 
 * @param {string} query - The user's input text
 * @param {string} language - The selected language (e.g., 'English' or 'Kannada')
 * @returns {Promise<Object>} The structured response containing text, type, and optional data payload.
 */
export const generateZiaResponse = async (query, language) => {
  try {
    const API_URL = window.location.hostname === 'localhost' 
      ? '/catalyst-api/chat' 
      : 'https://ksp-sentinai-60076496338.development.catalystserverless.in/chat';

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, language })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Zoho Catalyst API Error:", error);
    return {
      text: "I am having trouble connecting to the Zoho Catalyst servers right now. Please make sure the backend function is deployed and running.",
      type: 'text',
      data: null
    };
  }
};
