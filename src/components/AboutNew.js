import { NavLink, Link } from "react-router-dom";
import ProfileLinks from "../Constants/LinkConsts";
import Hero from "../hero.jpg";
import style from "../index.css";
import {useEffect, useState} from "react";
import Tootlip from "./Tooltip";
import {langMap} from "../Constants/LanguageDescriptions.js";
import Tooltip from "./Tooltip";
export default function About() {
  const [active, setActive] = useState(false);
  const [picture, setPicture] = useState(Hero);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showSquare, setShowSquare] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const [lang, setLang] = useState("CSharp");


  function setTooltip(e){
    switch (e.target.innerHTML){
        case "C#":
            setLang("CSharp");
            break;
        case "Python":
            setLang("Python");
            break;
        case "Go":
            setLang("Go");
            break;
        case "JS/TS":
            setLang("JS");
            break;
        case "OCaml":
            setLang("OCaml");
            break;
    }
    setShowTooltip(true);
  }

  function imageBlurEffect(e) {
      let x= document.getElementById("hero").getBoundingClientRect();
      if(e.nativeEvent === undefined) return
      if (e.nativeEvent.pageX > x.left && e.nativeEvent.pageX < x.right && e.nativeEvent.pageY > x.top && e.nativeEvent.pageY < x.bottom ) {

          setShowSquare(true);
          setCoordinates(e);

      }
      else{
          setShowSquare(false);

      }
  }
  function setCoordinates(e){
    setMouseX(e.nativeEvent.pageX );
    setMouseY(e.nativeEvent.pageY);
  }

  function toggle() {
    setActive(!active);
    setShowTooltip(false)
  }

  return (
    <div className="pt-2">
      <div className="mx-10  md:lg:mx-auto grid grid-cols-1 gap-8 lg:grid-cols-1 lg:items-center">
        <div className="hidden mx-5 lg:mt-0 lg:col-span-1 lg:flex justify-center ">
          <figure className="grid grid-cols-1 justify-items-center">
            <img
                id={'hero'}
                onMouseEnter={e => setShowSquare(true)}
                onMouseMove={e => setCoordinates(e)}
              className="fade-in rounded-md object-cover mr-5 w-80 h-80 shadow-md hover:shadow-lg  transition-all transform duration-500 hover:scale-105"
              src={picture}
              alt="mockup"
            />

            <figcaption className="text-sm font-medium text-gray-500 mt-2">
              I looked much different now
            </figcaption>
          </figure>

        </div>
        <div class="flex flex-col  md:flex-row  justify-center">
            <a
              href={ProfileLinks.GITHUB_LINK}
              class="inline-flex items-center justify-center text-lg font-medium text-white bg-dark px-6 py-2.5  rounded-md mb-4 md:mr-4 md:mb-0"
            >
              Github
            </a>
            <a
              href={ProfileLinks.LIBRARY_LINK}
              class="inline-flex items-center justify-center text-lg font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 px-6 py-2.5 rounded-md mb-4 md:mr-4 md:mb-0"
            >
              Library
            </a>
            <a
              href={ProfileLinks.LINKEDIN_LINK}
              class="inline-flex items-center justify-center text-lg font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 px-6 py-2.5 rounded-md"
            >
              LinkedIn
            </a>
          </div>
        <div className=" border-t-2 lg:col-span-1">
          <h1 className="text-3xl font-bold mt-5 mb-2 text-center sm:text-justify">I'm Aiman Rahim , Grad.Eng</h1>
          <button className={"border border-orange-400 rounded-xl bg-orange-500 text-white px-1.5 py-1 -mx-1 transition active:shadow"} onClick={toggle}>Toggle My Skills
          </button>

          {active && (
                <div className={'fade-in max-w-lg  flex flex-row mx-auto gap-2 mt-4'}>

                    <button onMouseOut={e => setShowTooltip(false)} onMouseOver={setTooltip} onMouseMove={setCoordinates}  className={'rounded-md bg-zinc-50 px-2 py-1.5 w-full transition hover:bg-orange-500'}>C#</button>

                    <button onMouseOut={e => setShowTooltip(false)}  onMouseMove={setCoordinates} onMouseOver={setTooltip}  className={'rounded-md bg-zinc-50 px-2 py-1.5 w-full transition hover:bg-orange-500'}>Python</button>

                    <button onMouseOut={e => setShowTooltip(false)}  onMouseMove={setCoordinates} onMouseOver={setTooltip}  className={'rounded-md bg-zinc-50 px-2 py-1.5 w-full transition hover:bg-orange-500'}>Go</button>

                    <button onMouseOut={e => setShowTooltip(false)} onMouseMove={setCoordinates} onMouseOver={setTooltip}  className={'rounded-md bg-zinc-50 px-2 py-1.5 w-full transition hover:bg-orange-500'}>JS/TS</button>

                    <button onMouseOut={e => setShowTooltip(false)}  onMouseMove={setCoordinates} onMouseOver={setTooltip}  className={'rounded-md bg-zinc-50 px-2 py-1.5 w-full transition hover:bg-orange-500'}>OCaml</button>


                </div>
          )}
          {showTooltip && <Tooltip x={mouseX} y={mouseY}  text={langMap[lang]} />}

          <p className="border -mx-1 p-2 bg-zinc-50 rounded-md text-lg shadow-sm font-medium text-gray-600 my-4 text-justify">
            This is my second website! <br/> I am currently in the process of
            rebuilding it using tailwindcss + ReactJS, so please excuse the
            slightly unappealing appearance. As an engineer, I am not known for
            having a keen sense of aesthetics, but I am excited to challenge
            myself and improve my design skills.
          </p>
          <p className="text-lg leading-7 text-gray-600 mb-8 text-justify">
            As a Biochemical Engineering Graduate with 2 years of programming
            experience, I've found a passion for creating software that helps
            people solve their problems. (The Grad.Eng title is just a free title I got for completing my degree)
          </p>
          <p className="text-lg leading-7 text-gray-600 mb-8 text-justify">
            I've gained my experience through freelancing, hackathons, and
            working on projects with friends. Currently, I share my knowledge by
            giving Java lectures at KICT IIUM as a part-time programming tutor. I am also a C# Backend Software Engineer
          </p>
          <p className="text-lg leading-7 text-gray-600 mb-8 text-justify">
            But that's not all! I'm also the founder of Lambda, a study group
            where we meet every Friday night to discuss topics on Software
            Engineering. My favorite language is F#/OCaml, although I'm also
            proficient in C#/.NET, Python, and Go.
          </p>
          <p className="text-lg leading-7 text-gray-600 mb-8 text-justify">
            Apart from my work, I'm currently building two startups. The first
            is a software training company that I founded with a friend. The
            second is Project <Link className={"hover:underline text-blue-600"} to={"/about-gerakan"}>Gerakan Developer
            Tanahair</Link> (Project Homeland
            Developer Movement), a community aimed at growing a developer
            culture in IIUM.
          </p>
          <p className="text-lg leading-7 text-gray-600 mb-8 text-justify">
            When I'm not programming, I like to read, cook, and learn languages (German, Arabic, Russian, Dutch, and Spanish).
          </p>


        </div>

      </div>

    </div>
  );
}

