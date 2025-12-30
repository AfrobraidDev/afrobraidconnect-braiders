import React, { forwardRef } from "react";

const Textarea = forwardRef(
  (
    { label, error, className = "", containerClassName = "", ...props },
    ref
  ) => {
    return (
      <div className={`w-full ${containerClassName}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}

        <textarea
          ref={ref}
          className={`
            w-full py-3 px-3 border 
            ${error ? "border-red-500" : "border-gray-300"} 
            focus:ring-[#c2825d] focus:border-[#b5734c] 
            outline-none text-gray-900 bg-white
            placeholder:text-gray-500 min-h-[120px]
            ${className}
          `}
          {...props}
        />

        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export default Textarea;
