import React from 'react';
import type { SavedRecipe } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import StarRating from './StarRating';

interface SavedRecipesViewProps {
    savedRecipes: SavedRecipe[];
    onUnsave: (recipeTitle: string) => void;
    onRate: (recipeTitle: string, rating: number) => void;
}

const SavedRecipesView: React.FC<SavedRecipesViewProps> = ({ savedRecipes, onUnsave, onRate }) => {
    if (savedRecipes.length === 0) {
        return (
            <div className="text-center py-16">
                <h2 className="text-2xl font-display text-gray-700">No tienes recetas guardadas</h2>
                <p className="text-gray-500 mt-2">¡Guarda tus recetas favoritas para verlas aquí!</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-3xl font-display text-center text-green-800 mb-8">Mis Recetas Guardadas</h2>
            <div className="space-y-6">
                {savedRecipes.map(({ recipe, rating }) => (
                    <div key={recipe.title} className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex justify-between items-start">
                            <h3 className="text-2xl font-display text-black mb-2">{recipe.title}</h3>
                            <button 
                                onClick={() => onUnsave(recipe.title)} 
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                aria-label="Eliminar receta"
                            >
                                <TrashIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">{recipe.total_time_min} min • {recipe.rations} raciones</p>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">Pasos:</h4>
                                <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm">
                                    {recipe.steps.map((step, index) => (
                                        <li key={index}>{step}</li>
                                    ))}
                                </ol>
                            </div>
                            <div>
                                <h4 className="font-semibold text-gray-700 mb-2">Tu Puntuación:</h4>
                                <StarRating rating={rating} onRating={(newRating) => onRate(recipe.title, newRating)} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SavedRecipesView;