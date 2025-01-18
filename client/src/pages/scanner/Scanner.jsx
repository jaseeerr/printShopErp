import React, { useEffect, useRef, useState } from 'react';
import { Camera, AlertCircle, Loader } from 'lucide-react';

const QrScanner = ({ closeModal }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
        script.onload = startScanner;
        script.onerror = () => setError('Failed to load QR scanner. Please try again.');
        document.body.appendChild(script);

        return () => {
            stopScanner();
            document.body.removeChild(script);
        };
    }, []);

    const startScanner = async () => {
        if (typeof jsQR !== 'function') {
            setError('QR scanner failed to initialize. Please refresh and try again.');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.addEventListener('loadedmetadata', () => {
                    const canvas = canvasRef.current;
                    canvas.width = videoRef.current.videoWidth;
                    canvas.height = videoRef.current.videoHeight;
                    setIsLoading(false);
                    scanQRCode();
                });
            }
        } catch (err) {
            console.error('Error accessing the camera: ', err);
            setError('Could not access camera. Please ensure permissions are enabled.');
        }
    };

    const stopScanner = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
        }
    };

    const scanQRCode = () => {
        const canvas = canvasRef.current;
        const video = videoRef.current;
        const context = canvas.getContext('2d');

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);

        if (code) {
            stopScanner();
            window.open(code.data, '_blank');
            setTimeout(() => {
                closeModal();
            }, 1000);
            return;
        }

        requestAnimationFrame(scanQRCode);
    };

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-4 text-center">
                <AlertCircle size={48} className="text-red-500 mb-4" />
                <p className="text-lg font-semibold text-red-500 mb-2">{error}</p>
                <button
                    onClick={closeModal}
                    className="mt-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors duration-300"
                >
                    Close
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-4">
            {/* <h2 className="text-2xl font-bold mb-4 text-black">QR Code Scanner</h2> */}
            <div className="relative w-full max-w-md aspect-video mb-4">
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
                        <Loader size={48} className="text-black animate-spin" />
                    </div>
                )}
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover rounded-lg border-2 border-black"
                ></video>
                <canvas ref={canvasRef} className="hidden"></canvas>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                <Camera size={18} />
                <p>Point your camera at a QR code</p>
            </div>
        </div>
    );
};

export default QrScanner;