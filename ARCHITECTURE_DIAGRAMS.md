# Diagramas de Arquitectura de Microservicios

Este documento contiene los diagramas Mermaid de cada microservicio y el diagrama general del sistema. Son simples, minimalistas y listos para presentación.

## Auth Service

```mermaid
flowchart TB
  subgraph Auth_Service["Auth Service"]
    A[Cliente] --> B[Controller]
    B --> C[Service]
    C --> D[Repository]
    D --> E[(Base de Datos)]
    C --> F[JWT Service]
  end
```

## User Service

```mermaid
flowchart TB
  subgraph User_Service["User Service"]
    A[Cliente] --> B[Controller]
    B --> C[Service]
    C --> D[Repository]
    D --> E[(Base de Datos)]
  end
```

## Book Service

```mermaid
flowchart TB
  subgraph Book_Service["Book Service"]
    A[Cliente] --> B[Controller]
    B --> C[Service]
    C --> D[Repository]
    D --> E[(Base de Datos)]
  end
```

## Loan Service

```mermaid
flowchart TB
  subgraph Loan_Service["Loan Service"]
    A[Cliente] --> B[Controller]
    B --> C[Service]
    C --> D[Repository]
    D --> E[(Base de Datos)]
    C --> F[User Service]
    C --> G[Book Service]
  end
```

## API Gateway

```mermaid
flowchart TB
  subgraph API_Gateway["API Gateway"]
    A[Cliente] --> B[API Gateway]
    B --> C[Auth Service]
    B --> D[User Service]
    B --> E[Book Service]
    B --> F[Loan Service]
  end
```

## Eureka Server

```mermaid
flowchart TB
  subgraph Eureka_Server["Eureka Server"]
    A[Auth Service]
    B[User Service]
    C[Book Service]
    D[Loan Service]
  end
  A --> Eureka_Server
  B --> Eureka_Server
  C --> Eureka_Server
  D --> Eureka_Server
```

## Diagrama general del sistema

```mermaid
flowchart LR
  Cliente[Cliente] --> API[API Gateway]
  API --> Auth[Auth Service]
  API --> User[User Service]
  API --> Book[Book Service]
  API --> Loan[Loan Service]

  Auth --> AuthDB[(Auth DB)]
  User --> UserDB[(User DB)]
  Book --> BookDB[(Book DB)]
  Loan --> LoanDB[(Loan DB)]

  Loan --> User
  Loan --> Book

  subgraph Eureka["Eureka Server"]
    EAuth[Auth Service]
    EUser[User Service]
    EBook[Book Service]
    ELoan[Loan Service]
  end

  EAuth --> Eureka
  EUser --> Eureka
  EBook --> Eureka
  ELoan --> Eureka

  Auth -. Registro .-> Eureka
  User -. Registro .-> Eureka
  Book -. Registro .-> Eureka
  Loan -. Registro .-> Eureka
```
