"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Users, Zap, Globe } from "lucide-react";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

const LandingPage: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [cardPosition, setCardPosition] = useState({ x: 0, rotate: 0 });
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(
    null
  );
  const cardRef = useRef<HTMLDivElement>(null);

  const fireConfetti = () => {
    const count = 200;
    const defaults = {
      origin: { y: 0.7 },
    };

    function fire(particleRatio, opts) {
      confetti(
        Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio),
        })
      );
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    fire(0.2, {
      spread: 60,
    });

    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  const handleSwipe = (direction: "left" | "right") => {
    const swipeDistance = direction === "left" ? -500 : 500;
    setSwipeDirection(direction);

    setCardPosition({
      x: swipeDistance,
      rotate: direction === "left" ? -15 : 15,
    });

    // Fire confetti if swiped right
    if (direction === "right") {
      fireConfetti();
    }

    // Reset card position after animation
    setTimeout(() => {
      setCardPosition({ x: 0, rotate: 0 });
      setSwipeDirection(null);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16 lg:pb-24">
          <div className="grid lg:grid-cols-2 items-center md:gap-12 gap-16">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span className="block">Ideas don&apos;t build</span>
                <span className="block text-indigo-600">
                  Startups. People Do.
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl md:text-xl">
                Swipe through ideas, find like-minded builders, and co-found
                your next startup.
              </p>

              {/* CTA Buttons */}
              <div className="mt-8 flex justify-center lg:justify-start space-x-4">
                <Link
                  href="/find-co-founder"
                  className="flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Share Ideas
                  <ArrowRight className="ml-2 h-5 w-5 md:block hidden" />
                </Link>
                <Link
                  href="/explore-ideas"
                  className="flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  Explore Ideas
                </Link>
              </div>
            </div>

            {/* Right Visual - Swipe UI Mockup */}
            <div className="block relative rotate-3">
              <div
                ref={cardRef}
                className="relative group md:max-w-[500px]"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {/* Always show Click to Swipe message when hovering */}
                

                <motion.div
                  onClick={() => handleSwipe("right")}
                  className="bg-white shadow-xl rounded-xl overflow-hidden"
                  animate={{
                    x: cardPosition.x,
                    rotate: cardPosition.rotate,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-md z-10 text-sm"
                >
                  Click to Swipe
                  <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 rotate-45 bg-black w-3 h-3"></div>
                </motion.div>
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <Image
                        src="https://avatars.mds.yandex.net/i?id=940e873ff86c086bc9c1156f1175c8848c21025d-5859250-images-thumbs&n=13"
                        alt="Startup Idea"
                        className="md:rounded-full rounded-3xl mr-4 md:h-[70px] md:w-[120px] h-[60px] w-[100px]"
                        width={100}
                        height={100}
                      />
                      <div>
                        <h3 className="md:text-lg text-base font-semibold">
                          AI-Powered Recruitment Platform
                        </h3>
                        <p className="text-sm text-gray-500">Tech Startup</p>
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4 md:text-base text-sm">
                      Building an AI system that matches candidates with
                      companies using deep learning and soft skill analysis.
                    </p>
                    <div className="flex gap-8 w-full justify-between">
                      <div
                        className="flex items-center"
                        onClick={() => handleSwipe("left")}
                      >
                        <Image
                          src="./swipe-left.svg"
                          className="text-blue-500 md:h-[70px] md:w-[70px] h-[40px] w-[40px] cursor-pointer transform scale-y-[-1] scale-x-[-1] animate-swipe-left"
                          alt="Swipe Left"
                          height={70}
                          width={70}
                        />
                      </div>
                      <div className="flex items-center">
                        <Image
                          src="./swipe-right.svg"
                          className="text-blue-500 md:h-[70px] md:w-[70px] h-[40px] w-[40px] cursor-pointer transform scale-y-[-1] animate-swipe-right"
                          alt="Swipe Right"
                          height={70}
                          width={70}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* How It Works */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Turn Ideas into Ventures
            </h2>
            <p className="mt-4 text-xl text-gray-500">
              Alone, an idea is just a thought. With the right co-founder,
              it&apos;s a company.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full">
                  <Zap className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">
                Swipe Through Ideas
              </h3>
              <p className="text-gray-600">
                Discover startup ideas and potential co-founders in a dynamic,
                engaging interface.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full">
                  <Users className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Match & Chat</h3>
              <p className="text-gray-600">
                Connect instantly when both sides show mutual interest in an
                idea.
              </p>
            </div>

            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-indigo-100 text-indigo-600 p-4 rounded-full">
                  <Globe className="h-8 w-8" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Build Together</h3>
              <p className="text-gray-600">
                Transform your shared vision into a real startup with the right
                partner.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Ready to Find Your Co-Founder?
          </h2>
          <p className="mt-4 text-lg text-indigo-200">
            Join the community and start building your startup today.
          </p>
          <div className="mt-8 flex justify-center space-x-4">
            <Link
              href="/signup"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
            >
              Join Co-Found
            </Link>
          </div>
        </div>
      </div>

      {/* <Footer /> */}
    </div>
  );
};

export default LandingPage;
