import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs/promises';
import * as typia from 'typia';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  ping(): 'pong' {
    return 'pong';
  }

  async getBackendSDKVersion(): Promise<string> {
    const packageJsonPath = path.join(
      process.env.PWD as string,
      `package.json`,
    );
    this.logger.debug(`[package.json path]: ${packageJsonPath}`);

    const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
    const version = typia.assert<string>(packageJson.version);
    this.logger.debug(`[package.json version]: ${version}`);

    return version;
  }
}
