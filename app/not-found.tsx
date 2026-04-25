import LinkButton from "@/components/web/linkButton";

export default function NotFound() {
  return (
    <div className="fixed w-screen h-screen bg-background flex flex-col justify-center items-center gap-8 left-0 right bottom top">
      <p className="text-9xl text-accent font-medium">404</p>
      <div className="flex flex-col gap-4 justify-center items-center">
        <h2 className="font-medium text-2xl">Oops, this page is not found!</h2>
        <LinkButton href="/" className="text-lg px-8! ">
          Return to Dashboard
        </LinkButton>
      </div>
    </div>
  );
}
