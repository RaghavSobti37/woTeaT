// Cosine Similarity and Recommendation Matching with Anti-Fatigue Modifiers

/**
 * Calculates the cosine similarity between two 5D vectors.
 * Vector dimensions: [Spicy, Sweet, Tangy, CaloricDensity, Traditional]
 * Values are floats [0.0, 1.0]
 */
export function calculateCosineSimilarity(vecA, vecB) {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Computes recommendations sorted by score, applying the 50% anti-fatigue penalty
 * on categories ordered recently.
 * 
 * @param {Array} userVector - [Spicy, Sweet, Tangy, CaloricDensity, Traditional]
 * @param {Array} restaurants - Full list of restaurants and dishes
 * @param {Array} recentCategories - Array of category names (strings) ordered recently
 * @returns {Array} List of matched dishes with scores and metadata
 */
export function getRecommendations(userVector, restaurants, recentCategories = []) {
  const recommendations = [];
  
  restaurants.forEach((restaurant) => {
    restaurant.dishes.forEach((dish) => {
      // Calculate baseline similarity
      const baseScore = calculateCosineSimilarity(userVector, dish.vector);
      
      // Check for anti-fatigue penalty
      // If dish category exists in recent categories, apply 50% penalty
      const isFatigued = recentCategories.includes(dish.category);
      const penalty = isFatigued ? 0.5 : 1.0;
      const finalScore = baseScore * penalty;
      
      recommendations.push({
        ...dish,
        restaurantName: restaurant.name,
        restaurantId: restaurant.id,
        baseScore: Math.round(baseScore * 100),
        finalScore: Math.round(finalScore * 100),
        isFatigued
      });
    });
  });
  
  // Sort by finalScore descending
  return recommendations.sort((a, b) => b.finalScore - a.finalScore);
}

/**
 * Calculates a taste vector based on swiped card answers.
 * Questions increase/decrease vector coefficients.
 */
export function calculateOnboardingVector(answers) {
  // Base default vector
  let baseVector = [0.5, 0.5, 0.5, 0.5, 0.5];
  
  if (!answers || answers.length === 0) return baseVector;
  
  // Custom weights mapping for onboarding answers
  // Each answer adds/subtracts weight from specific vector components
  answers.forEach((ans, idx) => {
    switch (idx) {
      case 0: // Q1: Flavor Bias (Spicy vs Sweet vs Savory/Umami)
        if (ans === 'A') baseVector[0] += 0.35; // Spicy up
        if (ans === 'B') baseVector[1] += 0.35; // Sweet up
        if (ans === 'C') { baseVector[0] += 0.1; baseVector[4] += 0.25; } // Savory / Traditional up
        break;
      case 1: // Q2: Texture Preference (Soft/Creamy vs Crunchy/Crispy vs Liquid/Soupy)
        if (ans === 'A') baseVector[3] += 0.25; // Creamy/Caloric up
        if (ans === 'B') baseVector[4] += 0.1; // Crunchy
        if (ans === 'C') baseVector[2] += 0.2; // Soupy/Tangy up
        break;
      case 2: // Q3: Culinary Heritage (Local Maharashtrian vs Indian vs Global)
        if (ans === 'A') { baseVector[4] += 0.35; baseVector[0] += 0.15; } // Local spicy traditional
        if (ans === 'B') baseVector[4] += 0.2; // Indian traditional
        if (ans === 'C') baseVector[4] -= 0.35; // Global (Traditional down)
        break;
      case 3: // Q4: Heavy vs Light (Caloric density, diet preferences)
        if (ans === 'A') baseVector[3] += 0.35; // Heavy/Caloric up
        if (ans === 'B') baseVector[3] -= 0.35; // Light/Caloric down
        if (ans === 'C') { baseVector[3] -= 0.1; baseVector[2] += 0.15; } // Balanced/Tangy up
        break;
      case 4: // Q5: Meal Timing Bias (Early bird breakfast vs Late-night spice cravings)
        if (ans === 'A') { baseVector[4] += 0.15; baseVector[1] += 0.15; } // Breakfast - sweet/traditional
        if (ans === 'B') baseVector[0] += 0.15; // Lunch - spicy
        if (ans === 'C') { baseVector[0] += 0.3; baseVector[3] += 0.15; } // Late night - heavy/spicy
        break;
      case 5: // Q6: Comfort Level (Homely traditional comfort vs Modern adventurous)
        if (ans === 'A') baseVector[4] += 0.35; // Homely traditional
        if (ans === 'B') { baseVector[4] -= 0.2; baseVector[2] += 0.25; } // Modern/tangy global
        if (ans === 'C') { baseVector[0] += 0.2; baseVector[4] += 0.1; } // Spicy street food
        break;
    }
  });
  
  // Clamp all components to [0.0, 1.0]
  return baseVector.map(val => Math.max(0.0, Math.min(1.0, val)));
}

/**
 * Evaluates vectors into a Soviet Culinary Persona name and text.
 */
export function getSovietPersona(vector) {
  const [spicy, sweet, tangy, caloric, traditional] = vector;
  
  // Logic to categorize
  if (spicy >= 0.7 && traditional >= 0.7) {
    return {
      title: "The Proletariat Misal Comrade",
      description: "You stand firm for absolute spices and local traditions. A true warrior of the wood-fired clay pots, conquering red rassa and fiery pav. Spices fuel the revolution!",
      stencil: "🌶️ COMRADE SPICE"
    };
  }
  
  if (traditional >= 0.7 && sweet >= 0.7) {
    return {
      title: "The Sweet Reformer",
      description: "You seek traditional sweet textures, puran poli dripping with ghee and hot saffron jalebi. You believe the sweetest rewards should be distributed equally to all hard-working citizens.",
      stencil: "🌀 SWEET UNION"
    };
  }
  
  if (traditional >= 0.6 && caloric >= 0.7) {
    return {
      title: "The Biryani Revolutionary",
      description: "You thrive on heavy local grains, rich Mughlai dum biryanis, and ghee mutton thalis. You require high-caloric fuel to complete your daily industrial objectives.",
      stencil: "🍗 HEAVY WHEAT"
    };
  }
  
  if (traditional < 0.4 && caloric >= 0.6) {
    return {
      title: "The Aristocrat Sula Gourmet",
      description: "You favor refined global elements, Italian wood-fired pizzas, gourmet paneer tikka, and vineyard grapes. You possess a premium, bourgeois palate that demands high craftsmanship.",
      stencil: "🍕 ELITE GOURMET"
    };
  }
  
  if (caloric < 0.4 && traditional >= 0.6) {
    return {
      title: "The Healthy Sabudana Partisan",
      description: "You appreciate light, fasting, traditional foods. Golden sabudana vadas and refreshing solkadhi. You work with efficient energy consumption, keeping your system light and pure.",
      stencil: "🥑 LIGHT PARTISAN"
    };
  }
  
  // Default fallback
  return {
    title: "The General Assembly Eater",
    description: "Your taste vectors are perfectly balanced across all axes. You eat what is served in the cafeteria, enjoying spicy, sweet, and global items with equal patriotic zeal.",
    stencil: "⭐ BALANCED COMMISSAR"
  };
}
