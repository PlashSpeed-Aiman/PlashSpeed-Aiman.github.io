import { NavLink, Link } from "react-router-dom";
import ProfileLinks from "../Constants/LinkConsts";
import Hero from "../hero.jpg";
export default function About() {
  return (
    <div className="py-16">
      <div className="mx-5  md:lg:mx-auto grid grid-cols-1 gap-8 lg:grid-cols-1 lg:items-center">
        <div className="hidden mx-5 lg:mt-0 lg:col-span-1 lg:flex justify-center ">
          <figure className="grid grid-cols-1 justify-items-center">
            <img
              className="rounded-md object-cover mr-5 w-80 h-80 shadow-md hover:shadow-lg transform transition duration-500 hover:scale-105"
              src={Hero}
              alt="mockup"
            />
            <figcaption className="text-sm font-medium text-gray-500 mt-2">
              I looked much different now
            </figcaption>
          </figure>
          
        </div>
        <div class="flex flex-col  sm:flex-row  justify-center">
            <a
              href={ProfileLinks.GITHUB_LINK}
              class="inline-flex items-center justify-center text-lg font-medium text-white bg-green-500 hover:bg-green-600 px-6 py-3 rounded-md mb-4 sm:mr-4 sm:mb-0"
            >
              Github
            </a>
            <a
              href={ProfileLinks.LIBRARY_LINK}
              class="inline-flex items-center justify-center text-lg font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-md mb-4 sm:mr-4 sm:mb-0"
            >
              Library
            </a>
            <a
              href={ProfileLinks.LINKEDIN_LINK}
              class="inline-flex items-center justify-center text-lg font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-md"
            >
              LinkedIn
            </a>
          </div>
        <div class="border-t-2 lg:col-span-1">
          <h1 class="text-3xl font-bold mt-5 mb-2 text-center sm:text-justify">I'm Aiman Rahim</h1>
          <div className="flex gap-1">
            <p>About me</p>
            <p>My Skills</p>
          </div>

          <h2 class="text-lg font-medium text-gray-600 mb-8 text-justify">
            This is my second website! <br /> I am currently in the process of
            rebuilding it using tailwindcss + ReactJS, so please excuse the
            slightly unappealing appearance. As an engineer, I am not known for
            having a keen sense of aesthetics, but I am excited to challenge
            myself and improve my design skills.
          </h2>
          <p class="text-lg leading-7 text-gray-600 mb-8 text-justify">
            As a Biochem Engineering Graduate with 2 years of programming
            experience, I've found a passion for creating software that helps
            people solve their problems.
          </p>
          <p class="text-lg leading-7 text-gray-600 mb-8 text-justify">
            I've gained my experience through freelancing, hackathons, and
            working on projects with friends. Currently, I share my knowledge by
            giving Java lectures at KICT IIUM as a part-time programming tutor.
          </p>
          <p class="text-lg leading-7 text-gray-600 mb-8 text-justify">
            But that's not all! I'm also the founder of Lambda, a study group
            where we meet every Friday night to discuss topics on Software
            Engineering. My favorite language is F#/OCaml, although I'm also
            proficient in C#/.NET, Python, and Go.
          </p>
          <p class="text-lg leading-7 text-gray-600 mb-8 text-justify">
            Apart from my work, I'm currently building two startups. The first
            is a software training company that I founded with a friend. The
            second is Project <Link className={"hover:underline text-blue-600"} to={"/about-gerakan"}>Gerakan Developer Tanahair</Link>  (Project Homeland
            Developer Movement), a community aimed at growing a developer
            culture in IIUM.
          </p>
          <p class="text-lg leading-7 text-gray-600 mb-8 text-justify">
            When I'm not programming, I like to read, cook, and learn Dutch.
          </p>

          
        </div>

      </div>

    </div>
  );
}
