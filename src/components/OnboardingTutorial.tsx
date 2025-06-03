
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Search, Bell, Calendar, Newspaper } from "lucide-react";

interface OnboardingTutorialProps {
  onComplete: () => void;
}

const OnboardingTutorial = ({ onComplete }: OnboardingTutorialProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: <Search className="w-16 h-16 text-blue-500" />,
      title: "Search Scholarships",
      description: "Find scholarships that match your academic field and requirements with our powerful search engine."
    },
    {
      icon: <Bell className="w-16 h-16 text-green-500" />,
      title: "Get Notifications",
      description: "Receive real-time updates about new scholarships, admission deadlines, and important announcements."
    },
    {
      icon: <Calendar className="w-16 h-16 text-purple-500" />,
      title: "Explore Events",
      description: "Discover college fairs, webinars, and educational events happening near you."
    },
    {
      icon: <Newspaper className="w-16 h-16 text-orange-500" />,
      title: "Read News",
      description: "Stay updated with the latest educational news and insights from The Courier-Journal of Education."
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onComplete}
            className="text-gray-500"
          >
            Skip
          </Button>
          <div className="text-sm text-gray-500">
            {currentSlide + 1} of {slides.length}
          </div>
        </div>

        <div className="mb-8">
          <div className="flex justify-center mb-4">
            {slides[currentSlide].icon}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {slides[currentSlide].title}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {slides[currentSlide].description}
          </p>
        </div>

        <div className="flex justify-center space-x-2 mb-6">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentSlide ? 'bg-green-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex items-center"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <Button
            onClick={nextSlide}
            className="flex items-center bg-green-600 hover:bg-green-700"
          >
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            {currentSlide < slides.length - 1 && <ChevronRight className="w-4 h-4 ml-1" />}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default OnboardingTutorial;
