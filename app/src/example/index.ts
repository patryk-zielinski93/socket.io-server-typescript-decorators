import * as http from 'http';
import * as socketIo from 'socket.io';
import { handler } from './handler';
import { SioEvent, SioController, SioNamespace } from '../lib/';

const app = http.createServer(handler);

const io = socketIo(app);
app.listen(8888);

@SioNamespace({
  name: '/',
  onConnection: [TestIo.onConnection]
})
class TestIo {
  private counter = 1;

  static onConnection(socket) {
    socket.emit('counter', {
      counter: 'Start counting!'
    });
  }

  @SioEvent()
  testMethod(data: any, socket: SocketIO.Socket) {
    console.log(data);
    setTimeout(() => {
      socket.emit('counter', {
        counter: this.counter
      });
      this.counter += 1;
    }, 1000);
  }
}

@SioNamespace({
  name: '/',
  onConnection: [TestIo2.onConnection]
})
class TestIo2 {
  private counter = 1;

  static onConnection(socket) {
    socket.emit('counter2', {
      counter: 'Start counting!'
    });
  }

  @SioEvent()
  testMethod2(data, socket: SocketIO.Socket) {
    console.log(data);
    setTimeout(() => {
      socket.emit('counter2', {
        counter: this.counter
      });
      this.counter += 1;
    }, 1000);
  }
}

const sioCtrl = SioController.getInstance();
sioCtrl.init(io);
