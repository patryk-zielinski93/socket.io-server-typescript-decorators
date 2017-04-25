import { SioController } from './sio-controller';
import { expect, should } from 'chai';
should();

describe('SioController', () => {
  let subject: SioController;

  before(() => {
    subject = SioController.getInstance();
  });

  describe('static#getInstance', () => {
    it('Should return the same instance of SioController', () => {
      expect(SioController.getInstance()).to.be.equal(SioController.getInstance());
    });
  });
});
