import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

const LogoutButton = () => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Αποσυνδεθήκατε επιτυχώς');
      navigate('/login');
    } catch (error) {
      toast.error('Σφάλμα κατά την αποσύνδεση');
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">
        {user.email}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="flex items-center gap-2"
      >
        <LogOut size={16} />
        Έξοδος
      </Button>
    </div>
  );
};

export default LogoutButton;
