import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { properties } from '../utils/mockData';
import axios from 'axios';
import { toast } from 'sonner';
import { Calendar, RefreshCw, Plus, Trash2, CheckCircle, XCircle, Clock, ExternalLink } from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminCalendarSync = () => {
  const [calendarSources, setCalendarSources] = useState([]);
  const [syncStatuses, setSyncStatuses] = useState({});
  const [loading, setLoading] = useState(false);
  const [newSource, setNewSource] = useState({
    property_id: 1,
    platform: 'airbnb',
    ical_url: ''
  });

  useEffect(() => {
    fetchAllCalendarSources();
  }, []);

  const fetchAllCalendarSources = async () => {
    try {
      const sources = [];
      for (const property of properties) {
        const response = await axios.get(`${API}/calendar/calendar-sources/${property.id}`);
        sources.push(...response.data);
      }
      setCalendarSources(sources);
    } catch (error) {
      console.error('Error fetching calendar sources:', error);
    }
  };

  const addCalendarSource = async () => {
    if (!newSource.ical_url || !newSource.ical_url.includes('.ics')) {
      toast.error('Παρακαλώ εισάγετε έγκυρο iCal URL που τελειώνει σε .ics');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API}/calendar/calendar-sources`, newSource);
      toast.success('Το calendar προστέθηκε και συγχρονίστηκε!');
      
      // Reset form
      setNewSource({
        property_id: 1,
        platform: 'airbnb',
        ical_url: ''
      });
      
      // Refresh list
      await fetchAllCalendarSources();
    } catch (error) {
      toast.error('Σφάλμα κατά την προσθήκη: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const syncProperty = async (propertyId) => {
    setSyncStatuses(prev => ({ ...prev, [propertyId]: 'syncing' }));
    try {
      await axios.post(`${API}/calendar/sync/${propertyId}`);
      toast.success('Συγχρονισμός ολοκληρώθηκε!');
      setSyncStatuses(prev => ({ ...prev, [propertyId]: 'success' }));
      await fetchAllCalendarSources();
    } catch (error) {
      toast.error('Σφάλμα συγχρονισμού');
      setSyncStatuses(prev => ({ ...prev, [propertyId]: 'error' }));
    }
  };

  const deleteSource = async (sourceId) => {
    if (!window.confirm('Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το calendar;')) {
      return;
    }

    try {
      await axios.delete(`${API}/calendar/calendar-sources/${sourceId}`);
      toast.success('Το calendar διαγράφηκε');
      await fetchAllCalendarSources();
    } catch (error) {
      toast.error('Σφάλμα διαγραφής');
    }
  };

  const getPropertyName = (propertyId) => {
    const property = properties.find(p => p.id === propertyId);
    return property ? property.name : `Property ${propertyId}`;
  };

  const getPlatformBadge = (platform) => {
    const colors = {
      airbnb: 'bg-red-100 text-red-700',
      booking: 'bg-blue-100 text-blue-700',
      vrbo: 'bg-purple-100 text-purple-700'
    };
    return colors[platform] || 'bg-gray-100 text-gray-700';
  };

  const getSyncStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="text-green-600" size={20} />;
      case 'error':
        return <XCircle className="text-red-600" size={20} />;
      case 'pending':
        return <Clock className="text-yellow-600" size={20} />;
      default:
        return <Clock className="text-gray-400" size={20} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Ποτέ';
    return new Date(dateString).toLocaleString('el-GR');
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            📅 Διαχείριση Calendar Sync
          </h1>
          <p className="text-gray-600">
            Συγχρονίστε τα ημερολόγια σας από Airbnb και Booking.com
          </p>
        </div>

        {/* Instructions Alert */}
        <Alert className="mb-8 bg-blue-50 border-blue-200">
          <AlertDescription>
            <div className="space-y-2">
              <p className="font-semibold text-blue-900">📍 Πώς να πάρετε τα iCal URLs:</p>
              <div className="text-sm text-blue-800 space-y-1">
                <p><strong>Airbnb:</strong> Hosting → Calendar → Availability settings → Sync calendars → Export calendar</p>
                <p><strong>Booking.com:</strong> Extranet → Rates & Availability → Sync calendars → Export calendar</p>
                <p className="text-blue-600 mt-2">⚠️ Τα URLs πρέπει να τελειώνουν σε <code className="bg-blue-100 px-1 rounded">.ics</code></p>
              </div>
            </div>
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="add" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="add">
              <Plus size={16} className="mr-2" />
              Προσθήκη Calendar
            </TabsTrigger>
            <TabsTrigger value="manage">
              <Calendar size={16} className="mr-2" />
              Διαχείριση ({calendarSources.length})
            </TabsTrigger>
          </TabsList>

          {/* Add Calendar Tab */}
          <TabsContent value="add">
            <Card>
              <CardHeader>
                <CardTitle>Προσθήκη Νέου Calendar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="property">Επιλέξτε Σπίτι</Label>
                  <select
                    id="property"
                    value={newSource.property_id}
                    onChange={(e) => setNewSource({ ...newSource, property_id: parseInt(e.target.value) })}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {properties.map((property) => (
                      <option key={property.id} value={property.id}>
                        {property.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="platform">Πλατφόρμα</Label>
                  <select
                    id="platform"
                    value={newSource.platform}
                    onChange={(e) => setNewSource({ ...newSource, platform: e.target.value })}
                    className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="airbnb">Airbnb</option>
                    <option value="booking">Booking.com</option>
                    <option value="vrbo">VRBO</option>
                    <option value="other">Άλλο</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="ical_url">iCal URL</Label>
                  <Input
                    id="ical_url"
                    type="url"
                    placeholder="https://www.airbnb.com/calendar/ical/12345.ics?s=..."
                    value={newSource.ical_url}
                    onChange={(e) => setNewSource({ ...newSource, ical_url: e.target.value })}
                    className="mt-2"
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Κάντε paste το iCal URL που πήρατε από την πλατφόρμα
                  </p>
                </div>

                <Button
                  onClick={addCalendarSource}
                  disabled={loading || !newSource.ical_url}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 animate-spin" size={20} />
                      Προσθήκη & Συγχρονισμός...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2" size={20} />
                      Προσθήκη Calendar
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manage Calendars Tab */}
          <TabsContent value="manage">
            {properties.map((property) => {
              const propertySources = calendarSources.filter(s => s.property_id === property.id);
              
              return (
                <Card key={property.id} className="mb-6">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>{property.name}</CardTitle>
                        <p className="text-sm text-gray-500 mt-1">
                          {propertySources.length} calendar source(s)
                        </p>
                      </div>
                      <Button
                        onClick={() => syncProperty(property.id)}
                        variant="outline"
                        disabled={syncStatuses[property.id] === 'syncing' || propertySources.length === 0}
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        <RefreshCw 
                          className={`mr-2 ${syncStatuses[property.id] === 'syncing' ? 'animate-spin' : ''}`} 
                          size={16} 
                        />
                        Sync Τώρα
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {propertySources.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <Calendar size={48} className="mx-auto mb-4 text-gray-300" />
                        <p>Δεν υπάρχουν calendar sources</p>
                        <p className="text-sm mt-2">Προσθέστε ένα στο tab "Προσθήκη Calendar"</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {propertySources.map((source) => (
                          <div
                            key={source._id}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-3">
                                <Badge className={getPlatformBadge(source.platform)}>
                                  {source.platform.toUpperCase()}
                                </Badge>
                                {getSyncStatusIcon(source.sync_status)}
                                <span className="text-sm text-gray-600">
                                  {source.sync_status === 'success' && 'Συγχρονισμένο'}
                                  {source.sync_status === 'error' && 'Σφάλμα'}
                                  {source.sync_status === 'pending' && 'Εκκρεμεί'}
                                </span>
                              </div>
                              
                              <div className="text-xs text-gray-500 space-y-1">
                                <p>
                                  <strong>URL:</strong>{' '}
                                  <code className="bg-white px-2 py-1 rounded text-xs">
                                    {source.ical_url.substring(0, 50)}...
                                  </code>
                                </p>
                                <p>
                                  <strong>Τελευταίος sync:</strong> {formatDate(source.last_synced)}
                                </p>
                                {source.error_message && (
                                  <p className="text-red-600">
                                    <strong>Σφάλμα:</strong> {source.error_message}
                                  </p>
                                )}
                              </div>
                            </div>

                            <Button
                              onClick={() => deleteSource(source._id)}
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>

        {/* Help Section */}
        <Card className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <ExternalLink size={20} />
              Χρήσιμοι Σύνδεσμοι
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <a
                href="https://www.airbnb.com/hosting/listings"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <ExternalLink size={16} />
                Airbnb Hosting Dashboard
              </a>
              <a
                href="https://admin.booking.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              >
                <ExternalLink size={16} />
                Booking.com Extranet
              </a>
            </div>
            <div className="mt-4 p-4 bg-white rounded-lg border border-blue-200">
              <p className="text-sm text-gray-700">
                ⏰ <strong>Αυτόματος συγχρονισμός:</strong> Κάθε 30 λεπτά το σύστημα ελέγχει για νέες κρατήσεις
              </p>
              <p className="text-sm text-gray-700 mt-2">
                🔒 <strong>Προστασία:</strong> 15λεπτο booking hold εμποδίζει διπλές κρατήσεις
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminCalendarSync;
