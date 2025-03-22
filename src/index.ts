import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { PrismaClient } from "@prisma/client";
import { error } from "console";


const app = new Hono();
const prisma = new PrismaClient();


app.get("/", (c) => {
  return c.text(
    "WELL COME THIS IS THE PROJECT OF CUSTOMER ORDERING THE ITEMS IN ONLINE"
  );
});


// CUSTOMER REGISTRATION
app.post("/Customer/Register", async (c) => {
  try {
    const { name, email, phoneNumber, address } = await c.req.json();

    
    const existingCustomer = await prisma.customers.findUnique({
      where: { phoneNumber }
    });

    if (existingCustomer) {
      return c.json({ error: "Phone number already registered" }, 400);
    }
    const customer = await prisma.customers.create({
      data: { name, email, phoneNumber, address }
    });

    return c.json(customer, 201);
  } catch (error) {
    return c.json({ error: "Something went wrong", details: error.message }, 500);
  }
});


// JUST  RETRIVE  ALL  THE CUSTOMER
app.get("/Customer", async (C) => {
  const customers = await prisma.customers.findMany();
  return C.json(customers);
})

// RETRIVE  CUSTOMER BY ID
app.get("/Customer/:customerId", async (c) => {
  try{
  const customerId =  c.req.param("customerId");
  const customer = await prisma.customers.findMany({
    where:{
      id : customerId,
    },
});

 return c.json(customer,401);
}
catch(e){
  return c.json({message:"ERROR WHILE FETCHING THE DATA"},400)
}
})

//DISPLAY THE CUSTOMER ORDER THROUGH ID 
app.get('/Customer/:customerId/orders', async (c) => {
  const {customerId} = c.req.param();
  const orders = await prisma.orders.findMany({
    where: {
      customerId : customerId,
      },
    });

    return c.json(orders);
})

//Initailly we are going to register resturants
app.post("/Restaurant/Register", async (C) =>
{
  const  {name, location} = await C.req.json();
  const restaurant = await prisma.restaurants.create({
    data: {
      name,
      location,
    },
  });
 
  return C.json({restaurant},201);

});

// RETRIVE  ALL  THE MENU ITEMS THROUGH RESTAURANT ID
app.get("/Restaurant/:restaurantId/Menu", async (c) => {
  try{
  const {restaurantId} = c.req.param();

  const menu = await prisma.menu_Items.findMany({
    where: {
      restaurantId : restaurantId,
    },
  });

  return c.json({menu},201);
}
catch(e){
  return c.json({message:"ERROR FETCHING MENU "},400)
}
});

//ADDING THE LIST OF ITMES TO THE MENU
app.post("/Restaurant/:restaurantId/menu", async (c) =>{
  try{
  const {restaurantId} = c.req.param();

  const {name, price, isAvailable} = await c.req.json();

  const menu = await prisma.menu_Items.create({
    data: {
      name,
      price,
      isAvailable,
      restaurantId:restaurantId,
    },
  });

  return c.json({menu},201);
}
catch(e){
  return c.json({message:"ERROR CREATING THE MENU"},400)
}
});



//UPDATING THE MENU ITMES
app.patch("/menu/:menuId", async (c) => {
  try{
  const {menuId} = await c.req.param();

  const data = await c.req.json();

  const update = await prisma.menu_Items.update({
    where: {
      id :menuId,
    },
    data,
  });

  return c.json({update},201);
}
catch(e){
  return c.json({message:"ERROR"},400);
}
});

//ORDERING THE MENU ITEMS
app.post("/orders", async (c) => {
  try{
  const { customerId, restaurantId, items , totalPrice} = await c.req.json();
  const order = await prisma.orders.create({
    data: {
      customerId,
      restaurantId,
      totalPrice,
      order: {
        create : items.map(({menuItemId, quantity}: {menuItemId: Number , quantity : Number}) =>
        ({
          menuItemId,
          quantity,
        })),
      },
    },
    include: {order : true}
  });
  return c.json({order}, 201);
}
catch(error){
  return c.json({message : "ERROR CREATING ORDER"},500);
}
});

//RETRIVING THE ORDER BY ID
app.get("/Orders/:orderId", async (c) => {
  try{
  const {orderId} = await c.req.param();

  const order = await prisma.orders.findMany({
    where: {
      id : orderId,
    }
  });
  return c.json({order},201);
}
catch(error){
  return c.json({message : "Error fetching order"},500);
}
})

//UPDATING THE STATUS OF ORDER
app.patch("/Orders/:orderId/status", async (c) => {
  try{
  const {orderId} = await c.req.param();
  const {status} = await c.req.json();
  const order = await prisma.orders.update({
    where: {
      id: orderId,
      },
      data: {
        status,
        },
        });
        return c.json(order);
      }
      catch(error){
        return c.json({message : "Error updating order"},500);
        }
        });

//  RETRIVING THE REVENUE  GENERATED BY THE RESTAURANT BY ID
app.get("Restuarant/:restuarantId/revenue", async (c) => {
  try{
  const {restuarantId} = await c.req.param();
  const revenue = await prisma.orders.aggregate({
    where: {restaurantId:restuarantId , status :"Completed"},
    _sum :{ totalPrice : true},
  });
  return c.json({revenue: revenue._sum.totalPrice || 0});
}
catch(error){
  return c.json({message : "Error fetching revenue"},500);
}
})
//FETCHING THE MENU TOP ITEMS
app.get("/menu/top-items", async (c) =>{
  try{
    const restaurantId = await c.req.param();
    const topItems = await prisma.order_Items.groupBy({
      by: ['menuItemId'],
      _sum : {quantity : true},
      orderBy: { _sum: { quantity: "desc" } },
      take: 1,

      });
      return c.json({topItems},201);
    }
    catch(error){
      return c.json({message : "Error fetching top items"},500);
      }
});

//RETRIVING THE TOP CUSTOMER WHICH HAS ORDERED THE MOST
app.get("/Customers-top", async (c) => {
  try{
    const topCustomer = await prisma.orders.groupBy({
      by: ['customerId'],
      _sum : {totalPrice : true},
      orderBy: { _sum: { totalPrice: "desc" } },
      take: 5,
      });
      return c.json(topCustomer);
      }
      catch(error){
        return c.json({message : "Error fetching top customer"},500);

  }
});
serve(app);
console.log("Server is running on http://localhost:3000");
