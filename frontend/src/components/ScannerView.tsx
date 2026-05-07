import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';

export default function ScannerView() {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Only init if we haven't already
    if (!scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        /* verbose= */ false
      );
      
      scanner.render(
        (decodedText) => {
          setScanResult(decodedText);
          scanner.clear(); // Stop scanning on success
        },
        (errorMessage) => {
          // It throws a lot of errors when it doesn't detect a code, so we ignore them mostly.
          console.debug("Scan error:", errorMessage);
        }
      );
      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(e => console.error(e));
        scannerRef.current = null;
      }
    };
  }, []);

  const handleUpdateStatus = async () => {
    if (!scanResult) return;
    try {
      const token = localStorage.getItem('token');
      // Using the admin orders endpoint as default. scanResult should be the Order ID
      const res = await fetch(`/api/admin/orders/${scanResult}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'DELIVERED' })
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Lỗi cập nhật trạng thái đơn hàng");
      }
      alert("Đã cập nhật trạng thái đơn hàng thành DELIVERED!");
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <header className="w-full bg-blue-600 text-white p-4 flex items-center shadow-md">
        <button onClick={() => navigate('/')} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Scan Barcode</h1>
      </header>
      
      <main className="flex-1 w-full max-w-md p-4 flex flex-col items-center mt-6">
        {!scanResult ? (
          <div className="w-full bg-white rounded-lg shadow p-4">
            <div id="reader" className="w-full"></div>
            <p className="text-center text-sm text-gray-500 mt-4">Point your camera at a barcode/QR code</p>
          </div>
        ) : (
          <div className="w-full bg-white rounded-lg shadow p-6 flex flex-col items-center">
            <CheckCircle className="text-green-500 mb-4" size={64} />
            <h2 className="text-lg font-bold mb-2">Code Scanned!</h2>
            <p className="text-xl bg-gray-100 p-3 rounded w-full text-center mb-6 font-mono break-all">{scanResult}</p>
            
            {error && (
              <div className="w-full bg-red-100 text-red-700 p-3 rounded mb-4 flex items-center">
                <XCircle className="mr-2" /> {error}
              </div>
            )}
            
            <button 
              onClick={handleUpdateStatus}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow hover:bg-blue-700 transition"
            >
              Mark as Delivered
            </button>
            <button 
              onClick={() => {
                setScanResult(null);
                window.location.reload(); // Quick hack to restart scanner for demo
              }}
              className="w-full mt-3 bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg shadow hover:bg-gray-300 transition"
            >
              Scan Another
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
