import React from 'react'

const CrisisSupport = ({onClose}) =>{
  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center backdrop-blur-xs bg-black/10">
      <div className="absolute inset-0 z-[9999]  "
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl z-10 p-6 max-w-sm w-full">
        <h2 className="text-lg font-semibold">Crisis Contact</h2>
        <p className="mt-2 text-sm text-gray-600">
          Crisis contact to be obtained through cookie or default to irish (prefer 1st)
        </p>

        <button
          onClick={onClose}
          className="cursor-pointer mt-4 px-4 py-2 bg-black text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default CrisisSupport