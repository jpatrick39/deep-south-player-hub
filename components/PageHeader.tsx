export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
        {title}
      </h1>
      {subtitle && <p className="mt-2 max-w-3xl text-slate-600">{subtitle}</p>}
    </div>
  );
}