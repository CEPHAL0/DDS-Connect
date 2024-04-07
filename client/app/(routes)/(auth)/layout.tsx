import LoginForm from "@/app/_components/LoginForm";
import survey_hero_image from "@/app/_assets/images/survey_hero_image.jpg";
import Image from "next/image";
import dds_logo_small_black from "@/app/_assets/images/dds_logo_small_black.png";
import ContextMessage from "@/app/(routes)/_helper_components/ContextMessage";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-screen bg-gradient-to-tr from-black via-darkGreen to-lightGreen from-20% justify-end font-cabin">
      <section className="grow hidden md:flex flex-col items-center justify-center font-bold text-white text-5xl gap-4 relative ">
        <Image
          src={survey_hero_image}
          className="absolute mix-blend-color-burn hidden md:block opacity-90 "
          // layout="responsive"
          alt="Survey Illustration"
          quality={80}
          priority
        />
        <p className="flex flex-col gap-4 items-center z-10">
          Re-Imagine
          <span className="bg-gradient-to-l from-lightGreen to-darkGreen text-transparent bg-clip-text font-satisfy">
            Forms
          </span>
        </p>
      </section>
      <section className="rounded-tl-3xl rounded-bl-3xl flex flex-col items-center justify-center w-full md:w-[45%] md:max-w-full md:min-w-[45%] bg-white p-6 gap-6">
        <div className="rounded-[100%] border border-darkGreen w-16 h-16 overflow-clip">
          <Image
            src={dds_logo_small_black}
            className="object-cover"
            alt="DDS Logo"
            priority
          />
        </div>
        <div className="">{children}</div>
      </section>
    </section>
  );
}
