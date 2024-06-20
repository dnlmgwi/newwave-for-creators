class NFCService {
  private static instance: NFCService;
  // private nanoid: () => string;

  private constructor() {
    // this.nanoid = customAlphabet(
    //   "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
    //   21
    // );
  }

  public static getInstance(): NFCService {
    if (!NFCService.instance) {
      NFCService.instance = new NFCService();
    }
    return NFCService.instance;
  }

  public async writeNFCMessage(message: string) {
    try {
      if ("NDEFReader" in window) {
        const ndef = new NDEFReader();
        await ndef.write(message);
        // console.log("NFC message written successfully.");
      } else {
        // console.log("NFC not supported on this device.");
      }
    } catch (error) {
      // console.error("Error writing NFC message:", error);
    }
  }

  public async readNFCMessage() {
    try {
      if ("NDEFReader" in window) {
        const ndef = new NDEFReader();
        await ndef.scan();
        ndef.onreading = (event) => {
          const message = event.message.records[0];
          // console.log("NFC message read:", message);
        };
        // console.log("NFC reader started.");
      } else {
        // console.log("NFC not supported on this device.");
      }
    } catch (error) {
      // console.error("Error reading NFC message:", error);
    }
  }
}

export { NFCService };
