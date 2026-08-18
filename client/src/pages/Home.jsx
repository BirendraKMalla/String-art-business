import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import Button from "../components/Button";

function Home() {
  return (
    <main className="bg-cream min-h-screen">
      {/* Hero Section */}
      <section className="
        relative
        max-w-[1280px] mx-auto
        px-4 md:px-8
        pt-24 md:pt-32
        pb-16 md:pb-24
        flex flex-col md:flex-row
        items-center
        gap-12
        overflow-hidden
      ">
        {/* Decorative SVG wave divider */}
        <div className="absolute bottom-0 left-0 w-full h-[100px] -z-1 opacity-40 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 1280 100" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 30C160 10 320 0 480 10C640 20 800 30 960 25C1120 20 1200 5 1280 10V100H0V30Z" fill="var(--color-warm-beige)" />
          </svg>
        </div>

        <div className="flex-1 space-y-8">
          {/* Decorative line + accent */}
          <div className="flex items-center gap-3">
            <span className="w-12 h-px bg-gold-accent" />
            <span className="text-xs font-medium text-terracotta tracking-wider uppercase">Artisanal Craft</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-deep-brown leading-tight">
            Turn Your Favorite Photo Into String Art
          </h1>

          <p className="text-lg text-sage max-w-lg">
            Upload your memories and receive a custom, handcrafted string-art
            canvas, meticulously woven with thousands of lines.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button variant="primary" size="lg" className="rounded-full">
              <Link to="/create" className="flex items-center gap-2">
                Create Your String Art
                <FiArrowRight size={18} />
              </Link>
            </Button>

            <Button variant="ghost" size="lg" className="rounded-full">
              <Link to="#process" className="flex items-center gap-2">
                How It Works
              </Link>
            </Button>
          </div>
        </div>

        {/* Hero Image Frame */}
        <div className="flex-1">
          <div className="
            bg-parchment
            p-4
            rounded-[var(--radius-xl)]
            shadow-card
            border-8 border-parchment
          ">
            <div className="relative rounded-2xl overflow-hidden">
              {/* Gold corner accents */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold-accent rounded-tl-2xl z-10" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold-accent rounded-tr-2xl z-10" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold-accent rounded-bl-2xl z-10" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold-accent rounded-br-2xl z-10" />

              <img
                src="https://res.cloudinary.com/l9eecn1m/image/upload/v1786869348/string-art-preview-2026-08-16.png"
                alt="String art preview"
                className="w-full rounded-xl shadow-inner"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section
        id="process"
        className="
          relative
          max-w-[1280px]
          mx-auto
          px-4 md:px-8
          py-24
        "
      >
        {/* Decorative wavy divider */}
        <div className="absolute -top-10 left-0 w-full h-20 -z-1">
          <svg width="100%" height="100%" viewBox="0 0 1280 60" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 30C160 20 320 10 480 15C640 20 800 25 960 20C1120 15 1200 10 1280 15V60H0V30Z" fill="var(--color-parchment)" />
          </svg>
        </div>

        <div className="text-center mb-20">
          <p className="text-xs font-medium text-terracotta tracking-wider uppercase mb-4">
            Simple 4-Step Process
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-deep-brown">
            The Process
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <Step
            number="1"
            title="Upload Photo"
            text="Select a high-contrast image for best results."
          />

          <Step
            number="2"
            title="Generate Design"
            text="Our algorithm calculates the perfect thread path."
          />

          <Step
            number="3"
            title="Preview & Order"
            text="Review the digital simulation before ordering."
          />

          <Step
            number="4"
            title="Handcrafted Delivery"
            text="Meticulously woven and shipped to your door."
          />
        </div>
      </section>
    </main>
  );
}

function Step({ number, title, text }) {
  return (
    <div className="text-center space-y-5">
      <div className="
        w-20 h-20 mx-auto
        rounded-full
        bg-parchment
        border-2 border-gold-accent
        flex items-center justify-center
        text-terracotta
        shadow-card
        transition-transform duration-300
        hover:scale-105
      ">
        <span className="text-xl font-bold">{number}</span>
      </div>

      <h3 className="text-xl font-semibold text-deep-brown">{title}</h3>

      <p className="text-sage max-w-xs mx-auto">{text}</p>
    </div>
  );
}

export default Home;
