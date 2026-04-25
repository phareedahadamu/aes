import {
  Tailwind,
  pixelBasedPreset,
  Button,
  Html,
  Container,
  Text,
} from "@react-email/components";
export default function RegisterAccountEmail({ link }: { link: string }) {
  return (
    <Tailwind
      config={{
        presets: [pixelBasedPreset],
        theme: {
          extend: {
            colors: {
              brand: "#1A387F",
            },
          },
        },
      }}
    >
      <Html>
        <Container className="py-10  items-center max-w-100 w-full px-4 flex flex-col">
          <Text className="text-center text-xl font-medium ">
            You have been granted access to Archer Enciroclean Services-
            Property Management App. Click the button below to register your
            account.
          </Text>
          <Button
            href={link}
            className="bg-brand px-7.5 text-[18px] block py-2 font-medium leading-4 text-white rounded-[10px] text-center mt-6"
          >
            Register Account
          </Button>
        </Container>
      </Html>
    </Tailwind>
  );
}
