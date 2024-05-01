import {useEffect, useState} from "react";

function debounce(func, timeout = 300){
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}

export default function QrCode() {

    const [qrCode, setQrCode] = useState(null);
    //use ref

    const [qrCodeUrl, setQrCodeUrl] = useState({
        url: null,
        description: null
    });
    const generateQrCode = (e) => {
        setQrCode(e.target.value);
        if (qrCode) {
            window.open(`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrCode}`);
        }
    const downloadPng = () => {
        if (qrCode) {
            const link = document.createElement('a');
            link.download = 'qr-code.png';
            link.href = qrCodeUrl.url;
            link.click();
        }
    }



    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            // Make API request with the current value
            setQrCodeUrl({
                url: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrCode}`,
                description: qrCode
            })

        }, 1000);
        return () => clearTimeout(delayDebounceFn);
    }, [qrCode]);

    const handleChange = event => {
        setQrCode(event.target.value);
    };
    return (
        <section>
            <div className="mx-10 md:lg:xl:mx-auto  md:py-16 lg:flex flex-col items-center">
                <div>
                    <h1 className="text-5xl font-bold text-center">QR Code Utility</h1>
                    <p className="text-2xl text-center">Type into the text field to generate a QR code</p>
                    <form autoComplete="off">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            placeholder="Name"
                            value={qrCode}
                            onInput={(e) => handleChange(e)}
                        />
                    </form>
                    {
                        qrCode &&
                        <div className={"flex flex-col justify-center items-center my-2 border border-orange-100 bg-gray-50 p-2 shadow rounded-md"}>
                        <img src={qrCodeUrl.url} alt="qr code"/>
                        <p>{qrCodeUrl.description}</p>
                        </div>
                    }
                    <button onClick={downloadPng} className="bg-orange-500 text-white px-2 py-1 rounded-md">Generate QR Code</button>
                </div>
            </div>
        </section>

        )
}}