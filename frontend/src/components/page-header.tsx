type PageHeaderProps = {
  title: string;
  description: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="mt-2 text-gray-700">{description}</p>
    </div>
  );
}
