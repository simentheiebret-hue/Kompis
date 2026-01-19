import { useAuth } from '../contexts/AuthContext';
import KompisApp from '../KompisApp';

const HomeScreen = () => {
  const { user } = useAuth();

  return <KompisApp userData={user} />;
};

export default HomeScreen;
