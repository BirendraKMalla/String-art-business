import { Link } from "react-router-dom";
import { FaInstagram, FaFacebook } from "react-icons/fa";
import { FiMapPin, FiMail, FiPhone, FiArrowUpRight } from "react-icons/fi";
import Button from "./Button";

function Footer() {
  return (
    <footer className="bg-footer-bg text-sage">
      {/* Subtle gold accent top border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-gold-accent to-transparent opacity-50" />

      <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-12 md:py-16">
        {/* Main Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 md:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <h2 className="text-2xl font-semibold text-white">
              String Art Studio
            </h2>

            <p className="text-sage mt-4 max-w-sm leading-relaxed">
              Turn your favorite memories into handcrafted string-art pieces
              made to last.
            </p>

            {/* Social Media */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://www.instagram.com/mallabirendra20/"
                aria-label="Instagram"
                className="
                  w-11 h-11
                  rounded-full
                  border border-sage/30
                  flex items-center justify-center
                  bg-gold-accent/15
                  text-terracotta
                  hover:bg-gold-accent hover:text-deep-brown
                  transition-all duration-300
                "
              >
                <FaInstagram size={19} />
              </a>

              <a
                href="https://www.facebook.com/birendra.malla.774846/"
                aria-label="Facebook"
                className="
                  w-11 h-11
                  rounded-full
                  border border-sage/30
                  flex items-center justify-center
                  bg-gold-accent/15
                  text-terracotta
                  hover:bg-gold-accent hover:text-deep-brown
                  transition-all duration-300
                "
              >
                <FaFacebook size={19} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-white">
              Explore
            </h3>

            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="
                  text-sage
                  hover:text-gold-accent
                  transition-colors
                "
              >
                Home
              </Link>

              <Link
                to="/create"
                className="
                  text-sage
                  hover:text-gold-accent
                  transition-colors
                "
              >
                Create
              </Link>

              <Link
                to="/orders"
                className="
                  text-sage
                  hover:text-gold-accent
                  transition-colors
                "
              >
                My Orders
              </Link>

              <Link
                to="/about"
                className="
                  text-sage
                  hover:text-gold-accent
                  transition-colors
                "
              >
                About
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-5 text-white">
              Get in Touch
            </h3>

            <div className="space-y-4">
              {/* Location */}
              <div className="flex items-start gap-3">
                <FiMapPin
                  size={19}
                  className="mt-1 text-sage flex-shrink-0"
                />
                <p className="text-sage">Kathmandu, Nepal</p>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <FiMail
                  size={19}
                  className="mt-1 text-sage flex-shrink-0"
                />
                <a
                  href="mailto:mallabirendra18@gmail.com"
                  className="
                    text-sage
                    hover:text-gold-accent
                    transition-colors
                    break-all
                  "
                >
                  mallabirendra18@gmail.com
                </a>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-3">
                <FiPhone size={19} className="text-sage flex-shrink-0" />
                <a
                  href="tel:+9779800000000"
                  className="
                    text-sage
                    hover:text-gold-accent
                    transition-colors
                  "
                >
                  +977 98XXXXXXXX
                </a>
              </div>
            </div>

            {/* CTA */}
            <Button
              variant="outline"
              size="md"
              className="mt-7 w-full sm:w-auto rounded-full border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-deep-brown"
            >
              <Link
                to="/create"
                className="flex items-center gap-2"
              >
                Start Creating
                <FiArrowUpRight size={17} />
              </Link>
            </Button>
          </div>
        </div>

        {/* Bottom */}
        <div className="
          border-t border-sage/40
          mt-10 md:mt-12
          pt-6 md:pt-8
          flex flex-col md:flex-row
          justify-between
          gap-3 md:gap-4
        ">
          <p className="text-sm text-sage">
            © {new Date().getFullYear()} String Art Studio. All rights reserved.
          </p>

          <p className="text-sm text-sage">
            Crafted with <span className="text-gold-accent">♥</span> and care.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
