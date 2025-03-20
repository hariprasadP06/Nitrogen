import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";


const app = new Hono();
const prisma = new PrismaClient();


app.get("/", (c) => {
  return c.text(
    "WELL COME THIS IS THE PROJECT OF CUSTOMER ORDERING THE ITEMS IN THE RESTURANTS"
  );
});

app.post("/Customer/Register", async (c) => {
  const {name , email, phoneNumber, address} = await c.req.json();

  const customer = await prisma.customers.create({
    data: {
      name,
      email,
      phoneNumber,
      address,
    },
  });

  return c.json(customer);
});

app.get("/Customer", async (C) => {
  const customers = await prisma.customers.findMany();

  return C.json(customers);
})
app.get("/Customer/customerId", async (c) => {
  const customerId =  c.req.param("customerId");
  const customer = await prisma.customers.findMany({
    where:{
      id : customerId,
    },
});

 return c.json(customer,401);
})

serve(app);
console.log("Server is running on http://localhost:3000");
