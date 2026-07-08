import React, { useState } from 'react';
import { Plus, Tag, Trash2, Edit2 } from 'lucide-react';

// TypeScript interface defining the Product structure based on your MongoDB schema
export interface Product {
  _id?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  tags: string[];
  images: string[];
  status: 'active' | 'inactive';
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Product) => void;
}

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
  <div className="border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
    <img src={product.images[0] || '/placeholder.jpg'} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-3" />
    <h3 className="font-bold text-lg">{product.name}</h3>
    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
    <div className="flex justify-between items-center mt-4">
      <span className="font-semibold text-blue-600">${product.price}</span>
      <div className="flex gap-2">
        <button className="p-2 text-gray-400 hover:text-blue-500"><Edit2 size={18} /></button>
        <button className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
      </div>
    </div>
  </div>
);

export const CreateProductModal: React.FC<ModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<Product>({
    name: '',
    description: '',
    category: '',
    price: 0,
    tags: [],
    images: [],
    status: 'active'
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Add New Product</h2>
        <input 
          className="w-full border p-2 rounded mb-3" 
          placeholder="Product Name"
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <textarea 
          className="w-full border p-2 rounded mb-3" 
          placeholder="Description"
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <div className="border-2 border-dashed rounded-lg p-8 text-center mb-4 text-gray-400">
          Click to upload product image
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2 border rounded">Cancel</button>
          <button 
            onClick={() => onSubmit(formData)} 
            className="flex-1 py-2 bg-blue-600 text-white rounded"
          >
            Create Product
          </button>
        </div>
      </div>
    </div>
  );
};