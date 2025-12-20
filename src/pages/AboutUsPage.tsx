"use client";

import { useState } from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  ChevronDown,
  Facebook,
  Linkedin,
  Instagram,
  ChevronLeft,
  ChevronRight,
  Phone,
  Youtube,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { Footer } from "@/components";
import { footerData } from "@/data/constant";
import PeacockSection from "@/components/sections/PeacockSection";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import logoImage from "/lovable-uploads/f28c5d70-6a6a-45f1-b4ca-cb9652dec39b.webp";
import HeaderSearchBar from "@/components/common/HeaderSeachbar";

const teamMembers = [
  {
    name: "Rajahs Goyal",
    role: "CEO",
    image: "/team-1.webp",
  },
  {
    name: "Jane Doe",
    role: "CTO",
    image: "/team-2.webp",
  },
  {
    name: "John Smith",
    role: "Lead Designer",
    image: "/team-3.webp",
  },
  {
    name: "Emily White",
    role: "Project Manager",
    image: "/team-4.webp",
  },
  {
    name: "Michael Brown",
    role: "Lead Developer",
    image: "/team-5.webp",
  },
  {
    name: "Sarah Green",
    role: "Marketing Head",
    image: "/team-1.webp",
  },
];

const awards = [
  {
    image: "/award-1.webp",
    alt: "City for the Sustainable Transport Award",
    description: "City for the Sustainable Transport Award?",
  },
  {
    image: "/award-2.webp",
    alt: "Top 10 Agency Use Sustainable Material",
    description: "Top 10 Agency Use Sustainable Material",
  },
  {
    image: "/award-3.webp",
    alt: "The Sustainable Transport Award Committee",
    description: "The Sustainable Transport Award Committee?",
  },
  {
    image: "/award-4.webp",
    alt: "Global Award Site of year 2024",
    description: "Global Award Site of year 2024",
  },
  {
    image: "/award-5.webp",
    alt: "Women Professional in Logistics & Transport",
    description: "Women Professional in Logistics & Transport",
  },
];

const features = [
  {
    icon: "/friendly.svg",
    title: "Friendly Environment",
    description:
      "Dynamic workplace and friendly environment to help you unwind and work with a fresh and enthusiastic mind",
  },
  {
    icon: "/talent.svg",
    title: "Recognition of talent",
    description:
      "Your efforts are always recognized to encourage you to keep going. Our culture of collaboration will have you working in cross-functional teams an",
  },
  {
    icon: "/potential.svg",
    title: "Uplifting ones potential",
    description:
      "Dynamic workplace and friendly environment to help you unwind and work with a fresh and enthusiastic mind",
  },
  {
    icon: "/flexibility.svg",
    title: "Flexibility in working",
    description:
      "Dynamic workplace and friendly environment to help you unwind and work with a fresh and enthusiastic mind",
  },
];

const timelineData = [
    { year: "2016 Awards", desc: "New strategy Visualization", position: "top" },
    { year: "2018 Awards", desc: "Animation quality Mobile\nexcellence", position: "bottom" },
    { year: "2020 Awards", desc: "New strategy Visualisation", position: "top" },
    { year: "2021 Awards", desc: "New strategy Visualization", position: "bottom" },
    { year: "2022 Awards", desc: "New strategy Visualization", position: "top" },
    { year: "2024 Awards", desc: "New strategy Visualization", position: "bottom" },
];

