import {useState} from "react";

export function WhatsApp(){

    const [phone, setPhone] = useState("");

    function handleClick(e){
        e.preventDefault();
        window.open(`https://wa.me/${phone}?text=Hi%20there%20I%20am%20interested%20in%20your%20services`);
    }

    return (
        <section>
            <div className="mx-10 md:lg:xl:mx-auto  md:py-16 lg:flex flex-col items-center">
                <div>
                    <h1 className="text-5xl font-bold text-center">WhatsApp Tool</h1>
                    <p className="text-2xl text-center">Type into the text field and press Enter to chat with a person on WhatsApp</p>
                    <form onSubmit={handleClick} autoComplete="off">
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="name"
                            type="text"
                            placeholder="Phone Number"
                            onInput={(e) => setPhone(e.target.value)}
                        />
                    </form>

                </div>
            </div>
        </section>
    )
}