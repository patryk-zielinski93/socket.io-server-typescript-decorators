# Socket.io server typescript decorators
Sio-tsc is simple typescript library to help you build applications based on socket.io.

## How it works
Decorator registers class and it's methods to global singleton container.  
After calling init on SioController, it will instantiate all registered classes and pass decorated methods to `socket.on()` callback on socket connection.  

## Usage
You can create multiple classes for single namespace, but keep in mind that method name is used as event name passed to `socket.on`.  
```typescript
@SioNamespace({
  name: '/', // '/' is global namespace
  middleware: [], // optional
  onConnection: [EventFetch.onConnection] // optional
})
export class TestNamespaceClass {
  static onConnection(socket) {
    socket.emit('test', {data:'test'});
  }
  
  @SioEvent()
  testEvent(data: any, socket: SocketIO.Socket) {
    setTimeout(() => {
      socket.emit('testEventResponse', data);
    }, 500);
  }
}

const sioCtrl = SioController.getInstance();
sioCtrl.init(io);
```
That's all, after calling init, it should work. Remember to import your files to main file or create some loader.  

## Installation
From npm:  
`npm i sio-tsc --save`

## Development
1. Copy `.env-sample` to `./.env`.  
2. If you are using linux, change $UID in `.env` file.  
3. Run `docker-compose up`.  
