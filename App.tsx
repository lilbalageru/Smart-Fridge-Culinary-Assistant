
import React, { useState, useMemo, useCallback } from 'react';
import { DIETARY_OPTIONS } from './constants';
import { analyzeFridgeAndSuggestRecipes } from './services/geminiService';
import { Recipe, GeminiResponse } from './types';
import ImageUploader from './components/ImageUploader';
import RecipeList from './components/RecipeList';
import CookingModeView from './components/CookingModeView';
import Sidebar from './components/Sidebar';
import ShoppingList from './components/ShoppingList';
import { ChefHat, ShoppingCart, UtensilsCrossed } from 'lucide-react';

type AppState = 'initial' | 'loading' | 'results' | 'error';
type ActiveTab = 'recipes' | 'shoppingList';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('initial');
  const [errorMessage, setErrorMessage] = useState<string>('');
  
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [geminiResponse, setGeminiResponse] = useState<GeminiResponse | null>(null);
  
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [shoppingList, setShoppingList] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('recipes');

  const handleImageUpload = async (file: File) => {
    setAppState('loading');
    setUploadedImage(null);
    setGeminiResponse(null);
    setActiveTab('recipes');

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(',')[1];
      setUploadedImage(URL.createObjectURL(file));
      try {
        const response = await analyzeFridgeAndSuggestRecipes(base64String, activeFilters);
        setGeminiResponse(response);
        setAppState('results');
      } catch (error) {
        setAppState('error');
        setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred.');
      }
    };
    reader.onerror = () => {
        setAppState('error');
        setErrorMessage('Failed to read the image file.');
    };
    reader.readAsDataURL(file);
  };

  const handleFilterChange = useCallback((filters: string[]) => {
    setActiveFilters(filters);
    if(uploadedImage && geminiResponse) {
        // This is a placeholder for re-fetching with new filters.
        // For now, it just sets the filters for the next fetch.
        // A more advanced version could re-trigger the API call.
        console.log("Filters changed. Next image upload will use:", filters);
    }
  }, [uploadedImage, geminiResponse]);

  const handleAddToShoppingList = useCallback((item: string) => {
    setShoppingList((prev) => (prev.includes(item) ? prev : [...prev, item]));
  }, []);

  const handleRemoveFromShoppingList = useCallback((itemToRemove: string) => {
    setShoppingList(prev => prev.filter(item => item !== itemToRemove));
  }, []);

  const filteredRecipes = useMemo(() => {
    if (!geminiResponse?.recipes) return [];
    // Note: The primary filtering is done via the Gemini prompt. 
    // This client-side filter could be used for further refinement if needed.
    return geminiResponse.recipes;
  }, [geminiResponse]);

  const resetApp = () => {
    setAppState('initial');
    setUploadedImage(null);
    setGeminiResponse(null);
    setSelectedRecipe(null);
    setActiveFilters([]);
    setErrorMessage('');
  };

  if (selectedRecipe && geminiResponse) {
    return (
      <CookingModeView
        recipe={selectedRecipe}
        identifiedIngredients={geminiResponse.identifiedIngredients}
        onClose={() => setSelectedRecipe(null)}
        onAddToShoppingList={handleAddToShoppingList}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Sidebar
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onNewAnalysis={resetApp}
        isResults={appState === 'results'}
      />
      
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-emerald-500" />
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Smart Fridge Assistant
            </h1>
          </div>
          {appState === 'results' && (
             <div className="flex items-center gap-2 rounded-full bg-white dark:bg-slate-800 p-1 shadow-md">
              <button 
                onClick={() => setActiveTab('recipes')}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeTab === 'recipes' ? 'bg-emerald-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                <UtensilsCrossed className="w-4 h-4 inline mr-2"/>
                Recipes
              </button>
              <button 
                onClick={() => setActiveTab('shoppingList')}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors relative ${activeTab === 'shoppingList' ? 'bg-emerald-500 text-white' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
              >
                <ShoppingCart className="w-4 h-4 inline mr-2"/>
                Shopping List
                {shoppingList.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {shoppingList.length}
                  </span>
                )}
              </button>
            </div>
          )}
        </header>

        {appState === 'initial' && <ImageUploader onImageUpload={handleImageUpload} />}
        
        {appState === 'loading' && (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center">
                <div className="w-16 h-16 border-4 border-emerald-500 border-dashed rounded-full animate-spin mb-4"></div>
                <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-300">Analyzing your ingredients...</h2>
                <p className="text-slate-500 mt-2">Our AI chef is whipping up some delicious ideas!</p>
            </div>
        )}

        {appState === 'error' && (
            <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center bg-red-50 dark:bg-red-900/20 p-8 rounded-lg">
                <h2 className="text-2xl font-semibold text-red-600 dark:text-red-400 mb-4">Oops! Something went wrong.</h2>
                <p className="text-red-500 dark:text-red-300 mb-6">{errorMessage}</p>
                <button
                    onClick={resetApp}
                    className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                    Try Again
                </button>
            </div>
        )}

        {appState === 'results' && geminiResponse && (
          activeTab === 'recipes' ? (
            <RecipeList 
              recipes={filteredRecipes} 
              onSelectRecipe={setSelectedRecipe}
              uploadedImage={uploadedImage}
              identifiedIngredients={geminiResponse.identifiedIngredients}
            />
          ) : (
            <ShoppingList list={shoppingList} onRemoveItem={handleRemoveFromShoppingList}/>
          )
        )}
      </main>
    </div>
  );
};

export default App;
