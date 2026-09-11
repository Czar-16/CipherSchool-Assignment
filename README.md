# DesignArena

A Low-Level Design (LLD) practice platform built with Next.js, TypeScript, PostgreSQL, and Prisma 7.

## Learner Journey
1. Choose LLD problem
2. Think / design structure
3. Submit structured LLD answer (5 core sections)
4. Get rubric-based feedback & evaluation
5. Review evaluation breakdown & scores
6. Try again to refine design skills

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Environment Setup
Set up your `.env` file with `DATABASE_URL`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/lld_practice?schema=public"
```

### Installation
```bash
npm install
```

### Database Migration & Seed
```bash
npx prisma db push
npx prisma db seed
```

### Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to access the application.

## Running Tests
```bash
npm run test
```

## Documentation Skeletons
- `DESIGN.md` - System architecture, submission pipeline, and evaluator strategy pattern.
- `RESEARCH.md` - Research and evaluation criteria.
- `AI_USAGE.md` - Log of AI assistance and prompt interactions.
