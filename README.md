# DDD: Implementação de Repository e Testes

## Objetivo

Aplicar o conceito de Domain Events na prática. Você deve implementar a publicação e a assinatura de eventos de domínio na criação e atualização de um cliente (Customer), garantindo que o sistema reaja a essas mudanças de estado conforme os requisitos de log abaixo.

## Tecnologias e Ferramentas

Linguagem: TypeScript

Metodologia: DDD e Testes Automatizados

## Estrutura Base (Obrigatória) 

Para realizar este desafio, é obrigatório utilizar o código base disponibilizado pelo curso.

https://github.com/devfullcycle/fc-ddd-patterns.git

## Requisitos Técnicos

Você deve criar dois eventos de domínio distintos para o agregado Customer:

### 1. Evento: CustomerCreated

**Gatilho**: Deve ser disparado sempre que um novo Customer é criado.

**Comportamento**: Ao ser disparado, esse evento deve executar dois Handlers independentes:

**Handler 1 (EnviaConsoleLog1Handler)**: Deve imprimir no console: "Esse é o primeiro console.log do evento: CustomerCreated"

**Handler 2 (EnviaConsoleLog2Handler)**: Deve imprimir no console: "Esse é o segundo console.log do evento: CustomerCreated"

### 2. Evento: CustomerAddressChanged

**Gatilho**: Deve ser disparado quando o endereço do Customer é trocado.

**Dados**: O evento deve transportar o id, o nome e o novo endereço do cliente.

**Comportamento**: Deve executar um Handler (EnviaConsoleLogHandler) que imprime no console: "Endereço do cliente: {id}, {nome} alterado para: {endereco}"

## Validação

Toda a implementação deve ser coberta por testes unitários que assegurem que os eventos estão sendo disparados e os handlers executados corretamente.

## Instalação e testes

**Para instalar os pacotes e executar o projeto é necessário ter o Node.js instalado na sua máquina.**

1. Faça o clone do repositório: 

```bash 
git clone https://github.com/AnteroJunior/fc-ddd-patterns.git
```

2. Mude para a branch `domain-events`:
```bash
git switch domain-events
```

3. Instale os pacotes, rode o comando:
```bash 
npm i
```

4. Execute os testes existentes no projeto:
```bash 
npm test
```