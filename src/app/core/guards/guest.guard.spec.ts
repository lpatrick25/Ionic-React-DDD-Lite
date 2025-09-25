import { GuestGuard } from "./guest.guard";

describe('Guest', () => {
  it('should create an instance', () => {
    expect(new GuestGuard()).toBeTruthy();
  });
});
