import Image from 'next/image'

export default function FullImageBanner() {
    return (
        <div className="w-full mt-10 max-w-[1266px]">
            <div className="hidden md:block">
                <div style={{ maxWidth: "20000px", maxHeight: "1000px" }} className="relative">
                    <Image
                        src="/img/bg.jpg"
                        alt="Your Image"
                        layout="fill"
                        objectFit="cover"
                    />
                </div>
            </div>
            <div className="block h-32 md:h-44 relative">
                <Image
                    src="/img/bg.jpg"
                    alt="Your Image"
                    layout="fill"
                    objectFit="cover"
                    objectPosition="center"
                />
            </div>
        </div>
    )
}