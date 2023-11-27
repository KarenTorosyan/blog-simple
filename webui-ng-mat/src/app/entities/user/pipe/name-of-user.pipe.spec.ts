import {NameOfUserPipe} from './name-of-user.pipe';

describe('NameOfUserPipe', () => {

  const pipe = new NameOfUserPipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
});
