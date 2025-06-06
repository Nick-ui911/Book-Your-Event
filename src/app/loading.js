import React from 'react'

const loading = () => {
    return (
        <div className="flex items-center justify-center h-64 w-full">
          <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
}

export default loading
