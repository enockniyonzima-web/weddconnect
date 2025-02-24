-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientSubscription" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiryAt" TIMESTAMP(3) NOT NULL,
    "clientId" INTEGER NOT NULL,
    "subscriptionId" INTEGER NOT NULL,

    CONSTRAINT "ClientSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "clientSubscriptionId" INTEGER NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_name_key" ON "Subscription"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ClientSubscription_clientId_key" ON "ClientSubscription"("clientId");

-- AddForeignKey
ALTER TABLE "ClientSubscription" ADD CONSTRAINT "ClientSubscription_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientSubscription" ADD CONSTRAINT "ClientSubscription_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_clientSubscriptionId_fkey" FOREIGN KEY ("clientSubscriptionId") REFERENCES "ClientSubscription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
