import Loader from "./loader";
export default function FullPageLoader() {
  return (
    <section className="fixed top-0 bottom-0 left-0 right-0 w-screen h-screen flex items-center justify-center bg-background">
      <Loader />
    </section>
  );
}
