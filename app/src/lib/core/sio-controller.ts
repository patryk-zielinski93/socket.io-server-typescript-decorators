export const sioEventProp = '__sioEvent';
export const sioNamespaceProp = '__sioNamespace';

export interface SioNamespaceOptions {
  name: string;
  middleware?: Array<(socket: SocketIO.Socket, next: () => void) => void>;
  onConnection?: Array<(socket: SocketIO.Socket) => void>;
}

export class SioController {
  private static instance: SioController = null;

  private io: SocketIO.Server;
  private isInitialized = false;
  private ioNamespaceClasses: any[] = [];
  private namespaces: Map<string, SocketIO.Namespace> = new Map();

  static getInstance() {
    return this.instance || (this.instance = new this());
  }

  private constructor() {
  }

  addIoNamespace(namespaceClass: any) {
    if (this.isInitialized) {
      throw new Error('SioNamespace can not be added after SioController initialization.');
    }

    this.ioNamespaceClasses.push(namespaceClass);
  }

  init(io: SocketIO.Server) {
    if (this.isInitialized) {
      throw new Error('SioController can be initialized only once.');
    }

    this.io = io;
    this.ioNamespaceClasses.forEach(nspClass => {
      this.prepareNamespace(nspClass);
    });
    this.isInitialized = true;
  }

  private prepareNamespace(ioNamespaceClass: any) {
    const nspObj = new ioNamespaceClass();
    const nspName = nspObj.constructor[sioNamespaceProp].name;
    let nsp = this.namespaces.get(nspName);

    if (!nsp) {
      nsp = this.io.of(nspObj.constructor[sioNamespaceProp].name);
    }

    if (nspObj.constructor[sioNamespaceProp].middleware) {
      nspObj.constructor[sioNamespaceProp].middleware.forEach(cb => {
        nsp.use(cb);
      });
    }

    nsp.on('connection', (socket: SocketIO.Socket) => {
      const onConnectionCbs = nspObj.constructor[sioNamespaceProp].onConnection;

      if (onConnectionCbs) {
        onConnectionCbs.forEach(cb => {
          cb(socket);
        });
      }

      if (nspObj.constructor[sioEventProp]) {
        nspObj.constructor[sioEventProp].forEach((event: string) => {
          socket.on(event, data => {
            nspObj[event](data, socket);
          });
        });
      }
    });

    this.namespaces.set(nspName, nsp);
  }
}
