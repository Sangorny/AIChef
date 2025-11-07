
import React from 'react';
import type { FilePreview } from '../types';
import { CameraIcon } from './icons/CameraIcon';
import { TrashIcon } from './icons/TrashIcon';

interface ImageUploaderProps {
    files: FilePreview[];
    onFileChange: (files: FileList | null) => void;
    onRemoveFile: (fileName: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ files, onFileChange, onRemoveFile }) => {
    return (
        <div>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                    <CameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                        <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                        >
                            <span>Sube una o varias fotos</span>
                            <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple accept="image/*" onChange={(e) => onFileChange(e.target.files)} />
                        </label>
                        <p className="pl-1">o arrástralas aquí</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 10MB</p>
                </div>
            </div>

            {files.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {files.map((file, index) => (
                        <div key={index} className="relative group aspect-square">
                            <img src={file.preview} alt={`preview ${index}`} className="w-full h-full object-cover rounded-md shadow-sm" />
                            <button
                                onClick={() => onRemoveFile(file.file.name)}
                                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Remove image"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUploader;
