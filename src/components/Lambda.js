import pic from "../1679732830286.jpg";
import pic2 from "../2022.jpg"
export default function Lambda() {
  return (
    <section>
      <div className="container mx-auto flex px-10 py-20 md:flex-row flex-col items-center bg-green-50	">
        <div className="lg:flex-grow  md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="  text-3xl">Lambda</h1>
          <p className="mt-2 mb-2 leading-relaxed text-justify">
            Lambda is a small study group that I started with my junior and good
            friend, Akmal. We met every week and discuss things on software
            engineering mostly. We recently opened the group to other students. The current iteration is called Projek Gerakan Developer Tanahair
          </p>
          <p>Here's a list of things we discuss for the first 6 months</p>
          <ul className="mx-5 list-none grid lg:grid-cols-3 sm:grid-cols-1 place-items-center self-center  ">
            <li className="rounded-lg bg-white shadow-md p-4 w-fit m-2 ">
              Telegram bot</li>
            <li className="rounded-lg bg-white shadow-md p-4 w-fit m-2 ">Async IO in Python</li>
            <li className="rounded-lg bg-white shadow-md p-4 w-fit m-2 ">F#</li>
            <li className="rounded-lg bg-white shadow-md p-4 w-fit m-2 ">Websockets</li>
            <li className="rounded-lg bg-white shadow-md p-4 w-fit m-2 ">SignalR</li>
            <li className="rounded-lg bg-white shadow-md p-4 w-fit m-2 ">
              Reactive Extensions (this one is the hardest to understand till
              this day)
            </li>
          </ul>
          <p className="mt-2 text-justify">
            I regularly open applications to join every semester, but the group
            has a strict attendance policy. You can only miss 2 classes per
            month or you will be removed immediately until next month's study
            sessions. 
          </p>
          <div className="bg-white px-3 py-3 rounded-md	shadow-lg flex flex-col sm:flex-row justify-center mx-auto my-5">
            <figure className=" grid grid-cols-1 justify-items-center ">
              <img
                className=" object-cover  h-60 max-w-96 mx-5 md:my-5  rounded-md"
                src={pic2}
                alt="Lambda"
              />
              <figcaption>2022 Study Group Session</figcaption>
            </figure>
            <figure className=" object-cover grid grid-cols-1 justify-items-center">
              <img
                className="  h-60 max-w-96 mx-5 md:my-5  rounded-md"
                src={pic}
                alt="Lambda"
              />
              <figcaption>2023 Study Group Session</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
