# DDD: Implementação de Repository e Testes

## Objetivo

Neste desafio, você deve aplicar conceitos de Domain Driven Design e TDD (Test Driven Development). Sua missão é completar a implementação da camada de infraestrutura de uma aplicação de vendas, garantindo que o repositório de pedidos (OrderRepository) funcione exatamente como definido em sua interface.

## Tecnologias e Ferramentas

Linguagem: TypeScript

Metodologia: DDD e Testes Automatizados

## Estrutura Base (Obrigatória) 

Para realizar este desafio, é obrigatório utilizar o código base disponibilizado pelo curso.

https://github.com/devfullcycle/fc-ddd-patterns.git

## Requisitos Técnicos

**Implementação da Classe:** Você deve completar a classe OrderRepository.

**Cumprimento de Contrato:** A classe deve implementar totalmente os métodos definidos na interface OrderRepositoryInterface.

Verifique métodos como create, update, find, findAll, etc., conforme definidos no código base.

**Testes Automatizados:** Toda a implementação deve ser validada por testes.
Os testes devem garantir que os dados estão sendo manipulados corretamente (criação, recuperação e atualização de Orders).

**Critério de Aceite:** Ao rodar o comando de testes (ex: npm test), todos os testes devem passar (ficar verdes).

## Instalação e testes

**Para instalar os pacotes e executar o projeto é necessário ter o Node.js instalado na sua máquina.**

1. Faça o clone do repositório: 

```bash 
git clone https://github.com/AnteroJunior/fc-ddd-patterns.git
```

2. Instale os pacotes, rode o comando:
```bash 
npm i
```

3. Execute os testes existentes no projeto:
```bash 
npm test
```