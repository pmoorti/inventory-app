import dotenv from "dotenv";
import {GoogleGenerativeAI} from '@google/generative-ai'

dotenv.config();

const genAI= new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMMA_API_KEY)

export async function generateRecipeWithGemma(ingredients) {
    // Ensure we have a valid API key
    if (!process.env.NEXT_PUBLIC_GEMMA_API_KEY) {
      throw new Error('GEMMA_API_KEY is not set in the environment variables');
    }
  
    try {
      // Initialize the model
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
      // Construct the prompt
      const prompt = `Generate a recipe using the following ingredients: ${ingredients.join(', ')}. 
      Please format the recipe with a title, ingredients list, and step-by-step instructions.`;
  
      // Generate content
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
  
      return text;
    } catch (error) {
      console.error('Error generating recipe with Gemma:', error);
      throw new Error(`Failed to generate recipe: ${error.message}`);

    }
  }