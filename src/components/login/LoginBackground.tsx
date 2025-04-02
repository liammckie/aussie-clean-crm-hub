
import React from "react";

export function LoginBackground() {
  return (
    <>
      {/* Unified background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Lighting effects */}
        <div className="absolute top-0 -left-1/4 w-[500px] h-[500px] bg-purple-800/10 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '8s' }}></div>
        <div className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/5 rounded-full blur-[80px]"></div>
        
        {/* Light beams */}
        <div className="absolute top-0 left-1/4 w-1 h-[300px] bg-gradient-to-b from-purple-500/30 to-transparent rotate-[20deg] blur-[3px]"></div>
        <div className="absolute bottom-0 right-1/3 w-1 h-[200px] bg-gradient-to-t from-indigo-500/20 to-transparent -rotate-[15deg] blur-[3px]"></div>
        
        {/* Additional light effects */}
        <div className="absolute top-0 right-1/5 w-1 h-[250px] bg-gradient-to-b from-purple-500/20 to-transparent rotate-[30deg] blur-[3px]"></div>
        <div className="absolute bottom-1/3 left-1/4 w-1 h-[150px] bg-gradient-to-t from-indigo-500/15 to-transparent rotate-[10deg] blur-[3px]"></div>
      </div>
      
      {/* Dot grid overlay */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-repeat opacity-[0.03]"></div>
    </>
  );
}
