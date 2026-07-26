import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

const theme = {
  extend: {
    colors: {
      navy: { 700: "#0B2A4A", 800: "#081E36" },
      saffron: { 500: "#F2921D", 600: "#D97A0E" },
      federal: { green: "#0F8B5F" },
      slate: { 50: "#F8FAFC", 500: "#64748B" },
    },
  },
};

export type NewsletterSignupEmailProps = {
  email: string;
};

export default function NewsletterSignupEmail({ email }: NewsletterSignupEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New newsletter subscriber: {email}</Preview>
      <Tailwind config={{ theme }}>
        <Body className="m-0 bg-slate-50 p-0 font-sans">
          <Container className="mx-auto my-0 max-w-[560px] bg-slate-50">
            <Section className="bg-navy-700 px-8 py-7 text-center">
              <Img
                src="https://www.faiita.co.in/logo.png"
                alt="FAIITA"
                width="140"
                className="mx-auto"
              />
            </Section>

            <Section className="bg-white px-8 py-8 text-center">
              <Text className="m-0 text-[11px] font-semibold uppercase tracking-wide text-federal-green">
                Newsletter
              </Text>
              <Heading className="m-0 mt-1 text-[22px] font-bold leading-snug text-navy-800">
                New subscriber
              </Heading>

              <Hr className="my-6 border-slate-200" />

              <Section className="mx-auto inline-block rounded-lg bg-slate-50 px-6 py-4">
                <Text className="m-0 text-[16px] font-semibold text-navy-800">{email}</Text>
              </Section>

              <Text className="m-0 mt-6 text-[13px] text-slate-500">
                They&apos;ll now receive future editions of the FAIITA Patrika and federation
                updates.
              </Text>
            </Section>

            <Section className="px-8 py-5 text-center">
              <Text className="m-0 text-[11px] text-slate-500">
                Federation of All India IT Associations · faiita.co.in
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
