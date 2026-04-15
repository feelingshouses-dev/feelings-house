import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const AdminProperties = () => {
  const { language } = useLanguage();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/properties/`);
      setProperties(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setMessage('Failed to load properties');
      setLoading(false);
    }
  };

  const handleEdit = (property) => {
    setEditingId(property.property_id);
    setEditForm({
      price_per_night: property.price_per_night || 0,
      name_gr: property.name.gr,
      name_en: property.name.en,
      description_gr: property.description.gr,
      description_en: property.description.en,
      featured: property.featured,
      active: property.active
    });
  };

  const handleSave = async (propertyId) => {
    try {
      const updateData = {
        price_per_night: parseFloat(editForm.price_per_night),
        name: {
          gr: editForm.name_gr,
          en: editForm.name_en
        },
        description: {
          gr: editForm.description_gr,
          en: editForm.description_en
        },
        featured: editForm.featured,
        active: editForm.active
      };

      await axios.put(`${API_URL}/api/properties/${propertyId}`, updateData);
      setMessage('Property updated successfully!');
      setEditingId(null);
      fetchProperties();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating property:', error);
      setMessage('Failed to update property');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  const translations = {
    el: {
      title: 'Διαχείριση Σπιτιών',
      property: 'Σπίτι',
      price: 'Τιμή/Βράδυ',
      bedrooms: 'Υπνοδωμάτια',
      guests: 'Επισκέπτες',
      rating: 'Βαθμολογία',
      featured: 'Προβεβλημένο',
      active: 'Ενεργό',
      actions: 'Ενέργειες',
      edit: 'Επεξεργασία',
      save: 'Αποθήκευση',
      cancel: 'Ακύρωση',
      name: 'Όνομα',
      description: 'Περιγραφή',
      nameGr: 'Όνομα (ΕΛ)',
      nameEn: 'Όνομα (EN)',
      descGr: 'Περιγραφή (ΕΛ)',
      descEn: 'Περιγραφή (EN)',
      yes: 'Ναι',
      no: 'Όχι'
    },
    en: {
      title: 'Property Management',
      property: 'Property',
      price: 'Price/Night',
      bedrooms: 'Bedrooms',
      guests: 'Guests',
      rating: 'Rating',
      featured: 'Featured',
      active: 'Active',
      actions: 'Actions',
      edit: 'Edit',
      save: 'Save',
      cancel: 'Cancel',
      name: 'Name',
      description: 'Description',
      nameGr: 'Name (GR)',
      nameEn: 'Name (EN)',
      descGr: 'Description (GR)',
      descEn: 'Description (EN)',
      yes: 'Yes',
      no: 'No'
    }
  };

  const t = translations[language];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{t.title}</h1>

        {message && (
          <div className={`mb-4 p-4 rounded ${message.includes('success') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {message}
          </div>
        )}

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.property}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.price} (€)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.bedrooms}/{t.guests}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.rating}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.featured}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.active}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t.actions}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {properties.map((property) => (
                <React.Fragment key={property.property_id}>
                  {editingId === property.property_id ? (
                    <tr className="bg-blue-50">
                      <td className="px-6 py-4" colSpan="7">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.nameGr}
                              </label>
                              <input
                                type="text"
                                value={editForm.name_gr || ''}
                                onChange={(e) => setEditForm({ ...editForm, name_gr: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.nameEn}
                              </label>
                              <input
                                type="text"
                                value={editForm.name_en || ''}
                                onChange={(e) => setEditForm({ ...editForm, name_en: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              {t.price} (€)
                            </label>
                            <input
                              type="number"
                              step="0.01"
                              value={editForm.price_per_night || 0}
                              onChange={(e) => setEditForm({ ...editForm, price_per_night: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.descGr}
                              </label>
                              <textarea
                                rows="3"
                                value={editForm.description_gr || ''}
                                onChange={(e) => setEditForm({ ...editForm, description_gr: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t.descEn}
                              </label>
                              <textarea
                                rows="3"
                                value={editForm.description_en || ''}
                                onChange={(e) => setEditForm({ ...editForm, description_en: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              />
                            </div>
                          </div>

                          <div className="flex items-center space-x-6">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={editForm.featured || false}
                                onChange={(e) => setEditForm({ ...editForm, featured: e.target.checked })}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">{t.featured}</span>
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={editForm.active !== false}
                                onChange={(e) => setEditForm({ ...editForm, active: e.target.checked })}
                                className="mr-2"
                              />
                              <span className="text-sm text-gray-700">{t.active}</span>
                            </label>
                          </div>

                          <div className="flex space-x-3 pt-4">
                            <button
                              onClick={() => handleSave(property.property_id)}
                              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                              {t.save}
                            </button>
                            <button
                              onClick={handleCancel}
                              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                            >
                              {t.cancel}
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={property.photos[0]}
                            alt={property.name[language]}
                            className="h-12 w-12 rounded object-cover mr-3"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {property.name[language]}
                            </div>
                            <div className="text-sm text-gray-500">
                              {property.property_id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          {property.price_per_night > 0 ? `€${property.price_per_night}` : 'Not set'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {property.bedrooms} / {property.max_guests}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ⭐ {property.rating} ({property.review_count})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.featured ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {property.featured ? t.yes : t.no}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${property.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {property.active ? t.yes : t.no}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(property)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          {t.edit}
                        </button>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminProperties;
