import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
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
      slate: { 50: "#F8FAFC", 500: "#64748B", 700: "#334155" },
    },
  },
};

export type ContactFormEmailProps = {
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  subject?: string;
  message: string;
};

function Field({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <Section className="mb-3">
      <Text className="m-0 text-[11px] font-semibold uppercase tracking-wide text-saffron-600">
        {label}
      </Text>
      <Text className="m-0 mt-0.5 text-[15px] text-navy-800">{value}</Text>
    </Section>
  );
}

export default function ContactFormEmail({
  name,
  email,
  phone,
  organization,
  subject,
  message,
}: ContactFormEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact form submission from {name}</Preview>
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

            <Section className="bg-white px-8 py-8">
              <Text className="m-0 text-[11px] font-semibold uppercase tracking-wide text-saffron-600">
                Website Contact Form
              </Text>
              <Heading className="m-0 mt-1 text-[22px] font-bold leading-snug text-navy-800">
                New enquiry: {subject || "General enquiry"}
              </Heading>

              <Hr className="my-6 border-slate-200" />

              <Field label="Name" value={name} />
              <Field label="Email" value={email} />
              <Field label="Phone" value={phone} />
              <Field label="Organization" value={organization} />

              <Section className="mt-4 rounded-lg bg-slate-50 px-5 py-4">
                <Text className="m-0 text-[11px] font-semibold uppercase tracking-wide text-saffron-600">
                  Message
                </Text>
                <Text className="m-0 mt-1 whitespace-pre-line text-[15px] leading-relaxed text-navy-800">
                  {message}
                </Text>
              </Section>

              <Hr className="my-6 border-slate-200" />

              <Text className="m-0 text-[13px] text-slate-500">
                Reply directly to this email to respond to {name} at{" "}
                <Link href={`mailto:${email}`} className="text-navy-700 underline">
                  {email}
                </Link>
                .
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
