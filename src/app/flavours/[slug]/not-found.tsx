import Link from "next/link";

export default function FlavourNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-v-black px-6 text-center text-v-cream">
      <h1 className="mb-4 font-[family-name:var(--font-body)] text-4xl font-bold">
        Flavour not found
      </h1>
      <p className="mb-8 max-w-md text-v-muted">
        That crunch doesn&apos;t exist yet. Explore our full collection instead.
      </p>
      <Link
        href="/#products"
        className="btn-primary-light inline-flex items-center gap-2"
      >
        Shop All Flavours
      </Link>
    </div>
  );
}
