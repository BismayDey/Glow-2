import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with safety settings
const genAI = new GoogleGenerativeAI('AIzaSyA23oHXypcQpV6UuzGoEwqrrdbNuZuhKSI');

const safetySettings = [
  {
    category: 'HARM_CATEGORY_HARASSMENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_HATE_SPEECH',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
  {
    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
    threshold: 'BLOCK_MEDIUM_AND_ABOVE',
  },
];

export async function generateProductDescription(productName: string, category: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      safetySettings,
    });
    
    const prompt = `Create a brief, luxurious product description for a ${category} product named "${productName}".
                   Focus on:
                   - Key benefits and features
                   - Premium quality aspects
                   - Unique selling points
                   Keep it under 50 words and maintain a sophisticated tone.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('Empty response from API');
    }
    
    return text;
  } catch (error) {
    console.error('Error generating description:', error);
    return getDefaultDescription(category);
  }
}

export async function generateProductTips(category: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-pro',
      safetySettings,
    });
    
    const prompt = `Share one professional beauty tip for ${category} products.
                   Requirements:
                   - Must be practical and specific
                   - Focus on application technique
                   - Include a benefit
                   Keep it under 30 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    if (!text) {
      throw new Error('Empty response from API');
    }
    
    return text;
  } catch (error) {
    console.error('Error generating tip:', error);
    return getDefaultTip(category);
  }
}

function getDefaultDescription(category: string): string {
  const descriptions = {
    'Skincare': 'Experience transformative skincare with this premium formula, designed to nourish and rejuvenate your complexion with carefully selected ingredients.',
    'Makeup': 'Elevate your beauty routine with this luxurious makeup essential, crafted for flawless application and long-lasting results.',
    'Tools': 'Enhance your beauty ritual with this professionally designed tool, engineered for optimal results and ultimate comfort.',
    'default': 'Discover luxury beauty with this premium product, meticulously crafted for exceptional results.'
  };
  
  return descriptions[category as keyof typeof descriptions] || descriptions.default;
}

function getDefaultTip(category: string): string {
  const tips = {
    'Skincare': 'Apply to clean, slightly damp skin using gentle upward motions for optimal absorption.',
    'Makeup': 'Start with a small amount and build gradually for the most natural-looking finish.',
    'Tools': 'Clean your beauty tools regularly with gentle soap and water for best results.',
    'default': 'Use with gentle, consistent motions for best results.'
  };
  
  return tips[category as keyof typeof tips] || tips.default;
}