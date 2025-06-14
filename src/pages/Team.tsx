
import React from "react";
import { Instagram, Linkedin, Phone } from "lucide-react";

const founders = [
  {
    name: "Sivamanikanta Mallipurapu",
    title: "Founder & CEO",
    image: "/Sivamanikanta.jpg",
    linkedin: "https://www.linkedin.com/in/sivamanikanta-mallipurapu/",
    instagram: "https://www.instagram.com/sivamanikanta.mallipurapu/",
    email: "mallipurapusiva@gmail.com",
    phone: "+91 9849497911",
    about: "Visionary founder of NXTGEN. Sivamanikanta leads the team with passion for transforming student guidance through technology, focusing on accessible, data-driven insights for academic and career success."
  },
  {
    name: "Chandrika Bogireddy",
    title: "Co-founder & Product Lead",
    image: "/Chandrika.jpg",
    linkedin: "https://www.linkedin.com/in/chandrika-bogireddy/",
    instagram: "https://www.instagram.com/chandrika.bogireddy/",
    email: "chandrika.nxtgen@gmail.com",
    phone: "+91 9876543210",
    about: "Co-founder and key builder of NXTGEN. Chandrika specializes in product experience and outreach, helping empower students and create innovative solutions for the education community."
  },
];

const cardBgColors = [
  "bg-gradient-to-br from-green-100 to-green-200",
  "bg-gradient-to-br from-blue-100 to-blue-200"
];

const Team = () => (
  <div className="hidden lg:block min-h-screen py-14 px-4 bg-white">
    <div className="max-w-6xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-2 tracking-tight animate-fade-in">
        Meet Our <span className="text-green-600">Team</span>
      </h1>
      <p className="text-lg text-center text-blue-500/80 mb-12 max-w-2xl mx-auto animate-fade-in">
        NXTGEN is built by passionate students and innovators dedicated to helping you succeed. Connect with us and explore our mission!
      </p>
      <div className="grid md:grid-cols-2 gap-8 justify-center animate-fade-in">
        {founders.map((member, idx) => (
          <div
            key={member.name}
            className={`rounded-2xl shadow-xl flex flex-col items-center p-8 transition-transform hover:scale-105 hover:shadow-2xl border-2 border-blue-200 relative ${cardBgColors[idx % cardBgColors.length]}`}
          >
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-blue-300 to-green-300 flex items-center justify-center border-4 border-green-300 shadow-lg mb-6 overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-36 h-36 rounded-full object-cover"
                onError={e => (e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(member.name) + "&background=2563eb&color=fff")}
              />
            </div>
            <h2 className="text-2xl font-bold text-blue-800 mb-1">{member.name}</h2>
            <p className="text-green-800 font-semibold mb-2">{member.title}</p>
            <p className="text-gray-700 mb-4 text-center leading-relaxed">{member.about}</p>
            <div className="flex gap-4 mb-3">
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                <Linkedin className="w-6 h-6 text-blue-700 hover:scale-110 hover:text-blue-500 transition" />
              </a>
              <a href={member.instagram} target="_blank" rel="noopener noreferrer" title="Instagram">
                <Instagram className="w-6 h-6 text-pink-500 hover:scale-110 hover:text-pink-400 transition" />
              </a>
              <a href={`mailto:${member.email}`} title="Email">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  strokeWidth={2} stroke="currentColor"
                  className="w-6 h-6 text-blue-600 hover:text-blue-400 transition inline"
                >
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15A2.25 2.25 0 012.25 17.25V6.75M21.75 6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.668a2.25 2.25 0 01-.66 1.59l-7.5 7.67a2.25 2.25 0 01-3.18 0l-7.5-7.67a2.25 2.25 0 01-.66-1.59V6.75"
                  />
                </svg>
              </a>
              <a href={`tel:${member.phone.replace(/\s/g, '')}`} title="Phone">
                <Phone className="w-6 h-6 text-green-600 hover:scale-110 hover:text-green-400 transition" />
              </a>
            </div>
            <div className="flex flex-col items-center text-sm">
              <span className="text-gray-500 mb-1">
                <span className="font-medium">Email:</span>&nbsp;
                <a href={`mailto:${member.email}`} className="underline text-blue-700">{member.email}</a>
              </span>
              <span className="text-gray-500 mt-1">
                <span className="font-medium">Phone:</span>&nbsp;
                <a href={`tel:${member.phone.replace(/\s/g, '')}`} className="underline text-green-700">{member.phone}</a>
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center text-blue-400/70 text-xs">
        (This team page is only visible on desktop devices)
      </div>
    </div>
  </div>
);

export default Team;
