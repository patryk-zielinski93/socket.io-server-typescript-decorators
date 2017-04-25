import { sioEventProp } from '../core/sio-controller';

export function SioEvent(): MethodDecorator {
  return function (target: (socket: SocketIO.Socket, data?: any) => {}, name) {
    if (!target.constructor[sioEventProp]) {
      target.constructor[sioEventProp] = [];
    }

    target.constructor[sioEventProp].push(name);
  };
}
