import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text
} from '@react-email/components'



export function EmailTemplate() {
  return (
    <Html lang="pt-br">
      <Head />
      <Body>
        <Container>
          <Heading>Olá, neeeeeeee</Heading>
          <Text>Recuperação de senha</Text>
        </Container>
      </Body>
    </Html>
  )
}

