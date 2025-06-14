
import React from "react";
const founders = [
  {
    name: "Sivamanikanta Mallipurapu",
    title: "Founder",
    image: "/Sivamanikanta.jpg", // you can upload the image with this name
    linkedin: "https://www.linkedin.com/in/sivamanikanta-mallipurapu/",
    instagram: "https://www.instagram.com/sivamanikanta.mallipurapu/",
    email: "sivamani.nxtgen@gmail.com",
    phone: "+91 9123456789",
  },
  {
    name: "Chandrika Bogireddy",
    title: "Co-founder",
    image: "/Chandrika.jpg", // you can upload the image with this name
    linkedin: "https://www.linkedin.com/in/chandrika-bogireddy/",
    instagram: "https://www.instagram.com/chandrika.bogireddy/",
    email: "chandrika.nxtgen@gmail.com",
    phone: "+91 9876543210",
  },
];

const Team = () => (
  <div className="hidden lg:block max-w-4xl mx-auto bg-white p-10 rounded-lg shadow-xl mt-8">
    <h1 className="text-3xl font-bold mb-8 text-blue-700">Meet the NXTGEN Team</h1>
    <div className="grid grid-cols-2 gap-8">
      {founders.map((member) => (
        <div key={member.name} className="flex flex-col items-center bg-blue-50 rounded-2xl p-6 border border-blue-100 shadow-md">
          <img
            src={member.image}
            alt={member.name}
            className="w-36 h-36 rounded-full object-cover border-4 border-green-300 mb-4"
            onError={e => (e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(member.name))}
          />
          <h2 className="text-lg font-bold text-green-700 mb-2">{member.name}</h2>
          <p className="text-blue-500 font-semibold mb-2">{member.title}</p>
          <div className="flex gap-3 mb-2">
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">LinkedIn</a>
            <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-500 underline">Instagram</a>
          </div>
          <div className="mb-1">
            <span className="text-gray-600">Email: </span>
            <a href={`mailto:${member.email}`} className="text-blue-600 underline">{member.email}</a>
          </div>
          <div>
            <span className="text-gray-600">Phone: </span>
            <a href={`tel:${member.phone}`} className="text-violet-700 underline">{member.phone}</a>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-10 text-gray-400 text-xs text-center">(This page is only visible on desktop devices)</div>
  </div>
);

export default Team;
