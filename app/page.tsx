"use client";

import dynamic from 'next/dynamic';
import BootShell from '@/components/BootShell';

// Cargamos el componente Desktop solo en el cliente
const Desktop = dynamic(() => import('@/components/Desktop'), {
  ssr: false,
  // Mientras carga el JS del cliente, mostramos el shell de inicio
  loading: () => <BootShell />
});

export default function Home() {
  return (
    <main className="min-h-screen">
      <Desktop />
    </main>
  );
}
