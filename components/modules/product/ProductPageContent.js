import { useState } from 'react'
import Image from 'next/image'
import ProductForm from './ProductForm'

export default function ProductPageContent({ product }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const images = product.images?.edges || []
  const hasMultipleImages = images.length > 1

  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    )
  }

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    )
  }

  return (
    <div className='
    flex flex-col justify-center items-center space-y-8
    md:flex-row md:items-start md:space-y-0 md:space-x-4
    lg:space-x-8 max-w-6xl w-11/12 mx-auto'>
      <div className='
      w-full max-w-lg border bg-white border-black
      overflow-hidden shadow-lg md:w-1/2'>
        <div className='relative h-[30rem] lg:h-[50rem] w-full'>
        {images.length > 0 && (
          <Image
            src={images[currentImageIndex].node.url}
            alt={images[currentImageIndex].node.altText || product.title}
            layout="fill"
            objectFit="cover"
            priority={currentImageIndex === 0}
          />
        )}
        {hasMultipleImages && (
          <>
            <button
              onClick={goToPreviousImage}
              className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white border border-black p-2 rounded-full shadow-lg transition-all'
              aria-label="Previous image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={goToNextImage}
              className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white border border-black p-2 rounded-full shadow-lg transition-all'
              aria-label="Next image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </button>
            <div className='absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2'>
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'bg-black w-6'
                      : 'bg-black/40 hover:bg-black/60'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
        </div>
      </div>
      <ProductForm product={product} />
    </div>
  )
}
