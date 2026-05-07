import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { Camera, Package, LogOut } from 'lucide-react';
import ScannerView from './components/ScannerView';
import Login from './components/Login';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white p-4 shadow-md flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mr-3 text-blue-600 font-bold">N</div>
          <h1 className="text-xl font-bold">NovaGear Lite</h1>
        </div>
        <button onClick={handleLogout} className="p-2 bg-blue-700 rounded-full hover:bg-blue-800 transition">
          <LogOut size={18} />
        </button>
      </header>

      <main className="p-4 max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 flex flex-col items-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
            <Package size={32} />
          </div>
          <h2 className="text-xl font-semibold">Sẵn sàng Quét mã</h2>
          <p className="text-gray-500 text-center text-sm mt-1 mb-6">Sử dụng camera để quét mã vạch đơn hàng và cập nhật trạng thái nhanh chóng.</p>
          
          <button 
            onClick={() => navigate('/scan')}
            className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow flex items-center justify-center hover:bg-blue-700 transition"
          >
            <Camera className="mr-2" /> Mở Máy Quét
          </button>
        </div>

        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Hoạt động gần đây</h3>
        <div className="space-y-3">
          <p className="text-sm text-center text-gray-400 py-4">Chưa có hoạt động nào trong phiên này.</p>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/scan" 
          element={
            <PrivateRoute>
              <ScannerView />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
