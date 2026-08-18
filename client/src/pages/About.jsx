import { FiArrowRight } from "react-icons/fi";
import Button from "../components/Button";
import { Link } from "react-router-dom";

function About() {
  return (
    <main className="bg-cream min-h-screen">
      <section className="
        max-w-[1280px]
        mx-auto
        px-4 md:px-8
        py-24
      ">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          {/* Decorative line */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="w-12 h-px bg-gold-accent" />
            <span className="text-xs font-medium text-terracotta tracking-wider uppercase">Our Story</span>
            <span className="w-12 h-px bg-gold-accent" />
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-deep-brown mb-6">
            Where Memories Meet Craftsmanship
          </h1>

          <p className="text-lg text-sage">
            We transform your cherished moments into
            intricate, tactile works of art, blending
            modern algorithms with timeless artisanal
            techniques.
          </p>
        </div>

        {/* Mission Section */}
        <div className="
          relative
          bg-footer-bg
          text-white
          rounded-[var(--radius-xl)]
          shadow-strong
          p-12 md:p-24
          text-center
          overflow-hidden
        ">
          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-gold-accent" />
          <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-gold-accent" />
          <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-gold-accent" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-gold-accent" />

          <div className="max-w-3xl mx-auto relative z-10">
            <div className="
              text-center
              mb-8
              text-2xl md:text-3xl
              decorative
              italic
            ">
              "Creating something you can touch, feel, and keep forever."
            </div>

            <p className="text-lg md:text-xl leading-relaxed text-sage">
              We believe in creating something real.
              Something you can touch, feel, and keep
              forever.
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Button variant="primary" size="lg" className="rounded-full">
            <Link to="/create" className="flex items-center gap-2">
              Start Your Piece
              <FiArrowRight size={18} />
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}

export default About;
