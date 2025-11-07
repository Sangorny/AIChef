import React, { useState } from 'react';
import { StarIcon } from './icons/StarIcon';

interface StarRatingProps {
    rating: number;
    onRating: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRating }) => {
    const [hover, setHover] = useState(0);

    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <button
                        key={ratingValue}
                        type="button"
                        className="transition-transform transform hover:scale-125"
                        onClick={() => onRating(ratingValue)}
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                    >
                        <StarIcon
                            className={`w-6 h-6 cursor-pointer ${
                                ratingValue <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            solid={ratingValue <= (hover || rating)}
                        />
                    </button>
                );
            })}
        </div>
    );
};

export default StarRating;