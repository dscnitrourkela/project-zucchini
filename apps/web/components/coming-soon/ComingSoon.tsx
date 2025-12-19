"use client";

import Image from "next/image";
import FireworksEffect from "./FireworksEffects";

export default function ComingSoon() {
  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        backgroundColor: "black",
        overflow: "hidden",
      }}
    >
      <FireworksEffect />

      <Image
        src="/uploads/background-image.png"
        alt="Carnival Background"
        fill
        priority
        style={{
          objectFit: "cover",
          zIndex: 1,
        }}
      />

      {/* Layer 2: Black overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "black",
          opacity: 0.55,
          zIndex: 2,
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 3,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-around",
          gap: "120px",
          pointerEvents: "none",
        }}
      >
        {/*Top*/}
        <Image
          src="/uploads/nitrutsavLogo.png"
          alt="NITRUTSAV"
          width={500}
          height={200}
          style={{
            width: "80%",
            maxWidth: "500px",
            height: "auto",
            opacity: 0.3,
            marginTop: "5%",
          }}
        />

        <Image
          src="/uploads/nitrutsavLogo.png"
          alt="NITRUTSAV"
          width={800}
          height={240}
          style={{
            width: "80%",
            maxWidth: "800px",
            height: "auto",
            opacity: 1,
          }}
        />

        {/*bottom*/}
        <Image
          src="/uploads/nitrutsavLogo.png"
          alt="NITRUTSAV"
          width={500}
          height={200}
          style={{
            width: "80%",
            maxWidth: "500px",
            height: "auto",
            opacity: 0.3,
            marginBottom: "5%",
          }}
        />
      </div>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 3,

          pointerEvents: "none",

          width: "clamp(200px, 50%, 380px)",
          height: "auto",
        }}
      >
        <Image
          src="/uploads/balloon.png"
          alt="Coming Soon Balloon"
          width={400} // aspect ratio reference
          height={300} // aspect ratio reference
          style={{ width: "100%", height: "auto" }}
        />
      </div>
    </section>
  );
}
