import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Search, Filter, ShoppingCart } from 'lucide-react';
import { useStore } from '../../store/store';
import { formatCurrency } from '../../utils/formatters';

const MOCK_PRODUCTS = [
  { id: 1, name: 'Tori Tel (Pure Mustard Oil)', category: 'oils', price: 240, wholesalePrice: 210, stock: 'in_stock', unit: '1 ltr', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300&q=80' },
  { id: 2, name: 'Mansuli Chamal (Premium Rice)', category: 'grains', price: 1800, wholesalePrice: 1650, stock: 'low_stock', unit: '25 kg', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80' },
  { id: 3, name: 'Sona Mansuli Rice (Standard)', category: 'grains', price: 1600, wholesalePrice: 1480, stock: 'in_stock', unit: '25 kg', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80' },
  { id: 4, name: 'Musuro Daal (Split Red Lentils)', category: 'lentils', price: 160, wholesalePrice: 145, stock: 'in_stock', unit: '1 kg', image: 'https://images.unsplash.com/photo-1547058881-aa0edd92aab3?w=300&q=80' },
  { id: 5, name: 'Moong Daal (Yellow)', category: 'lentils', price: 180, wholesalePrice: 160, stock: 'out_of_stock', unit: '1 kg', image: 'https://images.unsplash.com/photo-1547058881-aa0edd92aab3?w=300&q=80' },
  { id: 6, name: 'Jeera Masala (Whole Cumin Spices)', category: 'spices', price: 480, wholesalePrice: 420, stock: 'in_stock', unit: '1 kg', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&q=80' },
];

export default function Products() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, language } = useStore();
  
  const categoryFilter = searchParams.get('category') || 'all';
  const [searchQuery, setSearchQuery] = useState('');

  // Filter products based on search and category params
  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getStockBadge = (stock) => {
    switch (stock) {
      case 'in_stock':
        return <span className="bg-[#BFEDD0] text-primary text-[11px] font-bold px-sm py-xs rounded-full">In Stock</span>;
      case 'low_stock':
        return <span className="bg-[#FFDCBC] text-[#895100] text-[11px] font-bold px-sm py-xs rounded-full">Low Stock</span>;
      case 'out_of_stock':
        return <span className="bg-[#FFDBD2] text-[#ba1a1a] text-[11px] font-bold px-sm py-xs rounded-full">Out of Stock</span>;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-md py-xl min-h-screen">
      
      {/* Header Back Button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-xs text-label-sm font-semibold text-on-surface-variant hover:text-primary mb-lg transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Landing Page
      </button>

      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-xl">
        <div>
          <h1 className="font-sans text-headline-md font-bold text-on-surface">
            Staples Catalogue
          </h1>
          <p className="font-sans text-body-md text-on-surface-variant mt-xs">
            {user ? `Logged in as ${user.name} (${user.type === 'shop' ? 'Wholesale Pricing Active' : 'Retail Pricing Active'})` : 'Viewing as Guest (Retail Pricing)'}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-sm w-full">
          <Search size={18} className="absolute left-md top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search staples... (e.g. Tori Tel)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-xl pr-md py-sm bg-surface-lowest border border-outline-variant rounded-full text-body-md text-on-surface focus:border-primary focus:outline-none focus:shadow-level-1 transition-all"
          />
        </div>
      </div>

      {/* Category Filter Shelf */}
      <div className="flex items-center gap-sm overflow-x-auto pb-md mb-lg">
        <button
          onClick={() => navigate('/products')}
          className={`px-lg py-sm rounded-full text-label-sm font-bold border transition-all ${
            categoryFilter === 'all'
              ? 'bg-primary text-white border-primary shadow-level-1'
              : 'bg-white border-outline-variant text-on-surface-variant hover:border-outline'
          }`}
        >
          All Items
        </button>
        <button
          onClick={() => navigate('/products?category=oils')}
          className={`px-lg py-sm rounded-full text-label-sm font-bold border transition-all ${
            categoryFilter === 'oils'
              ? 'bg-primary text-white border-primary shadow-level-1'
              : 'bg-white border-outline-variant text-on-surface-variant hover:border-outline'
          }`}
        >
          Oils & Ghee
        </button>
        <button
          onClick={() => navigate('/products?category=grains')}
          className={`px-lg py-sm rounded-full text-label-sm font-bold border transition-all ${
            categoryFilter === 'grains'
              ? 'bg-primary text-white border-primary shadow-level-1'
              : 'bg-white border-outline-variant text-on-surface-variant hover:border-outline'
          }`}
        >
          Rice & Grains
        </button>
        <button
          onClick={() => navigate('/products?category=lentils')}
          className={`px-lg py-sm rounded-full text-label-sm font-bold border transition-all ${
            categoryFilter === 'lentils'
              ? 'bg-primary text-white border-primary shadow-level-1'
              : 'bg-white border-outline-variant text-on-surface-variant hover:border-outline'
          }`}
        >
          Lentils & Pulses
        </button>
        <button
          onClick={() => navigate('/products?category=spices')}
          className={`px-lg py-sm rounded-full text-label-sm font-bold border transition-all ${
            categoryFilter === 'spices'
              ? 'bg-primary text-white border-primary shadow-level-1'
              : 'bg-white border-outline-variant text-on-surface-variant hover:border-outline'
          }`}
        >
          Spices & Herbs
        </button>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-lg">
          {filteredProducts.map((p) => {
            const isWholesale = user?.type === 'shop';
            const priceToDisplay = isWholesale ? p.wholesalePrice : p.price;

            return (
              <div
                key={p.id}
                className="bg-surface-lowest rounded-md border border-outline-variant overflow-hidden hover:shadow-level-2 transition-all flex flex-col"
              >
                {/* Product Image */}
                <div className="w-full aspect-[4/3] bg-surface-low overflow-hidden relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-long" />
                  <div className="absolute top-sm right-sm">
                    {getStockBadge(p.stock)}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-md flex flex-col flex-1 gap-sm">
                  <div>
                    <h3 className="font-sans text-body-lg font-bold text-on-surface line-clamp-1">{p.name}</h3>
                    <p className="font-sans text-label-sm text-on-surface-variant">Unit: {p.unit}</p>
                  </div>

                  {/* Pricing block */}
                  <div className="mt-auto flex items-center justify-between gap-sm border-t border-outline-variant pt-sm">
                    <div>
                      {isWholesale && (
                        <p className="text-[10px] text-on-surface-variant line-through">
                          Retail: {formatCurrency(p.price, language)}
                        </p>
                      )}
                      <p className="font-sans text-headline-sm font-bold text-primary">
                        {formatCurrency(priceToDisplay, language)}
                        {isWholesale && (
                          <span className="text-[10px] ml-xs bg-secondary-container text-on-secondary-container px-xs py-0.5 rounded font-bold uppercase tracking-wider">
                            Bulk rate
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Add to Cart button */}
                    <button
                      disabled={p.stock === 'out_of_stock'}
                      className="p-sm rounded-default bg-primary text-white hover:bg-primary-container disabled:bg-surface-dim disabled:text-on-surface-variant hover:scale-105 disabled:scale-100 transition-all flex items-center justify-center"
                      title={p.stock === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}
                    >
                      <ShoppingCart size={18} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-2xl bg-surface-low rounded-lg border border-dashed border-outline-variant font-sans text-body-lg text-on-surface-variant">
          No products found. Try a different search query or category!
        </div>
      )}

    </div>
  );
}
