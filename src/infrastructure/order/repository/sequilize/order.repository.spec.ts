import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  const createCustomer = async (id = "123") => {
    await CustomerModel.create({
      id,
      name: "Customer 1",
      street: "Street 1",
      number: 1,
      zipcode: "Zipcode 1",
      city: "City 1",
      active: true,
      rewardPoints: 0,
    });
  };

  const createProduct = async (id = "123", name = "Product 1", price = 10) => {
    await ProductModel.create({ id, name, price });
  };

  it("should create a new order", async () => {
    createCustomer();
    createProduct();

    const orderItem = new OrderItem("1", "Product 1", 10, "123", 2);

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

  it("should find an existing order", async () => {
    createCustomer();
    createProduct();

    const orderItem = new OrderItem("1", "Product 1", 10, "123", 2);

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);
    const foundOrder = await orderRepository.find("123");

    expect(foundOrder).toStrictEqual(order);
  });

  it("should throw error for an non-existent order", async () => {
    const orderRepository = new OrderRepository();
    expect(async () => {
      await orderRepository.find("123");
    }).rejects.toThrow("Order not found");
  });

  it("should return existing orders", async () => {
    createCustomer();
    createProduct();

    const orderRepository = new OrderRepository();

    const orderItem = new OrderItem("1", "Product 1", 10, "123", 2);
    const order = new Order("123", "123", [orderItem]);
    await orderRepository.create(order);

    const foundOrders = await orderRepository.findAll();

    expect(foundOrders.length).toBe(1);
  });

  it("should return multiple orders", async () => {
    createCustomer();
    createProduct();
    createProduct("1234", "Product 2", 20);

    const orderRepository = new OrderRepository();

    const orderItem = new OrderItem("1", "Product 1", 10, "123", 2);
    const order = new Order("123", "123", [orderItem]);
    await orderRepository.create(order);

    const orderItem2 = new OrderItem("2", "Product 2", 20, "1234", 2);
    const order2 = new Order("1234", "123", [orderItem2]);
    await orderRepository.create(order2);

    const foundOrders = await orderRepository.findAll();

    expect(foundOrders.length).toBe(2);
  });

  it("should return empty array when there is no orders", async () => {
    const orderRepository = new OrderRepository();
    const orders = await orderRepository.findAll();
    expect(orders.length).toBe(0);
    expect(orders).toStrictEqual([]);
  });

  it("should update when adding item", async () => {
    createCustomer();
    createProduct();
    createProduct("1234", "Product 2", 10);

    const orderRepository = new OrderRepository();

    const orderItem = new OrderItem("1", "Product 1", 10, "123", 2);
    const order = new Order("123", "123", [orderItem]);
    await orderRepository.create(order);

    const orderItem2 = new OrderItem("2", "Product 2", 10, "1234", 2);
    const updatedOrder = new Order("123", "123", [orderItem, orderItem2]);

    await orderRepository.update(updatedOrder);

    const orderModel = await orderRepository.find("123");

    expect(orderModel).toEqual(updatedOrder);
  });

  it("should update when removing item", async () => {
    createCustomer();
    createProduct();
    createProduct("1234", "Product 2", 10);

    const orderRepository = new OrderRepository();
    const orderItem = new OrderItem("1", "Product 1", 10, "123", 2);
    const orderItem2 = new OrderItem("2", "Product 2", 10, "1234", 2);
    const order = new Order("123", "123", [orderItem, orderItem2]);
    await orderRepository.create(order);

    const updatedOrder = new Order("123", "123", [orderItem]);
    await orderRepository.update(updatedOrder);

    const orderModel = await orderRepository.find("123");

    expect(orderModel).toEqual(updatedOrder);
  });

  it("should update customer_id", async () => {
    createCustomer();
    createCustomer("1234");
    createProduct();

    const orderRepository = new OrderRepository();
    const orderItem = new OrderItem("1", "Product 1", 10, "123", 2);
    const order = new Order("123", "123", [orderItem]);
    await orderRepository.create(order);

    const updatedOrder = new Order("123", "1234", [orderItem]);
    await orderRepository.update(updatedOrder);

    const orderModel = await orderRepository.find("123");

    expect(orderModel).toEqual(updatedOrder);
    expect(orderModel.customerId).toBe("1234");
  });
});
