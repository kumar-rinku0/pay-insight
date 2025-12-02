import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header Section */}
      <section className="bg-blue-600 text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold">About Us</h1>
          <p className="mt-4 text-lg md:text-xl">
            Empowering organizations with efficient staff management solutions.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-blue-700">Our Mission</h2>
            <p className="mt-4 text-lg leading-relaxed">
              Our mission is to revolutionize the way organizations manage their
              teams. We provide intuitive tools to simplify staff onboarding,
              monitoring, scheduling, and performance tracking—allowing
              companies to focus on growth while ensuring operational
              efficiency.
            </p>
          </div>
          <img
            src="https://via.placeholder.com/500x350"
            alt="Mission Illustration"
            className="rounded-xl shadow-md"
          />
        </div>
      </section>

      {/* Our Story */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-700 text-center">
            Our Story
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-center md:text-left">
            The Staff Management App was created by a team of developers and HR
            professionals who saw the need for a modern solution to manage staff
            in a rapidly evolving workplace. Through real-world insight and
            technical expertise, we designed a platform that combines
            simplicity, transparency, and scalability.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-blue-700 text-center">
            Our Values
          </h2>
          <div className="mt-10 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <h3 className="text-xl font-semibold text-blue-600">
                Innovation
              </h3>
              <p className="mt-3">
                We continuously enhance our platform to meet modern workplace
                needs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <h3 className="text-xl font-semibold text-blue-600">
                Reliability
              </h3>
              <p className="mt-3">
                Trusted by organizations to deliver consistent, secure
                performance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md text-center">
              <h3 className="text-xl font-semibold text-blue-600">
                Transparency
              </h3>
              <p className="mt-3">
                Clear systems that promote accountability across all teams.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
