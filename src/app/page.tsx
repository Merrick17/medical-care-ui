"use client";
import Image from "next/image";
import { Phone, Clock, MapPin, ArrowRight, Calendar, User, Activity, Award, Users, Ambulance, UserCheck, Syringe, Star } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { DoctorPublicProfileDialog } from "@/components/doctors/doctor-public-profile-dialog";
import FloatingChatbot from "@/components/chat/floating-chatbot";


const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const slideInFromLeft = {
  initial: { x: -100, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
};

const slideInFromRight = {
  initial: { x: 100, opacity: 0 },
  animate: { x: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
};

const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.5 } }
};

const cardHover = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.02,
    transition: { duration: 0.2, ease: "easeInOut" }
  }
};

export default function Home() {
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewProfile = (doctor: any) => {
    setSelectedDoctor({
      ...doctor,
      email: "dr." + doctor.name.toLowerCase().split(' ')[1] + "@meditro.com",
      phone: "(+01) 999 888 777",
      location: "123 Medical Center, Healthcare Avenue",
      about: `${doctor.name} is a board-certified ${doctor.specialization.toLowerCase()} with ${doctor.experience} of experience. They specialize in providing comprehensive care using the latest medical technologies and evidence-based practices.`,
      education: [
        `MD in ${doctor.specialization}, Harvard Medical School`,
        "Residency at Mayo Clinic",
        `Fellowship in Advanced ${doctor.specialization}`
      ]
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">+</span>
            </div>
            <span className="text-2xl font-bold">MediTro</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#home" className="hover:text-primary transition-colors">Home</a>
            <a href="#about" className="hover:text-primary transition-colors">About</a>
            <a href="#doctors" className="hover:text-primary transition-colors">Doctors</a>
            <a href="#services" className="hover:text-primary transition-colors">Services</a>
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Phone className="text-primary" />
              <span className="hidden sm:inline">(+01) 999 888 777</span>
            </div>
            <Link href="/auth/login">
              <button className="bg-primary text-white px-6 py-2 rounded-full hover:bg-primary/90 transition-colors">
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative bg-[#F9FBFD] overflow-hidden pt-20">
        {/* Decorative elements */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute top-20 left-20 w-24 h-24 border-2 border-primary/20 rounded-full" />
          <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-secondary/10 rounded" 
            style={{ transform: 'rotate(45deg)' }} />
          <div className="absolute top-40 right-1/3 w-12 h-12 border-2 border-secondary/20" 
            style={{ transform: 'rotate(30deg)' }} />
          <motion.div 
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-32 right-1/4 w-20 h-20"
          >
            <div className="w-full h-full border-2 border-primary/20 transform rotate-45" />
          </motion.div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              variants={slideInFromLeft}
              initial="initial"
              animate="animate"
              className="relative z-10"
            >
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8"
              >
                <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
                  We Provide All Health Care Solution
                </span>
                <h1 className="text-4xl md:text-6xl font-bold text-[#1B2B6B] leading-tight">
                  Protect Your Health<br />
                  And Take Care To<br />
                  Of Your Health
                </h1>
                <p className="text-gray-600 mt-6 text-lg">
                  Experience world-class healthcare services with our team of dedicated medical professionals.
                </p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-secondary hover:bg-secondary/90 text-white px-8 py-4 rounded-lg flex items-center gap-2 font-semibold transition-colors"
                >
                  Read More <ArrowRight size={20} />
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div
              variants={slideInFromRight}
              initial="initial"
              animate="animate"
              className="relative"
            >
              {/* Background shape */}
              <div className="absolute top-0 right-0 w-[120%] h-[120%] bg-primary/10 rounded-[40px] transform rotate-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
              </div>
              
              {/* Doctor image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="relative z-10"
              >
                <Image
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2800"
                  alt="Professional Doctor"
                  width={600}
                  height={700}
                  className="relative z-10 rounded-[30px] object-cover"
                  priority
                  unoptimized
                />
              </motion.div>

              {/* Floating stats cards */}
              <motion.div
                animate={{ 
                  y: [-10, 10, -10],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-20 right-20 bg-white p-4 rounded-xl shadow-lg z-20 floating-card"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="text-primary" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Experience</p>
                    <p className="text-primary font-bold">15+ Years</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ 
                  y: [10, -10, 10],
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute bottom-20 left-20 bg-white p-4 rounded-xl shadow-lg z-20 floating-card"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center">
                    <Users className="text-secondary" size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">Happy Patients</p>
                    <p className="text-secondary font-bold">1500+</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-20 overflow-hidden">
        {/* Background Shapes */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute top-10 left-10 w-16 h-16 border-2 border-primary/20" 
            style={{ transform: 'rotate(45deg)' }} />
          <div className="absolute bottom-20 right-20 w-20 h-20 border-2 border-secondary/20 rounded-full" />
          <div className="absolute top-1/2 right-10 w-24 h-24">
            <motion.div
              animate={{ 
                rotate: [0, 360],
              }}
              transition={{ 
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-full h-full border-2 border-primary/10"
              style={{ transform: 'rotate(45deg)' }}
            />
          </div>
          <motion.div
            animate={{ 
              y: [-10, 10, -10],
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/3 left-1/4"
          >
            <div className="w-12 h-12 bg-secondary/5 rounded-lg" 
              style={{ transform: 'rotate(30deg)' }} />
          </motion.div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Image Grid */}
            <motion.div
              variants={slideInFromLeft}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="space-y-4">
                <div className="relative h-48 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=2000"
                    alt="Medical Team"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1584515933487-779824d29309?q=80&w=2000"
                    alt="Doctor with Patient"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
              <div className="space-y-4 mt-8">
                <div className="relative h-64 rounded-2xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2000"
                    alt="Medical Consultation"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="relative flex items-center justify-center h-48 rounded-2xl bg-primary/10 p-6">
                  <div className="text-center">
                    <h3 className="text-4xl font-bold text-primary mb-2">20+</h3>
                    <p className="text-gray-600">Years Experience</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              variants={slideInFromRight}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              className="relative z-10"
            >
              <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4">
                About Us
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-[#1B2B6B] mb-6">
                The Great Place Of<br />
                Medical Hospital Center
              </h2>
              <p className="text-gray-600 mb-8">
                We provide the special tips and advice's of heath care treatment and high level 
                of best technology involve in the our hospital.
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8">
                {[
                  {
                    icon: <Ambulance className="text-primary" size={24} />,
                    title: "Emergency Help",
                    bg: "bg-blue-50"
                  },
                  {
                    icon: <UserCheck className="text-primary" size={24} />,
                    title: "Qualified Doctors",
                    bg: "bg-green-50"
                  },
                  {
                    icon: <Award className="text-primary" size={24} />,
                    title: "Best Professionals",
                    bg: "bg-red-50"
                  },
                  {
                    icon: <Syringe className="text-primary" size={24} />,
                    title: "Medical Treatment",
                    bg: "bg-purple-50"
                  }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    className={`${item.bg} p-4 rounded-xl flex items-center gap-3`}
                  >
                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                      {item.icon}
                    </div>
                    <p className="font-semibold">{item.title}</p>
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white px-8 py-4 rounded-lg flex items-center gap-2"
              >
                Read More <ArrowRight size={20} />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white/95 -z-10" />
        <motion.div 
          className="max-w-7xl mx-auto px-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.div 
            className="text-center mb-16"
            variants={scaleIn}
          >
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold mb-4">
              Our Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1B2B6B] mb-6">
              Why Choose <span className="text-primary">MediTro</span>?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Experience healthcare excellence with our comprehensive services and dedicated team
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Clock className="text-primary" />,
                title: "24/7 Support",
                description: "Round-the-clock medical assistance for your peace of mind",
                image: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2800"
              },
              {
                icon: <Award className="text-primary" />,
                title: "Expert Doctors",
                description: "Highly qualified medical professionals at your service",
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2800"
              },
              {
                icon: <Activity className="text-primary" />,
                title: "Modern Equipment",
                description: "State-of-the-art facilities for better treatment",
                image: "https://images.unsplash.com/photo-1583324113626-70df0f4deaab?q=80&w=2800"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="relative h-48 mb-6 rounded-lg overflow-hidden">
                  <Image unoptimized
                    src={feature.image}
                    alt={feature.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Meet Our Doctors Section */}
      <section id="doctors" className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        <motion.div 
          className="max-w-7xl mx-auto px-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <motion.span 
              className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-semibold mb-4"
              variants={fadeIn}
            >
              Our Medical Experts
            </motion.span>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-[#1B2B6B] mb-6"
              variants={fadeIn}
            >
              Meet Our Experienced Doctors
            </motion.h2>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto"
              variants={fadeIn}
            >
              Our team of highly qualified medical professionals is here to provide you with the best healthcare services
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Johnson",
                specialization: "Cardiologist",
                image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2800",
                rating: 4.9,
                experience: "15+ years",
                availability: "Mon - Fri"
              },
              {
                name: "Dr. Michael Chen",
                specialization: "Neurologist",
                image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2800",
                rating: 4.8,
                experience: "12+ years",
                availability: "Tue - Sat"
              },
              {
                name: "Dr. Emily Williams",
                specialization: "Pediatrician",
                image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=2800",
                rating: 4.9,
                experience: "10+ years",
                availability: "Mon - Thu"
              }
            ].map((doctor, index) => (
              <motion.div
                key={index}
                variants={cardHover}
                initial="rest"
                whileHover="hover"
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-64 mb-6 rounded-xl overflow-hidden">
                  <Image
                    src={doctor.image}
                    alt={doctor.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1">{doctor.name}</h3>
                    <p className="text-white/90">{doctor.specialization}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <span className="font-semibold">{doctor.rating}</span>
                    </div>
                    <span className="text-gray-600">{doctor.experience}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-gray-600">Available: {doctor.availability}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-semibold py-3 rounded-lg transition-colors"
                    onClick={() => handleViewProfile(doctor)}
                  >
                    View Profile & Schedule
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            className="text-center mt-12"
            variants={fadeIn}
          >
            <Link href="/doctors">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-white px-8 py-4 rounded-lg inline-flex items-center gap-2 hover:bg-primary/90 transition-colors"
              >
                View All Doctors <ArrowRight size={20} />
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Services Section - Now with image cards */}
      <section id="services" className="py-20 bg-gradient-to-b from-white to-gray-50">
        <motion.div 
          className="max-w-7xl mx-auto px-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <motion.span 
              className="inline-block px-4 py-2 bg-secondary/10 text-secondary rounded-full text-sm font-semibold mb-4"
              variants={fadeIn}
            >
              Our Services
            </motion.span>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-[#1B2B6B] mb-6"
              variants={fadeIn}
            >
              We Cover A Big Variety Of<br />Medical Services
            </motion.h2>
            <motion.p 
              className="text-gray-600 max-w-2xl mx-auto"
              variants={fadeIn}
            >
              We provide specialized healthcare solutions with expert care and advanced technology.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🩺",
                title: "Diagnostics",
                description: "Comprehensive medical diagnostics with state-of-the-art equipment",
                iconBg: "bg-blue-50",
                image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2800"
              },
              {
                icon: "💊",
                title: "Treatment",
                description: "Personalized treatment plans for optimal health outcomes",
                iconBg: "bg-orange-50",
                image: "https://images.unsplash.com/photo-1631815587646-b85a1bb027e1?q=80&w=2800"
              },
              {
                icon: "🏥",
                title: "Surgery",
                description: "Advanced surgical procedures with expert medical teams",
                iconBg: "bg-purple-50",
                image: "https://images.unsplash.com/photo-1571772996211-2f02c9727629?q=80&w=2800"
              }
            ].map((service, index) => (
              <motion.div
                key={index}
                variants={cardHover}
                initial="rest"
                whileHover="hover"
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48 mb-6 rounded-xl overflow-hidden">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
                <div className={`w-16 h-16 ${service.iconBg} rounded-2xl flex items-center justify-center mb-4 text-2xl transform group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-[#1B2B6B] mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6">{service.description}</p>
                <motion.button
                  whileHover={{ x: 5 }}
                  className="text-primary font-semibold flex items-center gap-2 group"
                >
                  Learn More 
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Section with animated counters */}
      <motion.section 
        className="bg-primary text-white py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <Users size={40} className="mx-auto mb-4" />
              <h4 className="text-4xl font-bold mb-2">1500+</h4>
              <p>Happy Patients</p>
            </div>
            <div>
              <User size={40} className="mx-auto mb-4" />
              <h4 className="text-4xl font-bold mb-2">100+</h4>
              <p>Expert Doctors</p>
            </div>
            <div>
              <Award size={40} className="mx-auto mb-4" />
              <h4 className="text-4xl font-bold mb-2">15+</h4>
              <p>Years Experience</p>
            </div>
            <div>
              <MapPin size={40} className="mx-auto mb-4" />
              <h4 className="text-4xl font-bold mb-2">50+</h4>
              <p>Clinic Locations</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Contact Section with enhanced form */}
      <section id="contact" className="py-20 bg-gray-50">
        <motion.div 
          className="max-w-7xl mx-auto px-6"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-[#1B2B6B] mb-6">Book an Appointment</h2>
              <p className="text-gray-600 mb-8">Schedule your visit with our expert medical professionals</p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Phone className="text-primary" />
                  <div>
                    <h4 className="font-semibold">Emergency Call</h4>
                    <p>(+01) 999 888 777</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Clock className="text-primary" />
                  <div>
                    <h4 className="font-semibold">Working Hours</h4>
                    <p>Mon - Fri: 9:00 - 18:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <MapPin className="text-primary" />
                  <div>
                    <h4 className="font-semibold">Location</h4>
                    <p>123 Medical Street, City, Country</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <form className="space-y-4">
                <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-lg" />
                <input type="email" placeholder="Email Address" className="w-full p-3 border rounded-lg" />
                <input type="tel" placeholder="Phone Number" className="w-full p-3 border rounded-lg" />
                <textarea placeholder="Message" rows={4} className="w-full p-3 border rounded-lg"></textarea>
                <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors">
                  Book Appointment
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1B2B6B] text-white py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-primary text-xl font-bold">+</span>
                </div>
                <span className="text-2xl font-bold">MediTro</span>
              </div>
              <p className="text-gray-300">Providing quality healthcare services for a better and healthier life.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Services</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Doctors</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Our Services</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Dental Care</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Cardiology</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Neurology</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Orthopedics</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Opening Hours</h4>
              <ul className="space-y-2">
                <li className="text-gray-300">Mon - Fri: 9:00 - 18:00</li>
                <li className="text-gray-300">Saturday: 9:00 - 16:00</li>
                <li className="text-gray-300">Sunday: Closed</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-300">
            <p>&copy; 2024 MediTro. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <DoctorPublicProfileDialog
        doctor={selectedDoctor}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

      <FloatingChatbot />
    </div>
  );
}
