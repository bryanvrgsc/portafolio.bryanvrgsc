"use client";

import dynamic from 'next/dynamic';

// Cargamos el componente Desktop solo en el cliente
const Desktop = dynamic(() => import('@/components/Desktop'), {
  ssr: false,
  // Mientras carga el JS del cliente, mostramos una pantalla negra pura
  loading: () => <div className="h-screen w-full bg-black" />
});

export default function Home() {
  return (
    <main className="min-h-screen">
      <Desktop />
    </main>
  );
}
