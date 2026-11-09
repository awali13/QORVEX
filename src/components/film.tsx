import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { buttonClass, Kicker } from "@/components/site";

/** Original supplied film. Not re-encoded. Soundtrack stays on. */
const PROMO_SRC = `${import.meta.env.BASE_URL}promo/qorvex.mp4`;

export function Film() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    video.volume = 1;
  }, []);

  return (
    <section className="bg-ink" aria-label="QORVEX film">
      <div className="bg-black">
        <video
          ref={videoRef}
          className="mx-auto block h-auto max-h-[82svh] w-full bg-black object-contain"
          src={PROMO_SRC}
          controls
          playsInline
          preload="metadata"
          aria-label="QORVEX promotional film with original soundtrack"
        >
          QORVEX promotional film
        </video>
      </div>
      <div className="mx-auto w-full max-w-7xl px-5 py-12 md:py-16">
        <Kicker>Pure Engineering</Kicker>
        <h1 className="mt-4 max-w-3xl font-display text-6xl text-ivory sm:text-8xl">Born to Lead.</h1>
        <p className="mt-5 max-w-xl text-base text-ivory sm:text-lg">
          The house film, with its original soundtrack. An electric grand tourer, an electric grand SUV, a six-wheel
          diesel, and a supercharged hypercar.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/collection" className={buttonClass("solid")}>
            Enter the collection
          </Link>
          <Link to="/about" className={buttonClass("ghost")}>
            The House
          </Link>
        </div>
      </div>
    </section>
  );
}
