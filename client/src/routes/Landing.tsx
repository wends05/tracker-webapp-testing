import sampleDesign from "../assets/landing-mockupp.png";
import categoryLanding from "../assets/Category-landing.jpg";
import feature1 from "../assets/feature-1.png";
import feature2 from "../assets/feature-2.png";
import feature3 from "../assets/feature-3.png";
import logo from "../assets/sample_logo.png";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const nav = useNavigate();

  const handleToAuth = () => {
    nav("/auth");
  };

  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);
  const section4Ref = useRef(null);
  const section5Ref = useRef(null);

  const isSection1InView = useInView(section1Ref);
  const isSection2InView = useInView(section2Ref);
  const isSection3InView = useInView(section3Ref);
  const isSection4InView = useInView(section4Ref);
  const isSection5InView = useInView(section5Ref);

  return (
    <div className="overflow-x-hidden">
      <header className="fixed left-0 top-0 z-50 w-full bg-white/30 shadow-md backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="WaEase Logo" className="h-10 w-14" />
            <h1 className="text-darkCopper text-2xl font-bold">WaEase</h1>
          </div>
          <nav>
            <ul className="flex items-center space-x-6">
              <li className="flex items-center">
                <a href="#section1" className="hover:text-tan">
                  Home
                </a>
              </li>
              <li className="flex items-center">
                <a href="#section2" className="hover:text-tan">
                  Mission
                </a>
              </li>
              <li className="flex items-center">
                <a href="#section3" className="hover:text-tan">
                  Features
                </a>
              </li>
              <li>
                <Button
                  onClick={handleToAuth}
                  className="bg-vanilla text-darkCopper hover:text-vanilla hover:bg-darkCopper px-5 py-2"
                >
                  Get Started
                </Button>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Section 1 */}
      <section
        id="section1"
        className="relative mt-24 min-h-screen"
        ref={section1Ref}
      >
        <div className="h-full w-full">
          <div className="ml-20 mt-12 flex h-full flex-col">
            <motion.div
              initial={{ opacity: 0, x: -100, filter: "blur(5px)" }}
              animate={
                isSection1InView
                  ? { opacity: 1, x: 0, filter: "blur(0)" }
                  : { opacity: 0, x: -100, filter: "blur(5px)" }
              }
              transition={{ duration: 1 }}
            >
              <p
                className="bg-gradient-to-r from-[#4c9182] to-[#efd293] bg-clip-text text-8xl font-semibold text-transparent"
                data-testid="landing-title"
              >
                Wise tracking <br /> and saving <br /> with ease
              </p>
              <div className="mt-3 w-[30rem] text-[#7a958f]">
                <p>
                  Take control of your finances effortlessly with WaEase.
                  Whether you&apos;re managing a monthly budget, saving for the
                  future, or simply keeping track of daily spending, WaEase
                  offers a seamless way to organize your finances.
                </p>
                <Button
                  onClick={handleToAuth}
                  data-testid="auth-link"
                  className="mt-5 p-5 opacity-75"
                >
                  {" "}
                  Get Started{" "}
                </Button>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, filter: "blur(5px)", x: 90 }}
            animate={
              isSection1InView
                ? { opacity: 1, x: 100, filter: "blur(0)" }
                : { opacity: 0, x: 90, filter: "blur(5px)" }
            }
            transition={{ duration: 1 }}
          >
            <div
              className="absolute right-0 top-[-13rem] mr-[1rem] h-[350px] w-[550px] bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url(${sampleDesign})`,
                zIndex: 1,
                maxWidth: "100vw",
                overflow: "hidden",
              }}
            ></div>
            <div
              className="absolute right-32 top-[-475px] mr-40 h-[600px] w-[550px] bg-cover bg-no-repeat shadow-2xl"
              style={{
                backgroundImage: `url(${categoryLanding})`,
                zIndex: -1,
                maxWidth: "100vw",
                overflow: "hidden",
              }}
            ></div>
          </motion.div>

          {/* Gradient background */}
          <div
            className="absolute bottom-0 left-0 h-2/3 w-full bg-gradient-to-r from-[#4c9182] to-[#efd293]"
            style={{
              clipPath: "polygon(0 70%, 100% 0, 100% 100%, 0 100%)",
              top: "30%",
              height: "70%",
              zIndex: -1,
            }}
          ></div>
        </div>
      </section>

      {/* Section 2 */}
      <motion.div ref={section2Ref}>
        <section
          id="section2"
          className="relative flex min-h-screen flex-col items-center justify-center bg-[#f2e7dd]"
          ref={section2Ref}
        >
          <motion.div
            initial={{ opacity: 0, y: 50, filter: "blur(5px)" }}
            animate={
              isSection2InView
                ? { opacity: 1, y: 0, filter: "blur(0)" }
                : { opacity: 0, y: 50, filter: "blur(5px)" }
            }
            transition={{ duration: 1, delay: 0.3 }}
            className="flex w-full items-center justify-center"
          >
            <div className="mx-auto p-6 text-center">
              <h1 className="mb-6 text-4xl font-bold">Our Mission</h1>
              <p className="max-w-screen-md text-lg leading-relaxed">
                Our mission is to empower individuals to take control of their
                financial well-being through intuitive and seamless tracking
                solutions. We aim to simplify budgeting, expense management, and
                savings by providing user-friendly tools that foster financial
                clarity and confidence. The team aims to create a world where
                everyone, regardless of background, can easily manage their
                finances and achieve financial security. We aspire to be the
                leading platform for innovative financial solutions that promote
                smart saving, wise spending, and a stress-free financial future.
              </p>
            </div>
          </motion.div>
        </section>
      </motion.div>

      {/* Section 3 */}
      <div className="bg-gradient-to-r from-[#4c9182] to-[#efd293] text-white">
        {/* Feature 1 */}
        <section
          id="section3"
          className="relative grid min-h-screen grid-cols-2"
          ref={section3Ref}
        >
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={
              isSection3InView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }
            }
            transition={{ duration: 1, delay: 0.5 }}
            className="flex items-center justify-center"
          >
            <div className="flex w-80 flex-col items-center justify-center text-center">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isSection3InView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 50 }
                }
                transition={{ duration: 1, delay: 0.5 }}
                className="p-5 text-8xl"
              >
                Expense Tracking
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isSection3InView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 50 }
                }
                transition={{ duration: 1, delay: 0.5 }}
                className="p-5 text-lg"
              >
                Effortlessly track your spending by logging expense names,
                quantities, and amounts, with totals automatically calculated
                for you.
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={
              isSection3InView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }
            }
            transition={{ duration: 1, delay: 0.5 }}
            className="flex items-center justify-center"
          >
            <div
              className="mr-14 h-[35rem] w-[40rem] bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url(${feature1})`,
                maxWidth: "100%",
                overflow: "hidden",
              }}
            ></div>
          </motion.div>
        </section>

        {/* Feature 2 */}
        <section
          className="relative grid min-h-screen grid-cols-2"
          ref={section4Ref}
        >
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={
              isSection4InView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }
            }
            transition={{ duration: 1, delay: 0.5 }}
            className="flex items-center justify-center"
          >
            <div
              className="ml-14 h-[35rem] w-[45rem] bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url(${feature2})`,
                maxWidth: "100%",
                overflow: "hidden",
              }}
            ></div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={
              isSection4InView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }
            }
            transition={{ duration: 1, delay: 0.5 }}
            className="flex items-center justify-center"
          >
            <div className="flex w-80 flex-col items-center justify-center text-center">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isSection4InView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 50 }
                }
                transition={{ duration: 1, delay: 0.5 }}
                className="p-5 text-8xl"
              >
                Budgeting Made Simple
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isSection4InView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 50 }
                }
                transition={{ duration: 1, delay: 0.5 }}
                className="p-5 text-lg"
              >
                Easily create personalized spending categories, allocate
                budgets, and monitor your expenses with ease.
              </motion.p>
            </div>
          </motion.div>
        </section>

        {/* Feature 3 */}
        <section
          className="relative grid min-h-screen grid-cols-2"
          ref={section5Ref}
        >
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={
              isSection5InView ? { opacity: 1, x: 0 } : { opacity: 0, x: -100 }
            }
            transition={{ duration: 1, delay: 0.5 }}
            className="flex items-center justify-center"
          >
            <div className="flex w-80 flex-col items-center justify-center text-center">
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isSection5InView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 50 }
                }
                transition={{ duration: 1, delay: 0.5 }}
                className="p-5 text-7xl"
              >
                Comprehensive Weekly Summary
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 50 }}
                animate={
                  isSection5InView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 50 }
                }
                transition={{ duration: 1, delay: 0.5 }}
                className="p-5 text-lg"
              >
                Detailed weekly summaries that offer a thorough analysis of your
                spending, savings, and budget performance.
              </motion.p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={
              isSection5InView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }
            }
            transition={{ duration: 1, delay: 0.5 }}
            className="flex items-center justify-center"
          >
            <div
              className="mr-14 h-[35rem] w-[45rem] bg-cover bg-no-repeat"
              style={{
                backgroundImage: `url(${feature3})`,
                maxWidth: "100%",
                overflow: "hidden",
              }}
            ></div>
          </motion.div>
        </section>
      </div>

      {/* footer */}
      <section className="bg-darkCopper relative flex h-60 flex-col items-center justify-center">
        <div className="font-medium text-white">
          <h3>Never lose track of your expenses again</h3>
          <h1>Dive in to the world of digital tracking</h1>
          <Button
            onClick={handleToAuth}
            className="bg-vanilla text-darkCopper hover:text-vanilla mt-4 items-center justify-center px-5 align-middle"
          >
            {" "}
            Track Now
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Landing;
