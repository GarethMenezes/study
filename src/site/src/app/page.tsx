import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>iBaguette Study - Revolutionize Your Revision</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta
          name="description"
          content="iBaguette Study offers real exam examples, past papers, search by grade/mark, and detailed exam script analysis to boost your revision strategy."
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
                  Access genuine exam questions and past papers from diverse exam boards.
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Grade-Based Search
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Filter revision materials by grade and mark to target your study focus.
                </p>
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Exam Script Analysis
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Learn from detailed marked exam scripts and understand marking schemes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call-To-Action Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Revolutionize Your Revision?
            </h2>
            <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
              Join iBaguette Study today and unlock a comprehensive suite of revision tools.
            </p>
            <a
              href="https://github.com/"
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