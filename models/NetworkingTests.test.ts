import { Tests } from "./NetworkingTests";
import net from "net";

describe("Networking", () => {
  describe("isTCPPortListening", () => {
    test("should resolve with true if the port is open", async () => {
      const port = 18080
      const server = net.createServer()
      server.listen(port,'127.0.0.1')
      const result = await Tests.Networking.isTCPPortListening(port);
      server.close()
      expect(result).toBe(true);
    })
    

    test("should return false if the port is not listening", async () => {
      const port = 18081;

      const result = await Tests.Networking.isTCPPortListening(port);

      expect(result).toBe(false);
    });
  });
});