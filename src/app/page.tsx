import PageContainer from './container';

export default function Home() {
  return (
    <>
      <h1 className="text-4xl font-bold">CoverWise</h1>

      <main className="mt-6 w-full max-w-xl overflow-hidden rounded-md bg-white p-4 shadow">
        <PageContainer />
      </main>
    </>
  );
}
