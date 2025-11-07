import React, { Fragment } from 'react';

interface TipsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const tips = [
    { title: "Afila tus cuchillos", content: "Un cuchillo afilado es más seguro y eficiente. Usa una chaira regularmente y afila la hoja profesionalmente una vez al año." },
    { title: "Sazona en cada paso", content: "Añadir sal y pimienta en diferentes etapas de la cocción (al saltear las verduras, al añadir la carne, etc.) crea capas de sabor más complejas." },
    { title: "No satures la sartén", content: "Cocinar demasiados ingredientes a la vez baja la temperatura y hace que se cuezan en su vapor en lugar de dorarse. Cocina en tandas si es necesario." },
    { title: "Usa acidez para equilibrar", content: "Un chorrito de limón o vinagre al final de la cocción puede realzar y equilibrar los sabores, especialmente en platos ricos o grasos." },
    { title: "Conserva hierbas frescas", content: "Envuelve el tallo de hierbas como el perejil o el cilantro en papel de cocina húmedo y guárdalas en una bolsa en la nevera para que duren más." }
];


const TipsModal: React.FC<TipsModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="tips-modal-title"
        >
            <div 
                className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 relative"
                onClick={e => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre
            >
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                    aria-label="Cerrar modal"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <h2 id="tips-modal-title" className="text-2xl font-display text-green-800 mb-6">Trucos de Cocina</h2>
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    {tips.map((tip, index) => (
                        <div key={index}>
                            <h3 className="font-bold text-gray-800">{tip.title}</h3>
                            <p className="text-gray-600 text-sm mt-1">{tip.content}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TipsModal;