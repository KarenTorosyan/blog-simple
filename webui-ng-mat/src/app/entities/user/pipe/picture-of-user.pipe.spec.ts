import {PictureOfUserPipe} from './picture-of-user.pipe';

describe('PictureOfUserPipe', () => {

  const pipe = new PictureOfUserPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
