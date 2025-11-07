import React, { useState, useCallback, useEffect, useRef } from 'react';
import { analyzeFridgeContents } from './services/geminiService';
import type { GeminiData, FilePreview, Recipe, SavedRecipe } from './types';
import ImageUploader from './components/ImageUploader';
import RecipeCard from './components/RecipeCard';
import Loader from './components/Loader';
import { SparklesIcon } from './components/icons/SparklesIcon';
import SavedRecipesView from './components/SavedRecipesView';
import TipsModal from './components/TipsModal';
import { MenuIcon } from './components/icons/MenuIcon';

const App: React.FC = () => {
    const [files, setFiles] = useState<FilePreview[]>([]);
    const [preferences, setPreferences] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<GeminiData | null>(null);
    const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
    const [view, setView] = useState<'generator' | 'saved'>('generator');
    const [isTipsModalOpen, setIsTipsModalOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        try {
            const storedRecipes = localStorage.getItem('savedRecipes');
            if (storedRecipes) {
                setSavedRecipes(JSON.parse(storedRecipes));
            }
        } catch (error) {
            console.error("Failed to parse saved recipes from localStorage", error);
            setSavedRecipes([]);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('savedRecipes', JSON.stringify(savedRecipes));
    }, [savedRecipes]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isMenuOpen]);


    const handleFileChange = (selectedFiles: FileList | null) => {
        if (selectedFiles) {
            const newFiles = Array.from(selectedFiles).map(file => ({
                file,
                preview: URL.createObjectURL(file),
            }));
            setFiles(prevFiles => [...prevFiles, ...newFiles]);
        }
    };

    const removeFile = (fileName: string) => {
        setFiles(prevFiles => prevFiles.filter(f => f.file.name !== fileName));
    };

    const handleSubmit = useCallback(async () => {
        if (files.length === 0) {
            setError('Por favor, sube al menos una foto de tu nevera.');
            return;
        }
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const responseText = await analyzeFridgeContents(files.map(f => f.file), preferences);
            
            try {
                const jsonData = JSON.parse(responseText);
                setResult(jsonData);
            } catch (parseError) {
                console.error("JSON parsing error:", parseError, "Response was:", responseText);
                setError("Hubo un error al procesar la respuesta del chef. Por favor, intenta de nuevo.");
            }

        } catch (err) {
            console.error(err);
            setError('Ocurrió un error al contactar al Chef AI. Revisa tu conexión e inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    }, [files, preferences]);

    const handleReset = () => {
        setFiles([]);
        setPreferences('');
        setResult(null);
        setError(null);
        setView('generator');
    };

    const handleSaveRecipe = (recipe: Recipe) => {
        setSavedRecipes(prev => {
            if (prev.find(r => r.recipe.title === recipe.title)) {
                return prev;
            }
            return [...prev, { recipe, rating: 0 }];
        });
    };

    const handleUnsaveRecipe = (recipeTitle: string) => {
        setSavedRecipes(prev => prev.filter(r => r.recipe.title !== recipeTitle));
    };

    const handleRateRecipe = (recipeTitle: string, rating: number) => {
        setSavedRecipes(prev =>
            prev.map(r => (r.recipe.title === recipeTitle ? { ...r, rating } : r))
        );
    };

    const isRecipeSaved = (recipeTitle: string) => {
        return savedRecipes.some(r => r.recipe.title === recipeTitle);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm sticky top-0 z-20">
                <div className="container mx-auto px-4 py-4 flex items-center justify-center relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(prev => !prev)}
                            className="text-gray-600 hover:text-green-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                            aria-label="Abrir menú"
                            aria-expanded={isMenuOpen}
                            aria-haspopup="true"
                        >
                            <MenuIcon className="w-6 h-6" />
                        </button>
                        {isMenuOpen && (
                            <div className="absolute top-full mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-30 ring-1 ring-black ring-opacity-5">
                                <button
                                    onClick={() => { setView('saved'); setIsMenuOpen(false); }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Mis Recetas Guardadas
                                </button>
                                <button
                                    onClick={() => { setIsTipsModalOpen(true); setIsMenuOpen(false); }}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    Trucos de Cocina
                                </button>
                            </div>
                        )}
                    </div>
                    <h1 
                        className="text-3xl md:text-4xl font-display text-green-800 cursor-pointer"
                        onClick={handleReset}
                    >
                        AIChef
                    </h1>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 md:py-12">
               {view === 'generator' && (
                 <>
                    {!result && (
                        <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 rounded-2xl shadow-lg animate-fade-in">
                            <div className="text-center mb-6">
                                <h2 className="text-2xl font-bold text-gray-700 mb-2">Hola, soy AIChef</h2>
                                <p className="text-gray-500">Sube fotos de tu nevera y despensa, y te daré recetas al instante.</p>
                            </div>

                            <ImageUploader files={files} onFileChange={handleFileChange} onRemoveFile={removeFile} />

                            <div className="mt-6">
                                <label htmlFor="preferences" className="block text-sm font-medium text-gray-700 mb-2">
                                    Preferencias y Restricciones (opcional)
                                </label>
                                <textarea
                                    id="preferences"
                                    value={preferences}
                                    onChange={(e) => setPreferences(e.target.value)}
                                    rows={4}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-shadow"
                                    placeholder="Ej: vegetariano, sin gluten, 2 raciones, tengo airfryer..."
                                />
                            </div>

                            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}

                            <div className="mt-8">
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || files.length === 0}
                                    className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-transform transform hover:scale-105"
                                >
                                    {loading ? <Loader /> : <>
                                        <SparklesIcon className="w-5 h-5 mr-2"/>
                                        Analizar con AIChef
                                    </>}
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {loading && !result && (
                        <div className="text-center mt-8 text-gray-600">
                            <p>AIChef está pensando... 🧑‍🍳</p>
                        </div>
                    )}


                    {result && (
                        <div className="max-w-4xl mx-auto animate-fade-in">
                            <div className="bg-white p-6 rounded-2xl shadow-lg mb-8">
                                <h2 className="text-2xl font-display text-green-800 mb-3">Resumen de AIChef</h2>
                                <p className="text-gray-600 whitespace-pre-wrap">{result.summary}</p>
                            </div>

                            <h2 className="text-3xl font-display text-center text-green-800 mb-8">Recetas Sugeridas</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {result.recipes.map((recipe, index) => (
                                    <RecipeCard 
                                        key={index} 
                                        recipe={recipe}
                                        onSave={() => handleSaveRecipe(recipe)}
                                        onUnsave={() => handleUnsaveRecipe(recipe.title)}
                                        isSaved={isRecipeSaved(recipe.title)}
                                    />
                                ))}
                            </div>

                            {result.detected_ingredients.length > 0 && (
                                <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
                                    <h3 className="text-xl font-display text-green-800 mb-4">Ingredientes Detectados</h3>
                                    <ul className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-700">
                                        {result.detected_ingredients.map((ing, i) => (
                                            <li key={i} className="bg-green-50 p-2 rounded-md capitalize">{ing.name} <span className="text-xs text-gray-400">({(ing.confidence * 100).toFixed(0)}%)</span></li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            
                            {(result.warnings.length > 0 || result.assumptions.length > 0) && (
                                <div className="grid md:grid-cols-2 gap-6 mt-8">
                                    {result.warnings.length > 0 && 
                                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                                            <h4 className="font-bold text-yellow-800">Advertencias</h4>
                                            <ul className="list-disc list-inside text-sm text-yellow-700 mt-1">
                                                {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
                                            </ul>
                                        </div>
                                    }
                                    {result.assumptions.length > 0 && 
                                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                                            <h4 className="font-bold text-blue-800">Asunciones</h4>
                                            <ul className="list-disc list-inside text-sm text-blue-700 mt-1">
                                                {result.assumptions.map((a, i) => <li key={i}>{a}</li>)}
                                            </ul>
                                        </div>
                                    }
                                </div>
                            )}

                            <div className="text-center mt-12">
                                <button
                                    onClick={handleReset}
                                    className="bg-gray-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 transition-colors"
                                >
                                    Empezar de Nuevo
                                </button>
                            </div>
                        </div>
                    )}
                 </>
               )}

                {view === 'saved' && (
                    <SavedRecipesView 
                        savedRecipes={savedRecipes}
                        onUnsave={handleUnsaveRecipe}
                        onRate={handleRateRecipe}
                    />
                )}
            </main>
            <TipsModal isOpen={isTipsModalOpen} onClose={() => setIsTipsModalOpen(false)} />
        </div>
    );
};

export default App;