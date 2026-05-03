import Image from "next/image";
export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex w-full">
      <section className="basis-[50%] bg-info2 flex flex-col  px-12.5 h-screen justify-center gap-11 overflow-y-hidden">
        <Image
          width={127}
          height={139}
          src="/logo.png"
          alt="archer enviroclean logo"
          className="w-22 h-auto"
        />
        <div className="flex flex-col gap-20">
          <div className="flex flex-col">
            <p className=" font-semibold text-3xl">Archer EnviroClean</p>
            <p className="">
              Precision Waste Management for Modern Infrastructure
            </p>
          </div>
          <div className="relative w-full flex justify-center">
            <Image
              src="/authImage1.png"
              alt="recycle shield illustration "
              width={118}
              height={130}
              loading="lazy"
              className="max-w-29.5 h-auto absolute -top-14 left-8  "
            />
            <Image
              src="/authImage2.png"
              alt="recycle illustration"
              width={446}
              height={439}
              loading="eager"
            />
          </div>
        </div>
      </section>
      <section className="basis-[50%] flex justify-center items-center h-screen overflow-y-auto">
        {children}
      </section>
    </main>
  );
}
