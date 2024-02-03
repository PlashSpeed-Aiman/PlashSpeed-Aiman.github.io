import pic2 from "../../2022.jpg";
import pic from "../../1679732830286.jpg";
import {Link} from "react-router-dom";

export default function Activities() {
    return (
        <section className="">
            <div className="mx-10 md:lg:xl:mx-auto  md:py-16 lg:flex flex-col items-center">
                <div className=" ">
                    <h1 className="text-5xl font-bold mb-6 text-gray-900">Activities</h1>
                    <p className="text-lg leading-relaxed mb-8 text-gray-600 text-justify">
                        Our activities are mainly focused on learning, sharing knowledge and community building.
                        Generally, we just want to have fun with coding.
                    </p>
                    <div className="mb-8">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">
                            The things we do:
                        </h2>
                        <ul className="list-disc pl-6 text-gray-600">
                            <li>Meetups
                                <ul className=" pl-6 my-2">
                                    <li className='bg-white rounded-md p-2 text-justify shadow'>
                                        Meetups are where we gather to learn and share knowledge with each other.
                                        Generally we just hang out and talk about tech. Sometimes, our members have new projects in the works
                                    </li>
                                </ul>
                            </li>
                            <li>Workshops
                                <ul className=" pl-6 my-2">
                                    <li className='bg-white rounded-md p-2 text-justify shadow'>
                                        We are passionate about learning and sharing knowledge. We regularly
                                        organize workshops to help our members learn new things. We also
                                        encourage our members to share their knowledge with others. We believe
                                        that the best way to learn is to teach others.
                                    </li>
                                </ul>
                            </li>
                            <li>Dev Talks
                                <ul className=" pl-6 my-2">
                                    <li className='bg-white rounded-md p-2 text-justify shadow'>
                                        Dev Talks are part of our industrial-students collaboration program.
                                        It is where we invite experienced developers to share their
                                        knowledge and experience with our members. We believe that learning
                                        from experienced developers is the best way to improve our skills.
                                        Notable speakers include:
                                        <ul className=" pl-6">
                                            <li className='list-disc'>Izwan Wahab (Robotys)</li>
                                            <li className='list-disc'>Ku Syuk</li>
                                            <li className='list-disc'>Atif Al-Serembani</li>
                                            <li className='list-disc'>Farhan Helmy</li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            <li>Hackathons
                                <ul className=" pl-6 my-2">
                                    <li className='bg-white rounded-md p-2 text-justify shadow'>
                                        A 24-hour coding challenge to put our skills to its limits. Our first
                                        hackathon was held in 30th December 2023. We are planning to hold
                                        more hackathons in the future.

                                        Our first hackathon are map-based solutions for the IIUM Community.
                                        Stay tuned for our next hackathon!
                                    </li>
                                </ul>
                            </li>
                            <li>Study Group (Lambda)
                                <ul className=" pl-6 my-2">
                                    <li className='bg-white rounded-md p-2 text-justify shadow'>
                                        See more about our study group <Link className='text-orange-500 hover:underline'
                                                                             to="/lambda">here</Link>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                </div>

            </div>
        </section>
    );
}