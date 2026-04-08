import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Input } from '../components/ui/input';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { properties, addBooking, checkAvailability } from '../utils/mockData';
import { CalendarIcon, Users, CreditCard, Check } from 'lucide-react';
import { format } from 'date-fns';
import { el } from 'date-fns/locale';
import { toast } from 'sonner';

const Booking = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const propertyId = parseInt(searchParams.get('property')) || 1;
  const property = properties.find(p => p.id === propertyId) || properties[0];

  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [guests, setGuests] = useState(2);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: ''
  });
  const [step, setStep] = useState(1);

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const calculateTotal = () => {
    return calculateNights() * property.price;
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!checkIn || !checkOut) {
      toast.error('Παρακαλώ επιλέξτε ημερομηνίες');
      return;
    }

    if (calculateNights() === 0) {
      toast.error('Η ημερομηνία αναχώρησης πρέπει να είναι μετά την άφιξη');
      return;
    }

    // Check availability (mock)
    const isAvailable = checkAvailability(propertyId, checkIn, checkOut);
    if (!isAvailable) {
      toast.error('Δυστυχώς το σπίτι δεν είναι διαθέσιμο για αυτές τις ημερομηνίες');
      return;
    }

    // Create booking (mock - saved in localStorage)
    const booking = addBooking({
      propertyId,
      propertyName: property.name,
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      guests,
      total: calculateTotal(),
      ...formData
    });

    toast.success('Η κράτηση σας ολοκληρώθηκε επιτυχώς!');
    
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">Κράτηση Σπιτιού</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Στοιχεία Κράτησης</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Dates Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Ημερομηνία Άφιξης</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal mt-2"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {checkIn ? format(checkIn, 'PPP', { locale: el }) : 'Επιλέξτε ημερομηνία'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={checkIn}
                              onSelect={setCheckIn}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div>
                        <Label>Ημερομηνία Αναχώρησης</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal mt-2"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {checkOut ? format(checkOut, 'PPP', { locale: el }) : 'Επιλέξτε ημερομηνία'}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={checkOut}
                              onSelect={setCheckOut}
                              disabled={(date) => date <= (checkIn || new Date())}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    {/* Guests */}
                    <div>
                      <Label>Αριθμός Ατόμων</Label>
                      <div className="flex items-center gap-4 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setGuests(Math.max(1, guests - 1))}
                        >
                          -
                        </Button>
                        <div className="flex items-center gap-2">
                          <Users size={20} />
                          <span className="text-lg font-semibold">{guests}</span>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setGuests(Math.min(property.maxGuests, guests + 1))}
                        >
                          +
                        </Button>
                        <span className="text-sm text-gray-600">
                          (Μέγιστο: {property.maxGuests})
                        </span>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="border-t pt-6">
                      <h3 className="font-semibold text-lg mb-4">Στοιχεία Επικοινωνίας</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">Όνομα *</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Επώνυμο *</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Τηλέφωνο *</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Payment Information */}
                    <div className="border-t pt-6">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <CreditCard size={20} />
                        Πληροφορίες Πληρωμής (Mock)
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardNumber">Αριθμός Κάρτας</Label>
                          <Input
                            id="cardNumber"
                            name="cardNumber"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={handleInputChange}
                            className="mt-2"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="cardExpiry">Ημ. Λήξης</Label>
                            <Input
                              id="cardExpiry"
                              name="cardExpiry"
                              placeholder="MM/YY"
                              value={formData.cardExpiry}
                              onChange={handleInputChange}
                              className="mt-2"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cardCVC">CVC</Label>
                            <Input
                              id="cardCVC"
                              name="cardCVC"
                              placeholder="123"
                              value={formData.cardCVC}
                              onChange={handleInputChange}
                              className="mt-2"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
                    >
                      <Check className="mr-2" size={20} />
                      Ολοκλήρωση Κράτησης
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Περίληψη Κράτησης</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative h-48 rounded-lg overflow-hidden">
                    <img 
                      src={property.image} 
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div>
                    <h3 className="font-bold text-xl text-gray-900">{property.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{property.description}</p>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">€{property.price} x {calculateNights()} νύχτες</span>
                      <span className="font-semibold">€{calculateNights() * property.price}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Αριθμός ατόμων</span>
                      <span className="font-semibold">{guests}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Σύνολο</span>
                      <span className="text-blue-600">€{calculateTotal()}</span>
                    </div>
                  </div>

                  {checkIn && checkOut && (
                    <div className="bg-blue-50 p-4 rounded-lg text-sm">
                      <div className="flex justify-between mb-2">
                        <span className="font-semibold">Άφιξη:</span>
                        <span>{format(checkIn, 'dd MMM yyyy', { locale: el })}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-semibold">Αναχώρηση:</span>
                        <span>{format(checkOut, 'dd MMM yyyy', { locale: el })}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
