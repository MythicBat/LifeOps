<div align="center">

# LifeOps

### Your autonomous personal-operations agent.

**Because apparently adulthood needed an API.**

LifeOps turns bills, subscriptions, warranties, renewals, appointments, reminders, and everyday documents into structured, actionable workflows — then safely helps take care of them.

<br />

![LifeOps Dashboard](docs/screenshots/dashboard.png)

<br />

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![AWS](https://img.shields.io/badge/AWS-Agentic_AI-FF9900?logo=amazonwebservices&logoColor=white)](https://aws.amazon.com/)
[![Amazon Bedrock](https://img.shields.io/badge/Amazon_Bedrock-Agent_Core-FF9900)](https://aws.amazon.com/bedrock/)
[![Vercel](https://img.shields.io/badge/Vercel-Production-black?logo=vercel)](https://vercel.com/)

<br />

**Observe → Understand → Plan → Guard → Act → Remember**

</div>

---

## The Story

Life admin is strangely difficult.

Your subscription invoice is in one place.

Your warranty is hiding in a PDF.

Your appointment confirmation is somewhere else.

A renewal date is approaching.

And your current personal operating system is basically:

> *"I feel like I was supposed to do something this week."*

Most AI assistants can help **after you remember to ask them**.

I wanted to explore something different:

> **What if AI could do more than answer questions about your life?**
>
> **What if it could safely help operate it?**

That question became **LifeOps**.

---

## Meet LifeOps

LifeOps is an autonomous personal-operations agent that transforms unstructured everyday information into a persistent operational model of your life.

Instead of stopping at:

> *"Here's what your document says."*

LifeOps can understand what happened, compare it with what it already knows, determine what should happen next, check whether it has permission to do it, and execute the appropriate action.

```text
Document arrives
      ↓
LifeOps understands it
      ↓
Something important changed
      ↓
LifeOps creates a plan
      ↓
Guardian checks permission
      ↓
Safe action executes
      ↓
LifeOps remembers what happened
```

The result isn't another chatbot.

**It's an AI system designed to turn information into action.**

---

## A Real Example

Imagine uploading a new subscription invoice.

A traditional document AI system might tell you:

```text
Vendor: Spotify
Amount: $15.99
Billing cycle: Monthly
```

Useful.

But LifeOps keeps going.

It can:

1. securely store the document
2. extract its contents
3. recognise the subscription
4. find previous records for the same service
5. detect that the price changed
6. calculate the monthly and annual impact
7. create an action plan
8. check the user's autonomy policy
9. record permitted changes automatically
10. surface anything requiring human approval

So the outcome becomes something closer to:

> **Spotify changed your subscription price.**
>
> I've updated the record and surfaced the change for your review.

That's the idea behind LifeOps:

### From document intelligence → operational intelligence.

---

# Product

## Command Center

The dashboard provides a single view of what currently matters across the user's operational life.

![LifeOps Dashboard](docs/screenshots/dashboard.png)

It brings together:

- decisions requiring attention
- upcoming obligations
- subscriptions
- warranties
- renewals
- appointments
- recent agent activity
- daily operational intelligence

---

## Life Vault

Documents shouldn't disappear into a folder five minutes after you download them.

The **Life Vault** turns uploaded documents into structured, useful information.

![Life Vault](docs/screenshots/vault.png)

LifeOps can identify and track information such as:

```text
Subscriptions
Warranties
Renewals
Appointments
Obligations
Receipts
```

The original document becomes part of a broader operational context rather than an isolated file.

---

## Autonomy Center

Autonomous agents become much more interesting when the user gets to decide **how autonomous they actually are**.

![Autonomy Center](docs/screenshots/autonomy.png)

LifeOps supports three operating modes:

| Mode | Behaviour |
|---|---|
| **Observe** | Understand and track information, but don't act |
| **Ask First** | Prepare the action and request approval |
| **Automatic** | Execute approved low-risk actions autonomously |

Autonomy can be configured independently across categories such as:

- documents
- everyday admin
- subscriptions
- warranties
- renewals
- appointments

Giving an AI agent unlimited permissions seemed like a slightly questionable product decision.

So I didn't.

---

## Timeline

LifeOps maintains a history of what happened — and what the agent did about it.

![LifeOps Timeline](docs/screenshots/timeline.png)

Instead of AI interactions disappearing into individual conversations, LifeOps creates a persistent operational timeline.

---

## Mobile

Life admin rarely waits until you're sitting at a laptop.

LifeOps is fully responsive across desktop and mobile.

<p align="center">
  <img src="docs/screenshots/mobile-dashboard.jpeg" width="280" alt="LifeOps mobile dashboard" />
  &nbsp;&nbsp;&nbsp;
</p>

The mobile interface supports:

- dashboard
- timeline
- Life Vault
- autonomy controls
- notifications
- settings
- account management
- secure sign-out

---

# How the Agent Thinks

The core LifeOps agent follows a deliberate execution loop:

<div align="center">

### Observe → Understand → Plan → Guard → Act → Remember

</div>

Rather than allowing one model call to decide everything, responsibilities are separated across the agent architecture.

---

## 1. Observer

The **Observer** transforms raw information into structured events.

For example:

```text
Document uploaded
      ↓
Subscription detected
      ↓
Vendor: Spotify
Amount: $15.99
```

Its job is to answer:

> **What happened?**

---

## 2. Planner

The **Planner** decides what LifeOps should do next.

Given the observed event and available context, it might produce a plan such as:

```text
Goal:
Handle newly detected subscription.

Actions:
→ Track subscription
→ Compare with previous amount
→ Record the Life Object
→ Surface meaningful changes
```

Its job is to answer:

> **What should happen?**

---

## 3. Guardian

Before execution, the **Guardian** evaluates the plan against the user's autonomy settings.

```text
                Proposed Action
                       │
                       ▼
                  ┌─────────┐
                  │ Guardian│
                  └────┬────┘
                       │
             ┌─────────┼─────────┐
             ▼         ▼         ▼
          Observe    Ask User   Execute
```

Its job is to answer:

> **Are we allowed to do this?**

This is especially important for higher-risk actions.

Examples include:

```text
Make a payment
Cancel a service
Submit a form
Sign an agreement
Share sensitive information
```

LifeOps treats these differently from low-risk operations such as creating reminders or recording a warranty.

**Autonomy without controls is just a bug with confidence.**

---

## 4. Executor

Once an action is permitted, the **Executor** invokes the appropriate LifeOps tool.

Available operations include:

```text
create_life_object()
create_obligation()
schedule_reminder()
track_subscription()
track_warranty()
track_renewal()
add_appointment()
create_decision()
```

Its job is simple:

> **Do the thing.**

But only after Guardian says it can.

---

## 5. Memory

Useful results become part of LifeOps' persistent operational context.

Over time, LifeOps builds an understanding of:

```text
What you own
What you pay for
What is expiring
What is upcoming
What changed
What needs attention
What the agent already handled
```

The goal is for every interaction to contribute to a more useful system rather than beginning from zero.

---

# Architecture

LifeOps combines a Next.js product interface with AWS document intelligence, agent infrastructure, persistent storage, and a Python service layer.

<p align="center">
  <img 
    src="docs/architecture/lifeops-architecture.png"
    alt="LifeOps system architecture"
    width="100%"
</p>

---

# Under the Hood

## AI & Agent Infrastructure

| Technology | Role |
|---|---|
| **Amazon Bedrock** | Foundation model inference |
| **Amazon Bedrock AgentCore Runtime** | Production agent execution |
| **Amazon Bedrock AgentCore Memory** | Persistent agent context |
| **Strands Agents SDK** | Agent reasoning and tool orchestration |
| **Amazon Textract** | Document extraction |

## AWS Infrastructure

| Technology | Role |
|---|---|
| **Amazon S3** | Secure document storage |
| **Amazon DynamoDB** | Persistent LifeOps state |
| **Amazon EventBridge Scheduler** | Scheduled reminders |
| **AWS Lambda** | Reminder execution |
| **Amazon Cognito** | Authentication |
| **Amazon CloudWatch** | Runtime observability |
| **AWS IAM** | Least-privilege access control |

## Application

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 16, React, TypeScript, Tailwind CSS |
| **Backend** | Python, FastAPI, Pydantic, boto3 |
| **Agent** | Strands Agents + Amazon Bedrock |
| **Frontend Hosting** | Vercel |
| **Backend Hosting** | Render |
| **Agent Runtime** | Amazon Bedrock AgentCore |

---

# Security by Design

LifeOps handles personal documents and autonomous actions, so security couldn't be an afterthought.

The production architecture includes:

### Authentication

Users authenticate through **Amazon Cognito**.

Protected requests use verified Cognito access tokens.

### User-isolated storage

Uploaded S3 objects are stored under authenticated user identities:

```text
users/
└── <cognito-user-sub>/
    └── intake/
        └── document.pdf
```

No shared:

```text
users/demo/
```

shortcuts survived production.

RIP, demo user. You served us well.

### AWS authentication

The Vercel application authenticates to AWS using **OIDC federation** rather than permanent AWS access keys.

```text
Vercel
   ↓
OIDC token
   ↓
AWS STS
   ↓
Temporary credentials
   ↓
AWS resources
```

### Least privilege

Different runtime components receive only the AWS permissions they require.

### Guardian-controlled actions

Even if an agent proposes an action, that does not automatically mean it can execute it.

The Guardian provides a separate permission boundary between:

```text
AI wants to do something
```

and:

```text
AI is allowed to do something
```

---

# Engineering Challenges

LifeOps started as an AI project.

It very quickly became a distributed-systems project wearing an AI hat.

Some of the most interesting engineering problems were:

### Designing safe autonomy

The hardest question wasn't:

> *Can the model perform this action?*

It was:

> *Should the model be allowed to perform this action?*

That led to the Guardian architecture and category-specific autonomy controls.

### Moving from stateless AI to persistent agents

LLM conversations are naturally temporary.

Life operations aren't.

Subscriptions, warranties, appointments, obligations, and decisions need persistent state across sessions.

That required combining model reasoning with DynamoDB and agent memory.

### Production AWS authentication

Development credentials are easy.

Securely allowing a production Vercel deployment to access AWS without storing permanent credentials required OIDC federation, IAM roles, trust policies, and scoped permissions.

### Deploying the agent

LifeOps' autonomous workflow was packaged separately and deployed to **Amazon Bedrock AgentCore Runtime**, allowing the application to invoke the production agent independently from the web backend.

### Making the entire thing work on a phone

Because apparently distributed agent architecture wasn't enough.

---

# What I Learned

Building LifeOps changed how I think about AI applications.

At first, the obvious questions were:

```text
How do I call the model?
How do I write the prompt?
How do I extract the document?
```

Those quickly became:

```text
How should an agent reason?

When should it act?

When should it ask?

How do you persist its understanding?

How do you prevent duplicate actions?

How should services authenticate with each other?

What permissions should each component receive?

What happens when the model proposes something unsafe?

How do you turn an agent demo into a production system?
```

LifeOps ended up teaching me as much about **software architecture, cloud infrastructure, security, API design, state management, deployment, and product thinking** as it did about generative AI.

And that became one of my favourite parts of building it.

---

# Design Philosophy

LifeOps follows three principles.

### 1. AI should reduce operational work

The goal isn't to create another place where users need to type prompts.

The best outcome is often:

> LifeOps noticed it and handled it.

### 2. Autonomy should be earned

Different actions deserve different levels of trust.

Creating a reminder and making a payment should not have the same permission model.

### 3. Memory should create compounding value

Every useful interaction should make the system more useful next time.

The long-term goal is not simply an assistant that knows things.

It's a system that understands the operational state of your life.

---

# Built By

<div align="center">

### Alin Merchant

**Computer Science @ Monash University**

AI • Machine Learning • Agentic Systems • Full-Stack Engineering

### The short version

**LifeOps is what happens when you give a TODO list an AI agent, cloud infrastructure, persistent memory, and permission boundaries.**

*And somehow it becomes more organised than you are.*

</div>
