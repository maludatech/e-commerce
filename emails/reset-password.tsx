import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import { getSetting } from "@/lib/actions/setting.actions";

type ResetPasswordEmailProps = {
  name: string;
  resetUrl: string;
};

ResetPasswordEmail.PreviewProps = {
  name: "John Doe",
  resetUrl: "https://example.com/reset-password/sample-token",
} satisfies ResetPasswordEmailProps;

export default async function ResetPasswordEmail({
  name,
  resetUrl,
}: ResetPasswordEmailProps) {
  const { site } = await getSetting();
  return (
    <Html>
      <Preview>Reset your {site.name} password</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Reset your password</Heading>
            <Text>Hi {name},</Text>
            <Text>
              We received a request to reset the password for your{" "}
              {site.name} account. Click the button below to choose a new
              one. This link expires in 1 hour.
            </Text>
            <Section className="text-center my-6">
              <Button
                href={resetUrl}
                className="text-center bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
              >
                Reset Password
              </Button>
            </Section>
            <Text className="text-gray-500 text-sm">
              If you didn&apos;t request a password reset, you can safely
              ignore this email — your password will remain unchanged.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
