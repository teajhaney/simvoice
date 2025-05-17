import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
const Footer = () => {
  return (
    <footer className=" text-textColor py-10  border-t border-gray200 h-full">
      <div className="appMarginX flex justify-between gap-5 ">
        <div className="space-y-3">
          <h1 className="uppercase text-xs">Resources</h1>
          <h1 className="text-xs">Invoicing Guide</h1>
          <h1 className="text-xs">Help</h1>
          <h1 className="text-xs">Release Notes</h1>
          <h1 className="text-xs">Developer API</h1>
        </div>
        <div className="space-y-3">
          <h1 className="text-xs">© 2012-2025 Invoice-Generator.com</h1>
          <h1 className="text-xs">Terms of Service</h1>
          <h1 className="text-xs">Privacy Policy</h1>
          <div className="flex gap-3 items-center">
            <p className="text-xs text-tertiary">Follow us on</p>
            <div className="flex gap-2">
              <div className="h-8 w-8 border border-secondary rounded-lg flex items-center justify-center">
                <FaFacebook />
              </div>
              <div className="h-8 w-8 border border-secondary rounded-lg flex items-center justify-center">
                <FaInstagram />
              </div>
              <div className="h-8 w-8 border border-tertiary rounded-lg flex items-center justify-center">
                <FaTwitter />
              </div>
            </div>
          </div>
          <a
            className="text-xs text-tertiary text-center hover:underline hover:decoration-primary hover:text-primary"
            href="https://github.com/teajhaney"
            target="_blank"
            rel="noreferrer">
            {" "}
            Github @teajhaney
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
