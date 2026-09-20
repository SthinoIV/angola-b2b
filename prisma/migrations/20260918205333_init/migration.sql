-- CreateEnum
CREATE TYPE "Categoria" AS ENUM ('CONSTRUCAO', 'TECNOLOGIA', 'MARKETING_DESIGN', 'LOGISTICA', 'CONSULTORIA', 'COMERCIO', 'INDUSTRIA', 'SERVICOS_PROFISSIONAIS', 'HOTELARIA', 'AGRICULTURA', 'OUTRA');

-- CreateEnum
CREATE TYPE "EstadoPedido" AS ENUM ('NOVO', 'CONTACTADO', 'EM_NEGOCIACAO', 'GANHO', 'PERDIDO');

-- CreateTable
CREATE TABLE "Company" (
    "id" TEXT NOT NULL,
    "authUserId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoria" "Categoria" NOT NULL,
    "localizacao" TEXT NOT NULL,
    "descricao" TEXT,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT,
    "website" TEXT,
    "logoUrl" TEXT,
    "verificada" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "categoria" "Categoria" NOT NULL,
    "localizacao" TEXT NOT NULL,
    "prazo" TEXT,
    "nome" TEXT NOT NULL,
    "contacto" TEXT NOT NULL,
    "estado" "EstadoPedido" NOT NULL DEFAULT 'NOVO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Company_authUserId_key" ON "Company"("authUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Company_slug_key" ON "Company"("slug");
