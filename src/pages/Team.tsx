import React from "react";
import { Linkedin, Mail, Phone, Users } from "lucide-react";

// Updated team members with a new member
const founders = [
  {
    name: "Sivamanikanta Mallipurapu",
    title: "Founder & CEO",
    image: "/lovable-uploads/ba52f761-d817-4827-9991-1365c4d6fc8f.png",
    linkedin: "https://www.linkedin.com/in/sivamanikanta-mallipurapu/",
    email: "mallipurapusiva@gmail.com",
    phone: "+91 9849497911",
    about:
      "Visionary founder of NXTGEN. Sivamanikanta leads with a passion for transforming student guidance through technology, focusing on accessible, data-driven insights for academic and career success.",
  },
  {
    name: "Chandrika Bogireddy",
    title: "Co-founder & Product Lead",
    image: "/lovable-uploads/9602b8f1-9a2f-49b0-8b5a-eea50bc74771.png",
    linkedin: "https://www.linkedin.com/in/chandrika-bogireddy/",
    email: "chandrika.nxtgen@gmail.com",
    phone: "+91 9876543210",
    about:
      "Co-founder and key builder of NXTGEN. Chandrika specializes in product experience and outreach, empowering students with innovative solutions for the education community.",
  },
  {
    name: "Arjun Patel",
    title: "CTO",
    image: "/lovable-uploads/placeholder-arjun.png",
    linkedin: "https://www.linkedin.com/in/arjun-patel/",
    email: "arjun.nxtgen@gmail.com",
    phone: "+91 9123456789",
    about:
      "Chief Technology Officer driving NXTGEN's technical vision. Arjun brings expertise in scalable systems and AI-driven solutions to enhance student success platforms.",
  },
];

const cardBgColors = [
  "bg-gradient-to-br from-green-100 to-green-200",
  "bg-gradient-to-br from-blue-100 to-blue-200",
  "bg-gradient-to-br from-purple-100 to-purple-200",
];

const Team = () => (
  <div className="min-h-screen py-16 px-6 bg-gray-50">
    <div className="max-w-7xl mx-auto">
      <div className="flex gap-4 items-center justify-center mb-6">
        <Users className="w-10 h-10 text-blue-600" />
        <h1 className="text-5xl font-extrabold text-center text-blue-900 tracking-tight animate-fade-in">
          Meet Our <span className="text-green-600">Team</span>
        </h1>
      </div>
      <p className="text-xl text-center text-blue-600/80 mb-12 max-w-3xl mx-auto animate-fade-in">
        NXTGEN is powered by a dedicated team of innovators committed to revolutionizing student success through technology and passion.
      </p>
      <div className="grid lg:grid-cols-3 gap-8 justify-center animate-fade-in">
        {founders.map((member, idx) => (
          <div
            key={member.name}
            className={`rounded-3xl shadow-2xl flex flex-col items-center p-8 transition-all duration-300 hover:scale-105 hover:shadow-3xl border-2 border-blue-100 ${cardBgColors[idx % cardBgColors.length]}`}
          >
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-200 to-green-200 flex items-center justify-center border-4 border-green-400 shadow-xl mb-6 overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-40 h-40 rounded-full object-cover"
                onError={(e) =>
                  (e.currentTarget.src =
                    "https://ui-avatars.com/api/?name=" +
                    encodeURIComponent(member.name) +
                    "&background=2563eb&color=fff")
                }
              />
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-1">{member.name}</h2>
            <p className="text-green-700 font-semibold mb-3">{member.title}</p>
            <p className="text-gray-600 mb-6 text-center leading-relaxed max-w-xs">{member.about}</p>
            <div className="flex gap-6 mb-4">
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" title="LinkedIn">
                <Linkedin className="w-7 h-7 text-blue-700 hover:scale-125 hover:text-blue-500 transition-transform duration-200" />
              </a>
              <a href={`mailto:${member.email}`} title="Email">
                <Mail className="w-7 h-7 text-blue-600 hover:scale-125 hover:text-blue-400 transition-transform duration-200" />
              </a>
              <a href={`tel:${member.phone.replace(/\s/g, "")}`} title="Phone">
                <Phone className="w-7 h-7 text-green-600 hover:scale-125 hover:text-green-400 transition-transform duration-200" />
              </a>
            </div>
            <div className="flex flex-col items-center text-sm">
              <span className="text-gray-600 mb-2">
                <span className="font-medium">Email:</span> 
                <a href={`mailto:${member.email}`} className="underline text-blue-700 hover:text-blue-500">{member.email}</a>
              </span>
              <span className="text-gray-600">
                <span className="font-medium">Phone:</span> 
                <a href={`tel:${member.phone.replace(/\s/g, "")}`} className="underline text-green-700 hover:text-green-500">{member.phone}</a>
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 text-center text-blue-500/70 text-sm">
        Our team is here to guide you every step of the way.
      </div>
    </div>
  </div>
);

export default Team;
