export interface FilePreview {
    file: File;
    preview: string;
}

export interface DetectedIngredient {
  name: string;
  brand?: string;
  quantity_estimate: string;
  state: string;
  confidence: number;
  source_image_index: number;
}

export interface NutriEstimate {
  kcal_per_ration: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

export interface Recipe {
  title: string;
  rations: number;
  total_time_min: number;
  uses: string[];
  steps: string[];
  tips: string[];
  substitutions: string[];
  missing_minimal: string[];
  nutri_estimate: NutriEstimate;
}

export interface SavedRecipe {
    recipe: Recipe;
    rating: number;
}

export interface GeminiData {
  detected_ingredients: DetectedIngredient[];
  assumptions: string[];
  recipes: Recipe[];
  warnings: string[];
  next_actions: string[];
  summary: string;
}