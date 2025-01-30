// app\(admin)\admin-login\page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  CardFooter,
  Input,
  Spacer,
} from "@heroui/react";
import { setCookie } from 'nookies';

export default function LoginPage() {
  const [email, setEmail] = useState('email@gmail.com');
  const [password, setPassword] = useState('12345678');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch(`https://abicmanpowerservicecorp.com/api/users/login`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { token, record } = await response.json();
        console.log('Login successful');
        sessionStorage.setItem('token', token);
        sessionStorage.setItem('id', record.id);
        sessionStorage.setItem('type', record.type);
        setCookie(null, 'abic-admin-login', 'true', { path: '/' });
        router.replace('/admin');
      } else {
        alert('Invalid email or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-white p-8 dark:bg-black">
      <Card className="w-full max-w-[600px] p-8">
        <CardHeader className="flex justify-start">
          <h1 className="text-2xl">Admin Login</h1>
        </CardHeader>
        <CardBody>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />
          <Spacer y={4} />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </CardBody>
        <CardFooter className="flex justify-end">
          <Button color="primary" onPress={handleLogin}>
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
