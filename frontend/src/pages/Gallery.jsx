import React from 'react';
import { galleryImages } from '../utils/mockData';

const Gallery = () => {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Γκαλερί</h1>
          <p className="text-xl text-gray-600">Ανακαλύψτε την ομορφιά της Σαντορίνης</p>
        </div>

        {/* Masonry Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6 max-w-7xl mx-auto">
          {galleryImages.map((image, idx) => (
            <div 
              key={image.id} 
              className="break-inside-avoid group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300"
            >
              <img 
                src={image.url} 
                alt={image.title}
                className="w-full h-auto group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-semibold text-lg">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Description */}
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-50 to-white p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ζήστε την Εμπειρία</h2>
            <p className="text-gray-700 leading-relaxed">
              Η Σαντορίνη είναι ένα από τα πιο εντυπωσιακά νησιά του κόσμου. 
              Τα σπίτια μας προσφέρουν την τέλεια θέα στην Καλντέρα και το Αιγαίο, 
              δίνοντάς σας την ευκαιρία να ζήσετε αξέχαστες στιγμές στο νησί των ονείρων.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
