import EventDispatcher from "../../@shared/event/event-dispatcher";
import EventHandlerInterface from "../../@shared/event/event-handler.interface";
import Customer from "../entity/customer";
import Address from "../value-object/address";
import CustomerAddressChangedEvent from "./customer-address-changed.event";
import CustomerCreatedEvent from "./customer-created.event";
import EnviaConsoleLogHandler from "./handler/envia-console-log.handler";
import EnviaConsoleLog1Handler from "./handler/envia-console-log1.handler";
import EnviaConsoleLog2Handler from "./handler/envia-console-log2.handler";

describe("Customer Events", () => {
  describe("CustomerCreated", () => {
    it("should register two handlers", () => {
      const eventDispatcher = new EventDispatcher();

      const eventLog1 = new EnviaConsoleLog1Handler();
      const eventLog2 = new EnviaConsoleLog2Handler();

      eventDispatcher.register("CustomerCreatedEvent", eventLog1);
      eventDispatcher.register("CustomerCreatedEvent", eventLog2);

      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"],
      ).toBeDefined();
      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length,
      ).toBe(2);
    });

    it("should emit handler when customer is created", () => {
      const eventDispatcher = new EventDispatcher();

      const eventLog1Handle = new EnviaConsoleLog1Handler();
      const eventLog2Handle = new EnviaConsoleLog2Handler();

      const spyLog1 = jest.spyOn(eventLog1Handle, "handle");
      const spyLog2 = jest.spyOn(eventLog2Handle, "handle");

      eventDispatcher.register("CustomerCreatedEvent", eventLog1Handle);
      eventDispatcher.register("CustomerCreatedEvent", eventLog2Handle);

      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length,
      ).toBe(2);

      const customer = new Customer("123", "Teste");
      const event = new CustomerCreatedEvent(customer);

      eventDispatcher.notify(event);

      expect(spyLog1).toHaveBeenCalled();
      expect(spyLog2).toHaveBeenCalled();
    });
  });

  describe("AddressChanged", () => {
    it("should register event handler", () => {
      const eventDispatcher = new EventDispatcher();

      const handler = new EnviaConsoleLogHandler();

      eventDispatcher.register("CustomerAddressChangedEvent", handler);

      expect(eventDispatcher.getEventHandlers).toBeDefined();
      expect(
        eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length,
      ).toBe(1);
    });

    it("should emit handle when address is changed", () => {
      const eventDispatcher = new EventDispatcher();

      const handler = new EnviaConsoleLogHandler();
      const spy = jest.spyOn(handler, "handle");

      eventDispatcher.register("CustomerAddressChangedEvent", handler);

      expect(eventDispatcher.getEventHandlers).toBeDefined();
      expect(
        eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length,
      ).toBe(1);

      const customer = new Customer("123", "Teste");
      const address = new Address("Rua 1", 10, "123456", "Cidade 1");
      customer.changeAddress(address);

      const event = new CustomerAddressChangedEvent({
        id: customer.id,
        nome: customer.name,
        endereco: customer.Address,
      });

      eventDispatcher.notify(event);

      expect(spy).toHaveBeenCalled();
    });
  });

  describe("CustomerCreated + AddressChanged", () => {
    it("should emit all notifications", () => {
      const eventDispatcher = new EventDispatcher();
      const eventLog1Handle = new EnviaConsoleLog1Handler();
      const eventLog2Handle = new EnviaConsoleLog2Handler();
      const eventLogHandle = new EnviaConsoleLogHandler();

      const spyLog1 = jest.spyOn(eventLog1Handle, "handle");
      const spyLog2 = jest.spyOn(eventLog2Handle, "handle");
      const spyLog = jest.spyOn(eventLogHandle, "handle");

      eventDispatcher.register("CustomerCreatedEvent", eventLog1Handle);
      eventDispatcher.register("CustomerCreatedEvent", eventLog2Handle);
      eventDispatcher.register("CustomerAddressChangedEvent", eventLogHandle);

      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"],
      ).toBeDefined();
      expect(eventDispatcher.getEventHandlers).toBeDefined();
      expect(
        eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length,
      ).toBe(1);
      expect(
        eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length,
      ).toBe(2);

      const customer = new Customer("123", "Teste");

      const createCustomerEvent = new CustomerCreatedEvent(customer);
      eventDispatcher.notify(createCustomerEvent);

      const address = new Address("Rua 1", 10, "123456", "Cidade 1");
      customer.changeAddress(address);

      const changeAddressEvent = new CustomerAddressChangedEvent({
        id: customer.id,
        nome: customer.name,
        endereco: customer.Address,
      });
      eventDispatcher.notify(changeAddressEvent);

      expect(spyLog).toHaveBeenCalled();
      expect(spyLog1).toHaveBeenCalled();
      expect(spyLog2).toHaveBeenCalled();
    });
  });
});
