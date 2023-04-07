import React, { useState as state } from 'react'
import Head from "next/head";
import { Container, Heading, Input, Stack } from '@chakra-ui/react';

const index = () => {
  const [ansInput, setAnsInput] = state("");
  const [result, setResult] = state();
  const [test, setTest] = state("")

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ask: ansInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setResult(data.result);
      console.log(data.result)
      setAnsInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <Container>
      <Head>
        <title>IA Ice Cream</title>
        <link rel='icon' href='/648872.png' />
      </Head>
      <Heading textAlign={"center"} mt={"10"} mb={"100"}>Vendedor de Helados</Heading>
      <div>
        <div>{result}</div>
        <Stack>
          <form onSubmit={onSubmit}>
            <Input
              type='text'
              name='answer'
              placeholder='Puedes hablar'
              value={ansInput}
              onChange={(e) => setAnsInput(e.target.value)}
            />
            <Input paddingInline={"30%"} type="submit" value="Enviar respuesta" />
          </form>
        </Stack>
      </div>
    </Container>
  );
}

export default index