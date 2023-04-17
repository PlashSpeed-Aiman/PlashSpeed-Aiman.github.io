import pic from "../1679732830286.jpg";
import pic2 from "../2022.jpg";
export default function Lambda() {
  return (
    <section className="bg-gray-100">
      <div class="container mx-auto px-4 py-16 md:px-24 md:py-32 lg:flex items-center">
        <div class="lg:w-1/2 lg:pr-16">
          <h1 class="text-5xl font-bold mb-6 text-gray-900">Lambda</h1>
          <p class="text-lg leading-relaxed mb-8 text-gray-600">
            Lambda is a small study group that I started with my junior and good
            friend, Akmal. We meet every week and discuss things on software
            engineering mostly. We recently opened the group to other students.
            The current iteration is called Projek Gerakan Developer Tanahair.
          </p>
          <div class="mb-8">
            <h2 class="text-xl font-bold mb-4 text-gray-900">
              Topics We Cover
            </h2>
            <ul class="list-disc pl-6 text-gray-600">
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
          <p class="text-lg leading-relaxed mb-8 text-gray-600">
            I regularly open applications to join every semester, but the group
            has a strict attendance policy. You can only miss 2 classes per
            month or you will be removed immediately until next month's study
            sessions.
          </p>
        </div>
        <div class="lg:w-1/2">
          <div class="grid grid-cols-2 gap-4">
            <img
              class="object-cover h-64 md:h-96 rounded-lg shadow-lg"
              src={pic2}
              alt="Lambda"
            />
            <img
              class="object-contain h-64 md:h-96 rounded-lg shadow-lg"
              src={pic}
              alt="Lambda"
            />
          </div>
          <p class="text-lg font-bold mt-8 text-gray-900 text-center">
            Study Group Sessions
          </p>
        </div>
      </div>
    </section>
  );
}
