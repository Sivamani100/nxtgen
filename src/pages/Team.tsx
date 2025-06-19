import React from "react";
import { Linkedin, Mail, Phone, Users } from "lucide-react";

// Team members with founder in the middle
const founders = [
  {
    name: "Chandrika Bogireddy",
    title: "Co-founder & Product Lead",
    image: "/lovable-uploads/9602b8f1-9a2f-49b0-8b5a-eea50bc74771.png",
    linkedin: "https://www.linkedin.com/in/chandrika-bogireddy/",
    email: "bogireddychandrika9@gmail.com",
    phone: "+91 7799387868",
    about:
      "Co-founder and key builder of NXTGEN. Chandrika specializes in product experience and outreach, empowering students with innovative solutions for the education community.",
  },
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
    name: "Nellipudi. Chandra lakshmi",
    title: "CTO",
    image: "/lovable-uploads/placeholder-arjun.png",
    linkedin: "Chandra Lakshmi Nellipudi",
    email: "chandrikanellipudi67@gmail.com",
    phone: "+91 7893813298",
    about:
      "Chief Technology Officer driving NXTGEN's technical vision. Arjun brings expertise in scalable systems and AI-driven solutions to enhance student success platforms.",
  },
];

const cardBgColors = [
  "bg-gradient-to-br from-blue-50 to-blue-100",
  "bg-gradient-to-br from-green-50 to-green-100",
  "bg-gradient-to-br from-purple-50 to-purple-100",
];

const Team = () => (
  <div className="min-h-screen py-20 px-6 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="flex gap-4 items-center justify-center mb-8">
        <Users className="w-12 h-12 text-blue-600" />
        <h1 className="text-5xl font-extrabold text-center text-blue-900 tracking-tight animate-fade-in">
          Our <span className="text-green-600">Leadership</span> Team
        </h1>
      </div>
      <p className="text-xl text-center text-blue-600/70 mb-16 max-w-3xl mx-auto animate-fade-in">
        Meet the passionate innovators at NXTGEN, dedicated to revolutionizing education through technology and vision.
      </p>
      <div className="grid lg:grid-cols-3 gap-8 justify-center animate-fade-in">
        {founders.map((member, idx) => {
          const isFounder = member.title.includes("Founder & CEO");
          return (
            <div
              key={member.name}
              className={`rounded-3xl shadow-lg flex flex-col items-center p-8 transition-all duration-300 hover:shadow-xl border border-gray-100 ${
                isFounder
                  ? "lg:scale-110 lg:-mt-8 bg-gradient-to-br from-green-100 to-blue-100 shadow-2xl border-2 border-green-300"
                  : cardBgColors[idx % cardBgColors.length]
              }`}
            >
              <div
                className={`${
                  isFounder ? "w-44 h-44" : "w-36 h-36"
                } rounded-full bg-gradient-to-br from-blue-200 to-green-200 flex items-center justify-center border-4 ${
                  isFounder ? "border-green-500" : "border-blue-300"
                } shadow-lg mb-6 overflow-hidden`}
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full rounded-full object-cover"
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(member.name) +
                      "&background=2563eb&color=fff")
                  }
                />
              </div>
              <h2 className="text-2xl font-bold text-blue-900 mb-1">{member.name}</h2>
              <p
                className={`${
                  isFounder ? "text-green-600" : "text-blue-600"
                } font-semibold mb-3`}
              >
                {member.title}
              </p>
              <p className="text-gray-600 mb-6 text-center leading-relaxed max-w-xs">
                {member.about}
              </p>
              <div className="flex gap-6 mb-4">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="LinkedIn"
                >
                  <Linkedin
                    className={`w-6 h-6 ${
                      isFounder
                        ? "text-green-600 hover:text-green-400"
                        : "text-blue-600 hover:text-blue-400"
                    } hover:scale-125 transition-transform duration-200`}
                  />
                </a>
                <a href={`mailto:${member.email}`} title="Email">
                  <Mail
                    className={`w-6 h-6 ${
                      isFounder
                        ? "text-green-600 hover:text-green-400"
                        : "text-blue-600 hover:text-blue-400"
                    } hover:scale-125 transition-transform duration-200`}
                  />
                </a>
                <a href={`tel:${member.phone.replace(/\s/g, "")}`} title="Phone">
                  <Phone
                    className={`w-6 h-6 ${
                      isFounder
                        ? "text-green-600 hover:text-green-400"
                        : "text-blue-600 hover:text-blue-400"
                    } hover:scale-125 transition-transform duration-200`}
                  />
                </a>
              </div>
              <div className="flex flex-col items-center text-sm">
                <span className="text-gray-600 mb-2">
                  <span className="font-medium">Email:</span> 
                  <a
                    href={`mailto:${member.email}`}
                    className={`underline ${
                      isFounder
                        ? "text-green-600 hover:text-green-500"
                        : "text-blue-600 hover:text-blue-500"
                    }`}
                  >
                    {member.email}
                  </a>
                </span>
                <span className="text-gray-600">
                  <span className="font-medium">Phone:</span> 
                  <a
                    href={`tel:${member.phone.replace(/\s/g, "")}`}
                    className={`underline ${
                      isFounder
                        ? "text-green-600 hover:text-green-500"
                        : "text-blue-600 hover:text-blue-500"
                    }`}
                  >
                    {member.phone}
                  </a>
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-16 text-center text-blue-500/60 text-sm">
        Connect with our team to explore how NXTGEN can empower your journey.
      </div>
    </div>
  </div>
);

export default Team;
