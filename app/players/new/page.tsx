import NewPlayerForm from "./NewPlayerForm";

export default function NewPlayerPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-3xl font-bold mb-6">Add Player</h1>
        <NewPlayerForm />
      </div>
    </main>
  );
}