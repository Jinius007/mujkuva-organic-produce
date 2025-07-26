
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the produce page immediately using replace to avoid browser history issues
    navigate('/produce', { replace: true });
  }, [navigate]);

  // This content will briefly show before redirect
  return (
    <div className="min-h-screen flex items-center justify-center bg-organic-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-organic-800 mb-4">Mujkuva Organic</h1>
        <p className="text-xl text-gray-600">Redirecting to products page...</p>
      </div>
    </div>
  );
};

export default Index;
