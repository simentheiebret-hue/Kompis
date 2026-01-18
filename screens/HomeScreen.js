import React from 'react';
import KompisApp from '../KompisApp';
import { useAuth } from '../contexts/AuthContext';

const HomeScreen = () => {
  const { user } = useAuth();

  return <KompisApp userData={user} />;
};

export default HomeScreen;
