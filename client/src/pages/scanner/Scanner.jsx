import React, { useEffect, useRef } from 'react';

const QrScanner = () => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        // Load jsQR script from CDN
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js';
        script.onload = startScanner;
        document.body.appendChild(script);

        return () => {
            // Clean up by stopping the video and removing the script on unmount
            stopScanner();
            document.body.removeChild(script);
        };
    }, []);

    const startScanner = async () => {
        if (typeof jsQR !== 'function') {
            console.error('jsQR library failed to load.');
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
                    scanQRCode();
                });
            }
        } catch (err) {
            console.error('Error accessing the camera: ', err);
            alert('Could not access camera. Please ensure permissions are enabled.');
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
            // alert(`Scanned QR Code: ${code.data}`);
            stopScanner(); // Stop the scanner after a successful scan
            window.open(code.data, '_blank');
            setTimeout(()=>{
               location.reload()
            },1000)
            return;
        }

        // Continue scanning
        requestAnimationFrame(scanQRCode);
    };

    return (
        <div>
            <h2>QR Code Scanner</h2>
            <video ref={videoRef} autoPlay style={{ width: '50%', border: '1px solid black' }}></video>
            <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
        </div>
    );
};

export default QrScanner;
