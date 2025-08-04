"use client"
import Image from "next/image";
import { Navbar } from "@/components/navbar";
import { AuthModal } from "@/components/auth-modal";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  Car, 
  MapPin, 
  Clock, 
  Shield, 
  Star, 
  Users, 
  Phone, 
  Mail,
  ArrowRight,
  CheckCircle,
  Truck,
  Calendar,
  CreditCard,
  Menu,
  X
} from "lucide-react";

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const features = [
    {
      icon: <Car className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Premium Vehicles",
      description: "Luxury vans with modern amenities for your comfort"
    },
    {
      icon: <MapPin className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Wide Coverage",
      description: "Service available across major cities and destinations"
    },
    {
      icon: <Clock className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "24/7 Support",
      description: "Round-the-clock customer service and booking support"
    },
    {
      icon: <Shield className="h-6 w-6 sm:h-8 sm:w-8" />,
      title: "Safe Travel",
      description: "Licensed drivers and fully insured vehicles"
    }
  ];

  const services = [
    {
      title: "Airport Transfer",
      description: "Reliable airport pickup and drop-off services",
      price: "From $50",
      icon: <Truck className="h-5 w-5 sm:h-6 sm:w-6" />
    },
    {
      title: "City Tours",
      description: "Explore the city with our guided tour packages",
      price: "From $80",
      icon: <MapPin className="h-5 w-5 sm:h-6 sm:w-6" />
    },
    {
      title: "Corporate Events",
      description: "Professional transportation for business events",
      price: "From $120",
      icon: <Users className="h-5 w-5 sm:h-6 sm:w-6" />
    },
    {
      title: "Wedding Services",
      description: "Elegant transportation for your special day",
      price: "From $150",
      icon: <Star className="h-5 w-5 sm:h-6 sm:w-6" />
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Traveler",
      content: "KnoVan made my business trips so much more comfortable. Professional service every time!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Tourist",
      content: "Amazing experience! The driver was punctual and the van was spotless. Highly recommend!",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Event Planner",
      content: "Perfect for our corporate events. Reliable, clean, and professional service.",
      rating: 5
    }
  ];

  return (
    <>
      <AuthModal
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
      />
      <div className="min-h-screen bg-background">
        <Navbar onLoginClick={() => setIsAuthModalOpen(true)} />
        
        {/* Hero Section - Mobile First */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
          <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
            <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-12 lg:items-center">
              {/* Content */}
              <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
                <div className="space-y-4">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
                    Premium Van
                    <span className="text-blue-600 dark:text-blue-400 block sm:inline"> Service</span>
                  </h1>
                  <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-lg">
                    Experience luxury transportation with our premium van service. 
                    Comfort, reliability, and style for every journey.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Button 
                    size="lg" 
                    className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto"
                    onClick={() => window.location.href = '/booking'}
                  >
                    Book Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-gray-300 dark:border-gray-600 w-full sm:w-auto"
                  >
                    View Services
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 pt-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">Licensed Drivers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">24/7 Support</span>
                  </div>
                </div>
              </div>
              
              {/* Image */}
              <div className="relative order-1 lg:order-2 mb-8 lg:mb-0">
                <div className="relative z-10">
                  <Image
                    src="/images/benz/1.jpg"
                    alt="Luxury van"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-2xl w-full h-auto"
                    priority
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-48 h-48 sm:w-72 sm:h-72 bg-blue-200 dark:bg-blue-900 rounded-full opacity-20 blur-3xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Mobile First */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose KnoVan?
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                We provide exceptional van services with a focus on comfort, safety, and reliability
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center p-6 rounded-lg bg-gray-50 dark:bg-gray-800 hover:shadow-lg transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
                    <div className="text-blue-600 dark:text-blue-400">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section - Mobile First */}
        {/* <section className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Our Services
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Comprehensive van services tailored to your needs
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service, index) => (
                <div key={index} className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <div className="text-blue-600 dark:text-blue-400">
                        {service.icon}
                      </div>
                    </div>
                    <span className="text-base sm:text-lg font-semibold text-blue-600 dark:text-blue-400">
                      {service.price}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {service.title}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4">
                    {service.description}
                  </p>
                  <Button variant="outline" size="sm" className="w-full">
                    Learn More
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Testimonials Section - Mobile First */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                What Our Customers Say
              </h2>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Don&apos;t just take our word for it - hear from our satisfied customers
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 italic">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                      {testimonial.name}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section - Mobile First */}
        <section className="py-12 sm:py-16 lg:py-20 bg-blue-600 dark:bg-blue-700">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Experience Premium Van Service?
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Book your ride today and enjoy the comfort and luxury you deserve
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-blue-600 hover:bg-gray-100 w-full sm:w-auto"
                onClick={() => window.location.href = '/booking'}
              >
                Book Your Ride
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 w-full sm:w-auto"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </section>

        {/* Footer - Mobile First */}
        <footer className="bg-gray-900 text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg sm:text-xl font-bold">KnoVan</h3>
                <p className="text-sm sm:text-base text-gray-400">
                  Premium van service for all your transportation needs
                </p>
                <div className="flex space-x-4">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-sm sm:text-base">Services</h4>
                <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                  <li>Airport Transfer</li>
                  <li>City Tours</li>
                  <li>Corporate Events</li>
                  <li>Wedding Services</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-sm sm:text-base">Company</h4>
                <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                  <li>About Us</li>
                  <li>Our Fleet</li>
                  <li>Safety</li>
                  <li>Careers</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4 text-sm sm:text-base">Support</h4>
                <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                  <li>Help Center</li>
                  <li>Contact Us</li>
                  <li>Terms of Service</li>
                  <li>Privacy Policy</li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p className="text-sm sm:text-base">&copy; 2024 KnoVan. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
