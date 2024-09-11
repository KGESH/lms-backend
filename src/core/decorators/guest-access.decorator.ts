import { SetMetadata } from '@nestjs/common';

export const GUEST_ACCESS_KEY = 'guest-access';

export const GuestAccess = () => SetMetadata(GUEST_ACCESS_KEY, true);
