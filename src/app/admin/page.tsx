export default function AdminPage() {
  const flag = "IONIC{my_k1s4h_s30r4ng_k4rbit_s3jat1}";
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="p-8 bg-neutral-900 text-white rounded-lg shadow-lg">
        <h1 className="text-xl font-bold mb-2">Admin Panel</h1>
        <p className="font-mono break-words">{flag}</p>
        <p className="mt-4 text-sm text-neutral-400">Inilah dia sang karbiters sejati</p>
      </div>
    </main>
  );
}