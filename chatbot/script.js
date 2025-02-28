// Configuration
const API_KEY = "AIzaSyCrydV3m7F0O_XduAnNdTaqpz8e7aAzlQc";
const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

let chatHistory = [];

// Ajout du contexte d'expert en maintenance
const EXPERT_CONTEXT = `Tu es un expert en maintenance informatique avec plus de 10 ans d'expérience. 
Tu dois :
- Répondre de manière professionnelle et précise
- Donner des solutions étape par étape
- Expliquer les termes techniques si nécessaire
- Proposer des solutions alternatives si possible
- Donner des conseils de prévention
- Rester focalisé sur les problèmes informatiques
- Demander des précisions si nécessaire pour mieux diagnostiquer
- Utiliser un langage technique mais compréhensible
- Si la question n'est pas liée à l'informatique, réponds poliment que tu es spécialisé en maintenance informatique
- Si tu ne peux pas résoudre un problème, recommande de contacter un professionnel en précisant pourquoi.`;

function addMessageToChat(message, isUser = false) {
  const chatContainer = document.getElementById("chat-container");
  const messageDiv = document.createElement("div");
  messageDiv.className = `flex ${isUser ? "justify-end" : "justify-start"}`;

  messageDiv.innerHTML = `
        <div class="max-w-[70%] ${
          isUser ? "bg-blue-500 text-white" : "bg-gray-200"
        } rounded-lg px-4 py-2">
            ${message}
        </div>
    `;

  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
  const inputElement = document.getElementById("user-input");
  const userMessage = inputElement.value.trim();

  if (!userMessage) return;

  // Afficher le message de l'utilisateur
  addMessageToChat(userMessage, true);

  // Vider l'input
  inputElement.value = "";

  try {
    // Modification pour inclure le contexte à chaque message
    const requestData = {
      contents: [
        {
          parts: [
            {
              text: `${EXPERT_CONTEXT}\n\nQuestion de l'utilisateur: ${userMessage}\n\nRéponds en tant qu'expert en maintenance informatique:`,
            },
          ],
        },
      ],
    };

    const response = await fetch(`${API_URL}?key=${API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();
    const botResponse = data.candidates[0].content.parts[0].text;

    // Ajouter à l'historique
    chatHistory.push(
      { role: "user", message: userMessage },
      { role: "bot", message: botResponse }
    );

    // Afficher la réponse
    addMessageToChat(botResponse, false);
  } catch (error) {
    console.error("Erreur:", error);
    addMessageToChat(
      "Désolé, une erreur est survenue. Veuillez réessayer ou contacter un support technique.",
      false
    );
  }
}

// Gérer l'envoi avec la touche Entrée
document.getElementById("user-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    sendMessage();
  }
});

// Rendre sendMessage accessible globalement
window.sendMessage = sendMessage;
