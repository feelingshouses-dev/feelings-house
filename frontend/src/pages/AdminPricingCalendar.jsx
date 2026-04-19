import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, ChevronLeft, ChevronRight, Save, Copy, Edit2, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminPricingCalendar = () => {
  const [selectedProperty, setSelectedProperty] = useState('feelings-4');
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [dailyPrices, setDailyPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingDate, setEditingDate] = useState(null);
  const [editPrice, setEditPrice] = useState('');

  // Bulk edit state
  const [bulkEditMode, setBulkEditMode] = useState(false);
  const [selectedDates, setSelectedDates] = useState([]);
  const [bulkPrice, setBulkPrice] = useState('');

  const monthNames = [
    'Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος',
    'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'
  ];

  const dayNames = ['Κυρ', 'Δευ', 'Τρί', 'Τετ', 'Πέμ', 'Παρ', 'Σάβ'];

  useEffect(() => {
    fetchDailyPrices();
  }, [selectedProperty, currentYear, currentMonth]);

  const fetchDailyPrices = async () => {
    try {
      const startDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
      const endDate = getMonthEndDate();
      
      const response = await axios.get(
        `${API_URL}/api/pricing/daily-prices/${selectedProperty}?start_date=${startDate}&end_date=${endDate}`
      );
      
      const pricesMap = {};
      response.data.prices.forEach(p => {
        pricesMap[p.date] = p.price_per_night;
      });
      
      setDailyPrices(pricesMap);
    } catch (error) {
      console.error('Error fetching prices:', error);
      toast.error('Σφάλμα φόρτωσης τιμών');
    } finally {
      setLoading(false);
    }
  };

  const getMonthEndDate = () => {
    const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
  };

  const getDaysInMonth = () => {
    return new Date(currentYear, currentMonth + 1, 0).getDate();
  };

  const getFirstDayOfMonth = () => {
    return new Date(currentYear, currentMonth, 1).getDay();
  };

  const formatDate = (day) => {
    return `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const isWeekend = (day) => {
    const date = new Date(currentYear, currentMonth, day);
    const dayOfWeek = date.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
  };

  const handleDayClick = (day) => {
    const dateStr = formatDate(day);
    
    if (bulkEditMode) {
      if (selectedDates.includes(dateStr)) {
        setSelectedDates(selectedDates.filter(d => d !== dateStr));
      } else {
        setSelectedDates([...selectedDates, dateStr]);
      }
    } else {
      setEditingDate(dateStr);
      setEditPrice(dailyPrices[dateStr] || '120');
    }
  };

  const saveSinglePrice = async () => {
    try {
      await axios.post(`${API_URL}/api/pricing/daily-price`, {
        property_id: selectedProperty,
        date: editingDate,
        price_per_night: parseFloat(editPrice)
      });
      
      setDailyPrices({ ...dailyPrices, [editingDate]: parseFloat(editPrice) });
      setEditingDate(null);
      toast.success('Η τιμή ενημερώθηκε!');
    } catch (error) {
      toast.error('Σφάλμα αποθήκευσης');
    }
  };

  const saveBulkPrices = async () => {
    try {
      await axios.post(`${API_URL}/api/pricing/daily-prices/bulk`, {
        property_id: selectedProperty,
        dates: selectedDates,
        price_per_night: parseFloat(bulkPrice)
      });
      
      const newPrices = { ...dailyPrices };
      selectedDates.forEach(date => {
        newPrices[date] = parseFloat(bulkPrice);
      });
      
      setDailyPrices(newPrices);
      setSelectedDates([]);
      setBulkEditMode(false);
      setBulkPrice('');
      toast.success(`${selectedDates.length} ημέρες ενημερώθηκαν!`);
    } catch (error) {
      toast.error('Σφάλμα αποθήκευσης');
    }
  };

  const applyWeekendPricing = async (price) => {
    const weekendDates = [];
    const daysInMonth = getDaysInMonth();
    
    for (let day = 1; day <= daysInMonth; day++) {
      if (isWeekend(day)) {
        weekendDates.push(formatDate(day));
      }
    }
    
    try {
      await axios.post(`${API_URL}/api/pricing/daily-prices/bulk`, {
        property_id: selectedProperty,
        dates: weekendDates,
        price_per_night: parseFloat(price)
      });
      
      const newPrices = { ...dailyPrices };
      weekendDates.forEach(date => {
        newPrices[date] = parseFloat(price);
      });
      
      setDailyPrices(newPrices);
      toast.success(`Σαββατοκύριακα ενημερώθηκαν σε €${price}!`);
    } catch (error) {
      toast.error('Σφάλμα');
    }
  };

  const applyWeekdayPricing = async (price) => {
    const weekdayDates = [];
    const daysInMonth = getDaysInMonth();
    
    for (let day = 1; day <= daysInMonth; day++) {
      if (!isWeekend(day)) {
        weekdayDates.push(formatDate(day));
      }
    }
    
    try {
      await axios.post(`${API_URL}/api/pricing/daily-prices/bulk`, {
        property_id: selectedProperty,
        dates: weekdayDates,
        price_per_night: parseFloat(price)
      });
      
      const newPrices = { ...dailyPrices };
      weekdayDates.forEach(date => {
        newPrices[date] = parseFloat(price);
      });
      
      setDailyPrices(newPrices);
      toast.success(`Καθημερινές ενημερώθηκαν σε €${price}!`);
    } catch (error) {
      toast.error('Σφάλμα');
    }
  };

  const copyPricesFromPreviousMonth = async () => {
    try {
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      
      const startDate = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-01`;
      const prevMonthEnd = new Date(prevYear, prevMonth + 1, 0).getDate();
      const endDate = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(prevMonthEnd).padStart(2, '0')}`;
      
      const response = await axios.get(
        `${API_URL}/api/pricing/daily-prices/${selectedProperty}?start_date=${startDate}&end_date=${endDate}`
      );
      
      const prevPrices = {};
      response.data.prices.forEach(p => {
        const day = parseInt(p.date.split('-')[2]);
        prevPrices[day] = p.price_per_night;
      });
      
      // Apply to current month (matching days)
      const updatePromises = [];
      const daysInCurrentMonth = getDaysInMonth();
      
      for (let day = 1; day <= daysInCurrentMonth; day++) {
        if (prevPrices[day]) {
          const dateStr = formatDate(day);
          updatePromises.push(
            axios.post(`${API_URL}/api/pricing/daily-price`, {
              property_id: selectedProperty,
              date: dateStr,
              price_per_night: prevPrices[day]
            })
          );
        }
      }
      
      await Promise.all(updatePromises);
      await fetchDailyPrices();
      toast.success('Τιμές αντιγράφηκαν από τον προηγούμενο μήνα!');
    } catch (error) {
      toast.error('Σφάλμα αντιγραφής');
    }
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth();
    const firstDay = getFirstDayOfMonth();
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24"></div>);
    }

    // Calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(day);
      const price = dailyPrices[dateStr] || 120;
      const weekend = isWeekend(day);
      const isEditing = editingDate === dateStr;
      const isSelected = selectedDates.includes(dateStr);

      days.push(
        <div
          key={day}
          onClick={() => handleDayClick(day)}
          className={`
            h-24 border rounded-lg p-2 cursor-pointer transition-all
            ${weekend ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'}
            ${isSelected ? 'ring-2 ring-blue-500 bg-blue-100' : ''}
            ${isEditing ? 'ring-2 ring-green-500' : ''}
            hover:shadow-md hover:border-blue-400
          `}
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-start">
              <span className={`text-sm font-semibold ${weekend ? 'text-blue-600' : 'text-gray-700'}`}>
                {day}
              </span>
              {weekend && <span className="text-xs text-blue-500">Σ/Κ</span>}
            </div>
            
            {isEditing ? (
              <div className="mt-2 flex items-center gap-1">
                <Input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="h-7 text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
                <Button size="sm" onClick={(e) => { e.stopPropagation(); saveSinglePrice(); }} className="h-7 px-2">
                  <Save size={14} />
                </Button>
              </div>
            ) : (
              <div className="mt-auto">
                <p className="text-lg font-bold text-gray-800">€{price}</p>
                <p className="text-xs text-gray-500">/νύχτα</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  if (loading) {
    return <div className="p-8">Φόρτωση...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Ημερολόγιο Τιμών</h1>
          <p className="text-gray-600">Ορίστε τιμές για κάθε ημέρα του χρόνου</p>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              {/* Month Navigation */}
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentMonth === 0) {
                      setCurrentMonth(11);
                      setCurrentYear(currentYear - 1);
                    } else {
                      setCurrentMonth(currentMonth - 1);
                    }
                  }}
                >
                  <ChevronLeft size={20} />
                </Button>
                
                <h2 className="text-xl font-bold min-w-[200px] text-center">
                  {monthNames[currentMonth]} {currentYear}
                </h2>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    if (currentMonth === 11) {
                      setCurrentMonth(0);
                      setCurrentYear(currentYear + 1);
                    } else {
                      setCurrentMonth(currentMonth + 1);
                    }
                  }}
                >
                  <ChevronRight size={20} />
                </Button>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyPricesFromPreviousMonth()}
                >
                  <Copy size={16} className="mr-2" />
                  Αντιγραφή από προηγούμενο μήνα
                </Button>
                
                <Button
                  variant={bulkEditMode ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setBulkEditMode(!bulkEditMode);
                    setSelectedDates([]);
                  }}
                >
                  <Edit2 size={16} className="mr-2" />
                  {bulkEditMode ? 'Ακύρωση μαζικής επεξεργασίας' : 'Μαζική επεξεργασία'}
                </Button>
              </div>
            </div>

            {/* Bulk Edit Bar */}
            {bulkEditMode && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700 mb-3">
                  Επιλέξτε ημέρες κάνοντας κλικ (επιλεγμένες: {selectedDates.length})
                </p>
                <div className="flex gap-2 items-center">
                  <Input
                    type="number"
                    placeholder="Τιμή (€)"
                    value={bulkPrice}
                    onChange={(e) => setBulkPrice(e.target.value)}
                    className="w-32"
                  />
                  <Button
                    onClick={saveBulkPrices}
                    disabled={selectedDates.length === 0 || !bulkPrice}
                  >
                    Εφαρμογή σε {selectedDates.length} ημέρες
                  </Button>
                </div>
              </div>
            )}

            {/* Quick Pricing Tools */}
            <div className="mt-4 flex gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Γρήγορα:</span>
                <Input
                  type="number"
                  placeholder="Τιμή Σ/Κ"
                  className="w-24 h-8 text-sm"
                  id="weekend-price"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const price = document.getElementById('weekend-price').value;
                    if (price) applyWeekendPricing(price);
                  }}
                >
                  <TrendingUp size={14} className="mr-1" />
                  Όλα τα Σαββατοκύριακα
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  placeholder="Τιμή καθημερινών"
                  className="w-24 h-8 text-sm"
                  id="weekday-price"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const price = document.getElementById('weekday-price').value;
                    if (price) applyWeekdayPricing(price);
                  }}
                >
                  <TrendingDown size={14} className="mr-1" />
                  Όλες τις καθημερινές
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Grid */}
        <Card>
          <CardContent className="pt-6">
            {/* Day Names Header */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center font-semibold text-gray-600 text-sm">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {renderCalendar()}
            </div>
          </CardContent>
        </Card>

        {/* Legend */}
        <div className="mt-4 flex gap-6 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-white border border-gray-200 rounded"></div>
            <span>Καθημερινή</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
            <span>Σαββατοκύριακο</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded"></div>
            <span>Επιλεγμένη (bulk)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPricingCalendar;
