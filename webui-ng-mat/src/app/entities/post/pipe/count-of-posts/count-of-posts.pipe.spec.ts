import {CountOfPostsPipe} from './count-of-posts.pipe';

describe('CountOfPostsPipe', () => {

  it('create an instance', () => {
    const pipe = new CountOfPostsPipe();
    expect(pipe).toBeTruthy();
  });
});
