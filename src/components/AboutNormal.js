import { NavLink ,Link} from "react-router-dom";
import ProfileLinks from "../Constants/LinkConsts";
import Hero from "../hero.jpg";
export default function About() {
  return (
    <section>
      <div className="container mx-auto flex px-10 py-20 md:flex-row flex-col items-center bg-slate-200	">
      <div className="hidden lg:mt-0 lg:col-span-1 lg:flex">
            <figure className="grid grid-cols-1 justify-items-center">
            <img className="rounded-md object-cover mr-5 max-h-25 w-30" src={Hero} alt="mockup"/>
            <figcaption>I looked much different now</figcaption>
            </figure>
            
        </div>
        <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
          <h1 className="font-bold text-2xl">I'm Aiman Rahim</h1>
          <h2 className="text-xl text-justify">
            Dit is mijn tweede website!<br/>
            This website is a bit ugly for the moment, because I'm rebuilding it
            with tailwindcss (Also, I rarely heard of Engineers with a sense of aesthetics)
          </h2>
          <p className="text-justify">
            I'm a Biochem Engineering Graduate with 2 years of programming
            experience, mostly through freelancing , hackathons, and doing
            projects together with friends.
          </p>
          <br className="hidden lg:inline-block"></br>
          <p className="text-justify">
            I give Java lectures on a part-time basis at KICT IIUM as a programming tutor. I
            have a study group called Lambda, where we meet every Friday night
            to discuss topics on Software Engineering
          </p>
          <p className="text-justify">
            The languages I used is mostly C#/.NET, Python, Go, and sometimes
            JS/TS. My favourite language currently is F#/OCaml
          </p>
          <br></br>
          <p>
            I'm currently building 2 startups. Number one is a software training company with a friend. Number two is Projek
            Gerakan Developer Tanahair (Project Homeland Developer Movement), a
            community aimed at growing a developer culture in IIUM
          </p>
          <br></br>
          <p>I like to read, cook, and learn Dutch</p>
          <p className="bg-orange-600 p-0.5">
            Welkom bij mijn website! Ik ben een Developer
          </p>
          <br/>
          <div className="flex justify-center">
          <a
            href={ProfileLinks.GITHUB_LINK}
            className="inline-flex text-white bg-green-500 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded text-lg"
          >
            Github
          </a>
          <a
            href={ProfileLinks.LIBRARY_LINK}
            className="ml-4 inline-flex text-gray-400 bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-700 hover:text-white rounded text-lg"
          >
            Library
          </a>
          <a
            href={ProfileLinks.LINKEDIN_LINK}
            className="ml-4 inline-flex text-gray-400 bg-gray-800 border-0 py-2 px-6 focus:outline-none hover:bg-gray-700 hover:text-white rounded text-lg"
          >
            LinkedIn
          </a>
          
        </div>
        
        </div>
        
         
      </div>
    </section>
  );
}
