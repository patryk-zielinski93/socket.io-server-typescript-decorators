import { SioController, SioNamespaceOptions, sioNamespaceProp } from '../core/sio-controller';

export function SioNamespace(options: SioNamespaceOptions): ClassDecorator {
  const iom = SioController.getInstance();

  return function (target: any) {
    target[sioNamespaceProp] = options;
    iom.addIoNamespace(target);
  };
}
