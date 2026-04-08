import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { properties, amenitiesList } from '../utils/mockData';
import { Wifi, AirVent, Tv, Eye, Car, ArrowRight, Star, Users, Bed } from 'lucide-react';

const iconMap = {
  Wifi: Wifi,
  AirVent: AirVent,
  Tv: Tv,
  Eye: Eye,
  Car: Car
};

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1580502304784-8985b7eb7260?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA0MTJ8MHwxfHNlYXJjaHw0fHxTYW50b3Jpbml8ZW58MHx8fHwxNzc1Njc3ODgyfDA&ixlib=rb-4.1.0&q=85')`
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Καλώς Ήρθατε στη Σαντορίνη
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-100 animate-fade-in">
            Ανακαλύψτε τα πολυτελή σπίτια μας με απεριόριστη θέα στην Καλντέρα
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            <Link to="/properties">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg">
                Δείτε τα Σπίτια μας
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
            <Link to="/booking">
              <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border-white px-8 py-6 text-lg">
                Κάντε Κράτηση
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Τα Σπίτια μας</h2>
            <p className="text-lg text-gray-600">4 πολυτελή σπίτια με πλήρη εξοπλισμό στην καρδιά της Σαντορίνης</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {properties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={property.image} 
                    alt={property.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full font-semibold">
                    €{property.price}/νύχτα
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{property.name}</h3>
                  <p className="text-gray-600 mb-4">{property.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Users size={16} />
                      <span>{property.maxGuests} άτομα</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bed size={16} />
                      <span>{property.bedrooms} υπνοδωμάτια</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {property.amenities.slice(0, 4).map((amenity, idx) => (
                      <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                        {amenity}
                      </span>
                    ))}
                  </div>

                  <Link to={`/booking?property=${property.id}`}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Κράτηση
                      <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/properties">
              <Button variant="outline" size="lg" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                Δείτε Όλα τα Σπίτια
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Παροχές & Υπηρεσίες</h2>
            <p className="text-lg text-gray-600">Όλα όσα χρειάζεστε για μια τέλεια διαμονή</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {amenitiesList.map((amenity, idx) => {
              const Icon = iconMap[amenity.icon];
              return (
                <Card key={idx} className="text-center p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <Icon className="text-blue-600" size={32} />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{amenity.name}</h3>
                    <p className="text-sm text-gray-600">{amenity.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Έτοιμοι για την επόμενη διακοπή σας;</h2>
          <p className="text-xl mb-8 text-blue-50">Κάντε κράτηση τώρα και απολαύστε την ομορφιά της Σαντορίνης</p>
          <Link to="/booking">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg">
              Κάντε Κράτηση Τώρα
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
