import * as React from "react"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import { Image } from "@heroui/react"

interface PropertyImageProps {
    images: string[]
}

const PropertyImageSlider: React.FC<PropertyImageProps> = ({ images }) => {
    const [sliderRef] = useKeenSlider<HTMLDivElement>(
        {
            loop: true,
        },
        [
            (slider) => {
                let timeout: ReturnType<typeof setTimeout>
                let mouseOver = false
                function clearNextTimeout() {
                    clearTimeout(timeout)
                }
                function nextTimeout() {
                    clearTimeout(timeout)
                    if (mouseOver) return
                    timeout = setTimeout(() => {
                        slider.next()
                    }, 2000)
                }
                slider.on("created", () => {
                    slider.container.addEventListener("mouseover", () => {
                        mouseOver = true
                        clearNextTimeout()
                    })
                    slider.container.addEventListener("mouseout", () => {
                        mouseOver = false
                        nextTimeout()
                    })
                    nextTimeout()
                })
                slider.on("dragStarted", clearNextTimeout)
                slider.on("animationEnded", nextTimeout)
                slider.on("updated", nextTimeout)
            },
        ]
    )

    return (
        <div ref={sliderRef} className="keen-slider">
            {images.map((image, index) => (
                <div key={index} className="keen-slider__slide number-slide1">
                    <Image
                        src={`https://abic-agent-bakit.s3.ap-southeast-1.amazonaws.com/properties/images/${image}`}
                        alt={`Property image ${index + 1}`}
                        className="w-full object-cover object-center rounded-lg"
                        height={450}
                        width={1000}
                    />
                </div>
            ))}
        </div>
    )
}

export default PropertyImageSlider;