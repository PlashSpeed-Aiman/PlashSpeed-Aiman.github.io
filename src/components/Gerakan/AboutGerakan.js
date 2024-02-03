import {Link} from "react-router-dom";

export default function AboutGerakan() {
    return (
        <section className="">
            <div className="mx-10 md:lg:xl:mx-auto  md:py-16 lg:flex flex-col items-center">
                <div className=" ">
                    <h1 className="text-5xl font-bold mb-6 text-gray-900">Gerakan Developer Tanahair</h1>
                    <section id="introduction">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Introduction</h2>
                        <p className="text-lg leading-relaxed mb-8 text-gray-600 text-justify">
                            Hi! We are Gerakan Developer Tanahair, a group of students + alumni who are passionate about
                            software development.
                            We started as a study group called <strong>Lambda</strong>, but we have since expanded to
                            include more
                            students.

                        </p>
                        <p className="text-lg leading-relaxed mb-8 text-gray-600 text-justify">
                            The current iteration
                            is called Gerakan Developer Tanahair. We are currently based in IIUM, but we have plans to
                            expand to other universities.
                            Most of the orignal members of Lambda are now working in the industry, but we still meet
                            regularly to discuss topics on software
                            engineering. Our members comes from different Kulliyyahs with different backgrounds, with a
                            majority from
                            KOE and KICT.

                        </p>
                        <p className="text-lg leading-relaxed mb-8 text-gray-600 text-justify">

                        </p>


                    </section>

                    <section id="vision">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Some thoughts</h2>
                        <p className="text-lg leading-relaxed mb-8 text-gray-600 text-justify">
                            Our vision is to create a developer culture in IIUM. We want to create a community of
                            lifelong learners and innovators ready to tackle the challenges of the digital age. A
                            community that is
                            also inclusive and diverse regardless of background


                        </p>

                        <p className="text-lg leading-relaxed mb-8 text-gray-600 text-justify">
                            We hoped that our community will can help students and alumni become more competitive in the
                            job market and also to help them become better software developers.
                        </p>

                        <p className="text-lg leading-relaxed mb-8 text-gray-600 text-justify">
                            It is also our hopes that our community members will be able to contribute to the Muslim
                            Ummah through technology.
                        </p>

                        <p className="text-lg leading-relaxed mb-8 text-gray-600 text-justify">
                            Come join us in this journey to create a developer culture in IIUM and help build
                            <br/>
                            <Link className='text-orange-500 hover:underline' to={"https://twitter.com/hashtag/gerakandevelopertanahair?src=hashtag_click"}>#GerakanDeveloperTanahair</Link>
                        </p>
                    </section>
                </div>
            </div>
        </section>
    )
}