export default function AboutUsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Saree", "Kurti", "Lehenga", "Dress Material"];

  return (
    <>
      <div className="">
        <HeaderSearchBar />
        <section className="py-8 md:py-16 bg-[#FAF6F2]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              <div>
                <button className="mb-6 border border-orange-500 text-orange-500 hover:bg-orange-50 rounded-full px-6 py-2 bg-transparent text-sm md:text-base">
                  About US
                </button>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                  ZARKHA
                </h1>
                <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                  Worem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                  vulputate libero et velit interdum, ac aliquet odio mattis.
                  Class aptent taciti sociosqu ad litora torquent per conubia
                  nostra, per inceptos himenaeos. Worem ipsum dolor sit amet,
                  consectetur adipiscing elit. Nunc vulputate libero et velit
                  interdum, ac aliquet odio mattis. Class aptent taciti sociosqu
                  ad litora torquent per conubia nostra, per inceptos himenaeos.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src="/hero-1.webp"
                  alt="Fashion designer working"
                  className="rounded-lg object-cover h-32 sm:h-40 md:h-48 w-full"
                />
                <img
                  src="/hero-2.webp"
                  alt="Traditional pink dress"
                  className="rounded-lg object-cover h-32 sm:h-40 md:h-48 w-full"
                />
                <img
                  src="/hero-3.webp"
                  alt="Fashion studio"
                  className="rounded-lg object-cover h-32 sm:h-40 md:h-48 w-full"
                />
                <img
                  src="/hero-1.webp"
                  alt="Traditional clothing"
                  className="rounded-lg object-cover h-32 sm:h-40 md:h-48 w-full"
                />
              </div>
            </div>
            <div className="bg-white mx-auto mt-8 md:mt-14 py-6 md:py-8 rounded-lg shadow px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
                Lorem Ipsum Is Simply Dummy Text Of The Printing And Typesetting
                Industry. Lorem Ipsum Has Been The Industry's
              </h2>
              <p className="text-gray-700 text-xs md:text-sm leading-relaxed">
                Contrary To Popular Belief, Lorem Ipsum Is Not Simply Random
                Text. It Has Roots In A Piece Of Classical Latin Literature From
                45 BC, Making It Over 2000 Years Old. Richard McClintock, A
                Latin Professor At Hampden-Sydney College In Virginia, Looked Up
                One Of The More Obscure Latin Words, Consectetur, From A Lorem
                Ipsum Passage, And Going Through The Cites Of The Word In
                Classical Literature, Discovered The Undoubtable Source. Lorem
                Ipsum Comes From Sections 1.10.32 And 1.10.33 Of "de Finibus
                Bonorum Et Malorum" (The Extremes Of Good And Evil) By Cicero,
                Written In 45 BC. This Book Is A Treatise On The Theory Of
                Ethics, Very Popular During The Renaissance. The First Line Of
                Lorem Ipsum, "Lorem Ipsum Dolor Sit Amet..", Comes From A Line
                In Section 1.10.32.
              </p>
              <br />
              <p className="text-gray-700 leading-relaxed text-xs md:text-sm">
                The Standard Chunk Of Lorem Ipsum Used Since The 1500s Is
                Reproduced Below For Those Interested. Sections 1.10.32 And
                1.10.33 From "de Finibus Bonorum Et Malorum" By Cicero Are Also
                Re...
              </p>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-16">
            <div className="container bg-white mx-auto px-4 sm:px-6 lg:px-8">
                <div className="hidden md:block py-20">
                    <div className="relative">
                        <div className="absolute left-0 top-1/2 w-full h-0.5 -translate-y-1/2 bg-gray-200"></div>
                        <div className="relative flex justify-between items-center w-full">
                        {timelineData.map((item, index) => (
                            <div key={index} className="relative w-1/6 flex justify-center">
                            {item.position === 'top' ? (
                                <div className="absolute bottom-full mb-6 text-center w-max -translate-x-1/2 left-1/2">
                                <h3 className="text-base font-bold text-gray-800">{item.year}</h3>
                                <p className="text-sm text-gray-500 whitespace-pre-line">{item.desc}</p>
                                </div>
                            ) : (
                                <div className="absolute top-full mt-6 text-center w-max -translate-x-1/2 left-1/2">
                                <h3 className="text-base font-bold text-gray-800">{item.year}</h3>
                                <p className="text-sm text-gray-500 whitespace-pre-line">{item.desc}</p>
                                </div>
                            )}
                            <div className="relative z-10 p-1.5 bg-white rounded-full shadow-md">
                                <div className="w-4 h-4 bg-[#FF8A18] rounded-full"></div>
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>

                <div className="md:hidden py-10">
                    <div className="relative pl-7">
                        <div className="absolute left-3 top-0 w-0.5 h-full bg-gray-200"></div>
                        <div className="space-y-8">
                        {timelineData.map((item, index) => (
                            <div key={index} className="relative flex items-center min-h-[60px]">
                                <div className="absolute -left-[28px] top-1/2 -translate-y-1/2 z-10 p-1.5 bg-white rounded-full shadow-md">
                                    <div className="w-4 h-4 bg-[#FF8A18] rounded-full"></div>
                                </div>
                                <div className="pl-4">
                                    <h3 className="text-sm sm:text-base font-bold text-gray-800">{item.year}</h3>
                                    <p className="text-xs sm:text-sm text-gray-500 mt-1 whitespace-pre-line">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section className="py-8 md:py-16 bg-[#FAF6F2]">
          <div className="mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full md:w-4/5 lg:w-3/5 mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="relative overflow-hidden rounded-xl h-80 md:h-96 lg:h-auto">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url(/mission-1.webp)",
                  }}
                ></div>
                <div className="relative z-10 p-4 sm:p-6 md:p-8 bg-black bg-opacity-60 w-[95%] sm:w-[90%] md:w-[80%] mx-auto h-full flex flex-col justify-center">
                  <div className="bg-orange-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-md inline-block mb-4 md:mb-6 w-fit font-semibold text-xs sm:text-sm">
                    Our Vision & Core Values
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed text-white">
                    Lorem Ipsum Is Simply Dummy Text Of The Printing And
                    Typesetting Industry. Lorem Ipsum Has Been The Industry's
                    Standard Dummy Text Ever Since The 1500s, When An Unknown
                    Printer Took A Galley Of Type And Scrambled It To Make A
                    Type Specimen Book. It Has Survived Not Only Five Centuries,
                    But Also The Leap Into Electronic Typesetting, Re
                  </p>
                </div>
              </div>

              <div className="relative overflow-hidden h-80 md:h-96 lg:h-auto rounded-xl">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: "url(/mission-2.webp)",
                  }}
                ></div>
                <div className="relative z-10 p-4 sm:p-6 md:p-8 text-white bg-black bg-opacity-60 w-[95%] sm:w-[90%] md:w-[80%] mx-auto h-full flex flex-col justify-center">
                  <div className="bg-orange-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-md inline-block mb-4 md:mb-6 w-fit font-semibold text-xs sm:text-sm">
                    Our Mission & Goal
                  </div>
                  <p className="text-xs sm:text-sm leading-relaxed">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard dummy text ever since the 1500s, when an unknown
                    printer took a galley of type and scrambled it to make a
                    type specimen book. It has survived not only five centuries,
                    but also the leap into electronic typesetting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-8 md:py-16 lg:py-24 relative z-10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-14">
              Life At Zarkha
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
              <div className="flex flex-col gap-4 md:gap-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-4 md:p-6 flex items-center gap-4 md:gap-6 shadow-[0_4px_24px_rgba(255,138,24,0.1)]"
                  >
                    <div className="flex-grow">
                      <h3 className="font-bold text-base md:text-lg text-gray-800">
                        {feature.title}
                      </h3>
                      <p className="text-gray-500 text-xs md:text-sm mt-1 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    <div className="flex-shrink-0 bg-[#FF8A18] rounded-xl p-2.5 md:p-3 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center">
                      <img
                        src={feature.icon}
                        alt={`${feature.title} icon`}
                        className="w-6 h-6 md:w-7 md:h-7"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden lg:grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-2 gap-4 h-[350px] sm:h-[400px] lg:h-[480px]">
                <div className="sm:row-span-2">
                  <img
                    src="/life-at-1.webp"
                    alt="Large team meeting"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div>
                  <img
                    src="/life-at-2.webp"
                    alt="Woman working on a computer"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
                <div>
                  <img
                    src="/life-at-3.webp"
                    alt="Small group discussion"
                    className="w-full h-full object-cover rounded-2xl"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-8 md:py-16 lg:py-24 bg-[#FAF6F2] overflow-hidden">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-800 mb-8 md:mb-14">
              Our Team
            </h2>

            <div className="relative">
              <Swiper
                modules={[Navigation]}
                navigation={{
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
                }}
                loop={true}
                spaceBetween={20}
                slidesPerView={1.2}
                centeredSlides={true}
                breakpoints={{
                  480: {
                    slidesPerView: 1.5,
                    spaceBetween: 25,
                  },
                  640: {
                    slidesPerView: 2.2,
                    centeredSlides: false,
                    spaceBetween: 25,
                  },
                  768: {
                    slidesPerView: 2.5,
                    centeredSlides: false,
                    spaceBetween: 30,
                  },
                  1024: {
                    slidesPerView: 3.2,
                    centeredSlides: false,
                    spaceBetween: 30,
                  },
                  1280: {
                    slidesPerView: 4.2,
                    centeredSlides: false,
                    spaceBetween: 30,
                  },
                }}
                className="!px-4 !pb-20 md:!pb-24 relative z-10"
              >
                {teamMembers.map((member) => (
                  <SwiperSlide key={member.name}>
                    <div className="relative pt-4">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-64 sm:h-72 md:h-80 object-cover rounded-2xl shadow-lg"
                      />
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] bg-white rounded-xl shadow-md p-3 md:p-4 text-center">
                        <h3 className="font-bold text-sm md:text-base text-gray-900">
                          {member.name}
                        </h3>
                        <p className="text-xs md:text-sm text-gray-500">{member.role}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              <div
                className="absolute bottom-[-15px] md:bottom-[-20px] left-1/2 -translate-x-1/2 w-[95%] sm:w-[90%] md:w-[80%] lg:w-[80%] h-48 sm:h-56 md:h-64 bg-[#FF8A18] rounded-2xl z-0"
                style={{
                  backgroundImage: "url('/Isolation_Mode.webp')",
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              ></div>

              <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex justify-center items-center gap-3 md:gap-4 z-20">
                <button className="swiper-button-prev-custom bg-white w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center shadow-md transition-transform hover:scale-110">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 md:w-5 md:h-5 text-gray-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                <button className="swiper-button-next-custom bg-white w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center shadow-md transition-transform hover:scale-110">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4 md:w-5 md:h-5 text-gray-700"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-8 md:py-16 lg:py-24 relative z-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 md:mb-14">
              Award & Achievement
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8 place-items-center">
              {awards.map((award, index) => (
                <div
                  key={index}
                  className="w-full flex flex-col items-center text-center"
                >
                  <img
                    src={award.image}
                    alt={award.alt}
                    className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 mb-4 md:mb-6 object-contain"
                  />
                  <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed">
                    {award.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <div className="pt-8 md:pt-12 mb-6 md:mb-8">
              <h2 className="text-xl md:text-2xl font-bold text-warm-brown mb-4 md:mb-6">
                Categories
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {Object.entries(footerData.categories).map(
                  ([category, items]) => (
                    <div key={category} className="space-y-2">
                      <h3 className="font-semibold text-sm md:text-base text-warm-brown">
                        {category}
                      </h3>
                      {items.map((item) => (
                        <p
                          key={item}
                          className="text-muted-foreground hover:text-brand-orange cursor-pointer text-xs md:text-sm"
                        >
                          {item}
                        </p>
                      ))}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="border-t pt-4 md:pt-6 pb-4 md:pb-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <div className="border-b md:border-b-0 border-r border-gray-200 pr-4 md:pr-6 pb-4 md:pb-0">
                  <h3 className="font-semibold text-sm md:text-base text-gray-800 mb-2 md:mb-3">Company</h3>
                  <div className="space-y-1 md:space-y-2">
                    <p className="text-xs md:text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                      Seller
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                      About
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                      Contact Us
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                      FAQs
                    </p>
                  </div>
                </div>

                <div className="border-b md:border-b-0 md:border-r border-gray-200 pr-4 md:pr-6 pb-4 md:pb-0">
                  <h3 className="font-semibold text-sm md:text-base text-gray-800 mb-2 md:mb-3">
                    For Consumers
                  </h3>
                  <div className="space-y-1 md:space-y-2">
                    <p className="text-xs md:text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                      Privacy
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                      Terms
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                      Security
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                      Mobile App
                    </p>
                  </div>
                </div>

                <div className="border-r md:border-r border-gray-200 pr-4 md:pr-6">
                  <h3 className="font-semibold text-sm md:text-base text-gray-800 mb-2 md:mb-3">
                    Follow Us
                  </h3>
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                      <Facebook className="h-3 w-3 md:h-4 md:w-4" />
                      <span>Facebook</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                      <Instagram className="h-3 w-3 md:h-4 md:w-4" />
                      <span>Instagram</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                      <Phone className="h-3 w-3 md:h-4 md:w-4" />
                      <span>WhatsApp</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 hover:text-gray-800 cursor-pointer">
                      <Youtube className="h-3 w-3 md:h-4 md:w-4" />
                      <span>Youtube</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm md:text-base text-gray-800 mb-2 md:mb-3">
                    Download App
                  </h3>
                  <div className="space-y-1 md:space-y-2">
                    <div className="w-24 md:w-28 h-7 md:h-8 bg-black rounded flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
                      <div className="text-white text-xs">
                        <div className="text-[6px] md:text-[7px] opacity-80">
                          Available on the
                        </div>
                        <div className="font-semibold text-[8px] md:text-[9px]">
                          App Store
                        </div>
                      </div>
                    </div>
                    <div className="w-24 md:w-28 h-7 md:h-8 bg-black rounded flex items-center justify-center cursor-pointer hover:bg-gray-800 transition-colors">
                      <div className="text-white text-xs">
                        <div className="text-[6px] md:text-[7px] opacity-80">Get it on</div>
                        <div className="font-semibold text-[8px] md:text-[9px]">
                          Google Play
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
      <PeacockSection />
    </>
  );
}