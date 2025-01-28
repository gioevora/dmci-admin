import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export const Email = ({
  first_name = "Fortune Matthew",
  last_name = "Tamares",
  body = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In maximus enim nec mauris elementum mollis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse lobortis congue magna, id rhoncus ipsum ultricies at. Maecenas porttitor faucibus velit, quis rutrum eros pellentesque ac.",
}: any) => (
  <Html>
    <Head />
    <Preview>New Inquiry Received - Abic Realty & Consultancy Corporation</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Img
            src="https://abic-agent-bakit.s3.ap-southeast-1.amazonaws.com/media/ABIC+Realty.png"
            height="80"
            alt="Abic Realty Corp"
          />
          <Hr style={hr} />
          <Text style={paragraph}>
            Dear {first_name} {last_name},
          </Text>
          <Text style={paragraph}>
            {body}
          </Text>
          <Hr style={hr} />
          {/* <Text style={paragraph}><strong>Inquiry Type:</strong> {type}</Text>
          <Text style={paragraph}><strong>Name:</strong> {name}</Text>
          <Text style={paragraph}><strong>Email:</strong> {email}</Text>
          <Text style={paragraph}><strong>Phone:</strong> {phone}</Text>
          <Text style={paragraph}><strong>Message:</strong></Text>
          <Text style={paragraph}>{message}</Text> */}
          <Text style={paragraph}>
            For assistance, please visit our{" "}
            <Link style={anchor} href="https://support.abicrealty.com">
              support page
            </Link>
            .
          </Text>
          <Text style={paragraph}>
            — Abic Realty & Consultancy Corporation
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            Unit 202, Campos Rueda Building, 101 Urban Ave, Makati, 1206 Metro Manila<br />
            LandLine: 02-8646-6136 | Mobile: +63 965 198 3796<br />
            Email: abicrealtycorporation@gmail.com | Website: <Link style={anchor} href="https://www.abicrealtyph.com">www.abicrealty.com</Link><br />
            Office Hours: Monday to Friday, 8:00 AM - 5:00 PM
          </Text>

        </Section>
      </Container>
    </Body>
  </Html>
);

export default Email;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const box = {
  padding: "0 48px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const paragraph = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
};

const anchor = {
  color: "#556cd6",
};

const button = {
  backgroundColor: "#656ee8",
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "100%",
  padding: "10px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};