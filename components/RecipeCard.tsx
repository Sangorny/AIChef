import React from 'react';
import type { Recipe } from '../types';
import { StarIcon } from './icons/StarIcon';

interface RecipeCardProps {
    recipe: Recipe;
    onSave: () => void;
    onUnsave: () => void;
    isSaved: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSave, onUnsave, isSaved }) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
            <div className="p-6 flex-grow">
                <div className="flex justify-between items-start">
                    <div className="uppercase tracking-wide text-sm text-green-600 font-semibold">{recipe.total_time_min} min • {recipe.rations} raciones</div>
                    <button 
                        onClick={isSaved ? onUnsave : onSave} 
                        className="text-gray-400 hover:text-yellow-500 transition-colors"
                        aria-label={isSaved ? 'Quitar de guardados' : 'Guardar receta'}
                    >
                        <StarIcon className={`w-6 h-6 ${isSaved ? 'text-yellow-400' : ''}`} solid={isSaved} />
                    </button>
                </div>
                <h3 className="block mt-1 text-xl leading-tight font-bold text-black font-display">{recipe.title}</h3>
                
                <div className="mt-4">
                    <h4 className="font-semibold text-gray-700 mb-2">Pasos:</h4>
                    <ol className="list-decimal list-inside space-y-2 text-gray-600 text-sm">
                        {recipe.steps.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>
                </div>

                {recipe.missing_minimal.length > 0 && (
                     <div className="mt-4">
                        <h4 className="font-semibold text-gray-700 text-sm">Necesitarás:</h4>
                        <p className="text-gray-500 text-sm capitalize">{recipe.missing_minimal.join(', ')}</p>
                    </div>
                )}
            </div>
             <div className="p-6 bg-gray-50 mt-auto">
                 <h4 className="font-semibold text-gray-700 text-sm mb-2">Consejos y Sustituciones:</h4>
                 <ul className="list-disc list-inside space-y-1 text-gray-500 text-xs">
                     {recipe.tips.map((tip, i) => <li key={`tip-${i}`}>{tip}</li>)}
                     {recipe.substitutions.map((sub, i) => <li key={`sub-${i}`}>{sub}</li>)}
                 </ul>
             </div>
        </div>
    );
};

export default RecipeCard;