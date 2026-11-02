type Variant = "wave" | "curve" | "layered";

type WaveDividerProps = {
    flip?: boolean;
    variant?: Variant;
};

const shapes: Record<Variant, { d: string; opacity?: number}[]> = {
    wave: [
        { d: "M0,40 C240,100 480,100 720,60 C960,20 1200,20 1440,60 L1440,100 L0,100 Z"},
    ],
    curve: [{ d: "M0,100 C480,0 960,0 1440,100 Z"}],
    layered: [
        { d: "M0,60 C300,10 600,10 900,50 C1150,85 1300,60 1440,30 L1440,100 L0,100 Z", opacity: 0.5},
        { d: "M0,70 C240,100 480,100 720,75 C960,50 1200,50 1440,80 L1440,100 L0,100 Z"},
    ],
};

export default function WaveDivider({flip = false, variant = "wave"}: WaveDividerProps){
    return(
        <div className={`relative z-10 leading-0 ${flip ? "bg-surface" : "bg-white"}`}>
            <svg viewBox="0 0 1440 100" preserveAspectRatio="none" 
                className={`-mb-px block h-12 w-full md:h-20 ${
                    flip ? "-scale-x-100 fill-white" : "fill-surface"}`} 
                    aria-hidden="true">
                {shapes[variant].map((shape, i) => (
                    <path key={i} d={shape.d} opacity={shape.opacity ?? 1} />
                ))}
            </svg>
        </div>
    );
}