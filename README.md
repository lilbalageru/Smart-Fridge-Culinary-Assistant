# 🧑‍🍳 Smart Fridge & Culinary Assistant

An intelligent web application that analyzes a photo of your fridge's contents and suggests delicious recipes you can make, complete with dietary filters, a "cooking mode," and a shopping list for missing items.

This project uses **React**, **TypeScript**, and the **Google Gemini API** for powerful image analysis and recipe generation.

## ✨ Core Features

* **📷 AI-Powered Ingredient Recognition:** Upload a photo of your fridge, and the Gemini API will identify the ingredients you have on hand.
* **🍲 Smart Recipe Suggestions:** Get a list of personalized recipes based on your available ingredients.
* **✅ Dietary Filters:** Filter recipes by common dietary preferences like "Vegetarian," "Gluten-Free," "Keto," and more.
* **▶️ Interactive Cooking Mode:** Select a recipe to enter a step-by-step "cooking view," making it easy to follow along.
* **🛒 Dynamic Shopping List:** Automatically add missing ingredients from a recipe to your shopping list with a single click.
* **📱 Responsive Design:** A clean, mobile-first interface built with **Tailwind CSS**.

## 🚀 Tech Stack

* **Frontend:** React (Vite)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **AI:** Google Gemini API (`@google/genai`)
* **Icons:** Lucide React (`lucide-react`)

## ▶️ Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

You will need [Node.js](https://nodejs.org/) (v18 or newer) installed on your computer.

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone https://github.com/lilbalageru/Smart-Fridge-Culinar
    cd smart-fridge-assistant
    ```

2.  **Install dependencies:**
    ```sh
    npm install
    ```

3.  **Set up your Environment Variables:**
    This project requires a Google Gemini API key.

    * Create a file named `.env.local` in the root of the project.
    * Add your API key to this file:
        ```
        GEMINI_API_KEY=YOUR_API_KEY_HERE
        ```
    * You can get an API key from [Google AI Studio](https://aistudio.google.com/).

4.  **Run the development server:**
    ```sh
    npm run dev
    ```
    Your application should now be running at `http://localhost:5173` (or the next available port).

## 📂 Key Project Files

* `public/`: Static assets.
* `src/`:
    * `components/`: Reusable React components (e.g., `ImageUploader.tsx`, `RecipeList.tsx`).
    * `services/`:
        * `geminiService.ts`: Contains the logic for communicating with the Gemini API.
    * `App.tsx`: The main application component, managing state and views.
    * `constants.ts`: Static data, like the `DIETARY_OPTIONS` array.
    * `types.ts`: TypeScript interfaces for data structures like `Recipe` and `GeminiResponse`.
* `.env.local`: Stores the Gemini API key (this file is git-ignored).
* `index.html`: The main HTML entry point.
* `package.json`: Project dependencies and scripts.
