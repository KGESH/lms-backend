import { SetMetadata } from '@nestjs/common';

export const SKIP_API_GUARD_KEY = 'skip-api-guard';

export const SkipApiGuard = () => SetMetadata(SKIP_API_GUARD_KEY, true);
