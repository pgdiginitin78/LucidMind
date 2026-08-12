"use client";

import { Card } from "./card";
import Heading from "./Heading";

const HighlightCard = ({ title, description, icon }) => {
  return (
    <div className="group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:-rotate-1 h-full">
      <Card className="text-gray-900 rounded-2xl border border-brand-teal/20 bg-white shadow-xl relative backdrop-blur-xl overflow-hidden hover:border-brand-teal/50 hover:shadow-brand-teal/10 hover:shadow-2xl w-full h-full min-h-[420px] flex flex-col">
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-blue/5 to-brand-teal/10 opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
          <div className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-gradient-to-tr from-brand-teal/20 to-transparent blur-3xl opacity-30 group-hover:opacity-50 transform group-hover:scale-110 transition-all duration-700 animate-bounce"></div>
          <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-brand-blue/10 blur-xl animate-ping"></div>
          <div className="absolute bottom-16 right-16 w-12 h-12 rounded-full bg-brand-teal/10 blur-lg animate-ping"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-teal/5 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
        </div>

        <div className="p-8 relative z-10 flex flex-col items-center text-center h-full justify-between">
          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-brand-teal/30 animate-ping"></div>
              <div className="absolute inset-0 rounded-full border border-brand-teal/20 animate-pulse"></div>

              <div className="p-6 rounded-full backdrop-blur-lg border border-brand-teal/20 bg-gradient-to-br from-brand-blue/10 to-brand-teal/10 shadow-lg transform group-hover:rotate-12 group-hover:scale-110 transition-all duration-500 hover:shadow-brand-teal/30">
                <div className="transform group-hover:rotate-180 transition-transform duration-700 text-brand-blue">
                  {icon}
                </div>
              </div>
            </div>

            {/* <Heading level={3} className="mb-4 text-2xl bg-gradient-to-r from-brand-blue via-brand-teal to-brand-blue bg-clip-text text-transparent transform group-hover:scale-105 transition-transform duration-300"> */}
            <Heading
              level={3}
              className="mb-4 text-xl text-brand-blue  transform group-hover:scale-105 transition-transform duration-300"
            >
              {title}
            </Heading>

            <div className="space-y-1 max-w-sm">
              {description.map((line, idx) => (
                <p
                  key={idx}
                  className="text-gray-600 text-sm leading-relaxed transform group-hover:text-gray-900 transition-colors duration-300"
                >
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="w-full flex flex-col items-center mt-2">
            <div className="w-1/3 h-0.5 bg-gradient-to-r from-transparent via-brand-teal to-transparent rounded-full transform group-hover:w-1/2 group-hover:h-1 transition-all duration-500 animate-pulse"></div>

            <div className="flex space-x-2 mt-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-2 h-2 bg-brand-teal rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-brand-teal rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-2 h-2 bg-brand-teal rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        </div>

        <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-brand-blue/10 to-transparent rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-to-tl from-brand-teal/10 to-transparent rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </Card>
    </div>
  );
};

export default HighlightCard;
