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
  Text,
} from '@react-email/components';
import * as React from 'react';

interface EmailProps {
  first_name: string;
  last_name: string;
  body: string;
}

export const Email = ({
  first_name = "Fortune Matthew",
  last_name = "Tamares",
  body = "Lerom Ipsum",
}: EmailProps) => (
  <Html>
    <Head />
    <Preview>Your listing with DMCI Homes is approved!</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* <Img
          src="https://dmci-agent-bakit.s3.ap-southeast-1.amazonaws.com/logo/dmci-logo-only.png"
          height="170"
          alt="DMCI Homes Logo"
          style={logo}
        /> */}
        <Heading style={h1}>ABIC Realty</Heading>
        <Text style={text}>
          Hello {first_name} {last_name},
        </Text>
        <Text style={text}>
          {body}
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          © 2025 ABIC. All rights reserved.
          <br />
          Philippines
        </Text>
      </Container>
    </Body>
  </Html>
);

export default Email;

const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '560px',
};

const logo = {
  margin: '0 auto',
  marginBottom: '24px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#0070f3',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 24px',
};

const hr = {
  borderColor: '#cccccc',
  margin: '20px 0',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
};
