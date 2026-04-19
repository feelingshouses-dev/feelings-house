import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { Calendar, DollarSign, Home, Settings } from 'lucide-react';

const AdminNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/admin/pricing', label: 'Τιμές', icon: DollarSign },
    { path: '/admin/calendar-sync', label: 'Calendar Sync', icon: Calendar },
    { path: '/admin/properties', label: 'Σπίτια', icon: Home },
  ];

  return (
    <div className="bg-white border-b border-gray-200 mb-6">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? 'default' : 'ghost'}
                size="sm"
                onClick={() => navigate(item.path)}
                className="flex items-center gap-2"
              >
                <Icon size={16} />
                {item.label}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminNav;
