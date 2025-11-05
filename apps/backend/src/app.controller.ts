import { Controller, Get } from "@nestjs/common";
import { DrizzleService } from "./db/drizzle.service";
import { users } from "./db/schema";

@Controller()
export class AppController {
  constructor(private readonly drizzle: DrizzleService) {}

  @Get("users")
  async getUsers() {
    const result = await this.drizzle.client.select().from(users);
    return result;
  }

  @Get()
  getRoot() {
    return { message: "API running!" };
  }
}
