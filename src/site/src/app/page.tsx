import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>iBaguette Study</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta
          name="description"
          content="iBaguette Study is a brand-new, blazing-fast service for students and teachers. We offer a range of unique features such as searching real scripts by grade/mark, exemplar NEAs and presentations, tips from Oxbridge applicants and more to boost your revision & grades."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Hero Section */}
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-transform duration-500 hover:scale-105">
              iBaguette Study
            </h1>
            <p className="text-xl text-gray-700 dark:text-gray-300">
              Discover real exam examples, past papers, and detailed script analysis to ace your exams.
            </p>
            <a
              href="#features"
              className="mt-8 inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full px-8 py-4 transition-colors duration-300"
            >
              Explore Now
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
              What We Offer
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Real Exam Examples
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  See how the best students nail exams with their scripts and exemplar NEAs.
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Grade-Based Search
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Filter and compare revision materials by the grade they achieved to find the best strategy.
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Exam Script Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  See how examiners mark scripts and learn how to improve your answers.
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Free and Open Source
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  No paywalls, no tracking, no spending 30 minutes to find the right resource.
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Statements, Tips & More
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  See how Russell Group and Oxbridge applicants aced their personal statements, presentations, interviews and exams.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call-To-Action Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Learn Smarter, Not Harder
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Open up the Resource Library and see the featured resources, or search more specifcally for what you need.
            </p>
            <a
              href="/library"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full px-8 py-4 transition-colors duration-300"
            >
              Get Started
            </a>
          </div>
        </section>
      </main>
    </>
  );
}