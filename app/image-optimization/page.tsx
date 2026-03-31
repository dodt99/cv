/**
 * Next.js <Image> optimization demo
 *
 * Run:  npx create-next-app@latest demo --typescript --app
 *       then drop this file into app/page.tsx
 */
import Image from "next/image";
import localPhoto from "../../public/happy.webp"; // add any local jpg here

export default function ImageOptimizationDemo() {
  return (
    <main
      style={{
        fontFamily: "sans-serif",
        maxWidth: 800,
        margin: "0 auto",
        padding: 32,
      }}
    >
      <h1>Next.js Image Optimization Demo</h1>

      {/* ─── 1. PRIORITY (LCP image) ─────────────────────────────────────────
          `priority` disables lazy loading and injects a <link rel="preload">
          Use this for the largest image visible on first load (hero, banner).
      */}
      <section>
        <h2>1. Priority (LCP / hero image)</h2>
        <p>
          Adds <code>rel="preload"</code> — no lazy loading, fetched
          immediately.
        </p>
        <Image
          src="https://picsum.photos/seed/hero/800/400"
          alt="Hero image"
          width={800}
          height={400}
          priority // ← preloaded, not lazy
          style={{ width: "100%", height: "auto" }}
        />
      </section>

      {/* ─── 2. LAZY LOADING (default) ───────────────────────────────────────
          Images below the fold are NOT fetched until they near the viewport.
          Next.js adds loading="lazy" automatically.
      */}
      <section style={{ marginTop: 48 }}>
        <h2>2. Lazy loading (default)</h2>
        <p>
          Scroll down — this image is fetched only when it enters the viewport.
        </p>
        <Image
          src="https://picsum.photos/seed/lazy/800/400"
          alt="Lazy loaded image"
          width={800}
          height={400}
          // loading="lazy" is the default — no need to write it
          style={{ width: "100%", height: "auto" }}
        />
      </section>

      {/* ─── 3. BLUR PLACEHOLDER ─────────────────────────────────────────────
          `placeholder="blur"` shows a blurred preview while the real image loads.
          For remote images you must supply a `blurDataURL` (a tiny base64 image).
          For local imports Next.js generates it automatically.
      */}
      <section style={{ marginTop: 48 }}>
        <h2>3. Blur placeholder</h2>
        <p>A tiny base64 preview is shown until the full image arrives.</p>

        {/* Remote image — supply blurDataURL manually (generate with plaiceholder or squoosh) */}
        <Image
          src="https://picsum.photos/seed/blur/800/400"
          alt="Blur placeholder demo"
          width={800}
          height={400}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUE/8QAIRAAAQMEAgMAAAAAAAAAAAAAAQIDBAAFERIhMUH/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8Amq6nRbdIiRXFJDstxLbZJwMk4yfaqp2VEbadkrSEpQgqJJ4AHJqjSlBELUF3kXm5GW8TgDCEk8JSOwH96JUUAUUUUH/2Q=="
          style={{ width: "100%", height: "auto" }}
        />

        {/* Local import — blurDataURL is generated automatically at build time */}
        <Image
          src={localPhoto}
          alt="Local with auto blur"
          placeholder="blur"
          style={{ width: "100%", height: "auto" }}
        />
      </section>

      {/* ─── 4. RESPONSIVE SIZES ─────────────────────────────────────────────
          `sizes` tells the browser how wide the image will be at each breakpoint.
          Next.js generates a srcset; the browser picks the smallest sufficient size.
          Without `sizes`, Next.js assumes 100vw — wastes bandwidth on small screens.
      */}
      <section style={{ marginTop: 48 }}>
        <h2>4. Responsive sizes + srcset</h2>
        <p>
          Open DevTools → Network → Img and resize the window. The browser
          fetches a different size depending on viewport width.
        </p>
        {/* parent must be position:relative with a defined height for fill to work */}
        <div style={{ position: "relative", width: "100%", height: 400 }}>
          <Image
            src="https://picsum.photos/seed/resp/1200/600"
            alt="Responsive image"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 800px"
            style={{ objectFit: "cover" }}
          />
        </div>
      </section>

      {/* ─── 5. FORMAT CONVERSION ────────────────────────────────────────────
          No code change needed — Next.js automatically serves:
            • AVIF  if the browser supports it  (best compression)
            • WebP  as fallback
            • original format as last resort
          Check DevTools → Network → response Content-Type header.
      */}
      <section style={{ marginTop: 48 }}>
        <h2>5. Automatic format conversion (WebP / AVIF)</h2>
        <p>
          Inspect the network request for the image below. Even though the src
          is a <code>.jpg</code>, the browser receives <code>image/webp</code>{" "}
          or <code>image/avif</code>.
        </p>
        <Image
          src="https://picsum.photos/seed/fmt/800/400"
          alt="Format conversion demo"
          width={800}
          height={400}
          style={{ width: "100%", height: "auto" }}
        />
        <p>
          The actual URL Next.js calls looks like:
          <br />
          <code>/_next/image?url=...&amp;w=828&amp;q=75</code>
        </p>
      </section>

      {/* ─── 6. QUALITY ──────────────────────────────────────────────────────
          Default quality is 75. Lower = smaller file, higher = better fidelity.
      */}
      <section style={{ marginTop: 48 }}>
        <h2>6. Quality control</h2>
        <div style={{ display: "flex", gap: 16 }}>
          <div>
            <p>quality=10 (tiny file)</p>
            <Image
              src="https://picsum.photos/seed/q10/400/300"
              alt="Low quality"
              width={380}
              height={285}
              quality={10}
            />
          </div>
          <div>
            <p>quality=90 (high fidelity)</p>
            <Image
              src="https://picsum.photos/seed/q10/400/300"
              alt="High quality"
              width={380}
              height={285}
              quality={90}
            />
          </div>
        </div>
      </section>
    </main>
  );
}
