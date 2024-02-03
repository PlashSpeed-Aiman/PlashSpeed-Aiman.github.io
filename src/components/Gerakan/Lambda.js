import pic from "../../1679732830286.jpg";
import pic2 from "../../2022.jpg";
export default function Lambda() {
  return (
    <section className="">
      <div className="mx-10 md:lg:xl:mx-auto  md:py-16 lg:flex flex-col items-center">
        <div className=" ">
          <h1 className="text-5xl font-bold mb-6 text-gray-900">Lambda</h1>
          <p className="text-lg leading-relaxed mb-8 text-gray-600 text-justify">
            Lambda is a small study group that I started with my junior and good
            friend, Akmal. We meet every week and discuss things on software
            engineering mostly. We recently opened the group to other students.
            The current iteration is called Projek Gerakan Developer Tanahair.
          </p>
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 text-gray-900">
              Topics We Cover
            </h2>
            <div className='bg-white rounded-md shadow p-2'>
              <ul className="list-disc pl-6 text-gray-600">
                <li>Telegram bot</li>
                <li>Async IO in Python</li>
                <li>F#</li>
                <li>Websockets</li>
                <li>SignalR</li>
                <li>
                  Reactive Extensions (this one is the hardest to understand till
                  this day)
                </li>
              </ul>
            </div>

          </div>
          <p className="text-lg leading-relaxed mb-8 text-gray-600 text-justify">
            I regularly open applications to join every semester, but the group
            has a strict attendance policy. You can only miss 2 classes per
            month or you will be removed immediately until next month's study
            sessions.
          </p>
        </div>
        <div className="">
          <div className="flex flex-col md:lg:grid md:lg:grid-cols-2 gap-4 ">
            <img
                className="object-cover h-64 md:h-96 rounded-lg shadow-lg"
              src={pic2}
              alt="Lambda"
            />
            <img
                className="object-contain h-64 md:h-96 rounded-lg shadow-lg"
              src={pic}
              alt="Lambda"
            />
          </div>
          <p className="text-lg font-bold my-5 text-gray-900 text-center">
            Study Group Sessions
          </p>
        </div>
      </div>
    </section>
  );
}
