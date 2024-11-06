import React, { useState, useRef } from 'react';

const AddCategory: React.FC = () => {
  const [categoryName, setCategoryName] = useState<string>('');
  const [budget, setBudget] = useState<number | ''>('');
  const [backgroundColor, setBackgroundColor] = useState<string>('');
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null); 

  const colors = ['#7D4F50', '#CC8B86', '#EFD293', '#4C9182', '#D9DBBC', '#A66D45'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Category Name:', categoryName);
    console.log('Budget:', budget);
    console.log('Background Color:', backgroundColor);
    console.log('Background Image:', backgroundImage);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBackgroundImage(file);
      setImagePreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const removeImage = () => {
    setBackgroundImage(null);
    setImagePreviewUrl(null); 
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl text-black font-bold mb-4 text-center">Add Category</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
              Category Name:
            </label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
              placeholder="Enter category name"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
              Budget:
            </label>
            <input
              type="number"
              id="budget"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
              placeholder="Enter budget"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Select Background Color:</label>
            <div className="flex space-x-2 mt-1">
              {colors.map((color) => (
                <div
                  key={color}
                  onClick={() => setBackgroundColor(color)}
                  className={`w-10 h-10 cursor-pointer rounded-full border-2 ${backgroundColor === color ? 'border-blue-500' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                ></div>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Upload Background Image:</label>
            <div className="flex items-center">
              <input
                type="file"
                id="backgroundImage"
                onChange={handleImageUpload}
                ref={fileInputRef}
                className="hidden" 
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()} 
                className="mt-1 bg-teal-800 text-white font-bold py-2 px-4 rounded-md"
              >
                Choose File
              </button>
            </div>
          </div>

          {imagePreviewUrl && (
            <div className="relative mb-4">
              <img src={imagePreviewUrl} alt="Preview" className="w-full h-64 object-cover rounded-md" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-1 right-1 bg-gray-200 text-black rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition duration-200"
              >
                &times;
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-teal-800 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
