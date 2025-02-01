import { useEffect, useRef } from "react"

type ImageViewerProps = {
    data: ArrayBuffer
}
export default function ImageViewer ({data}: ImageViewerProps) {
    const ref = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        if (ref && ref.current && data) {
            const blob = new Blob( [ data ], { type: `image/${data}` } );
            const imageUrl = URL.createObjectURL( blob );
            ref.current.src = imageUrl;
        
        } else if (ref && ref.current) {
            ref.current.src = "";
        }
    }, [ref, data])
    
    return <div style={{
        height: "100%",
        width: "100%",
        position: "relative",
        overflow: "hidden"
    }}>
        <img ref={ref} style={{objectFit: "scale-down", width: "100%", height: "100%"}} />
    </div>
}