import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { db } from "./client";

@Injectable()
export class DrizzleService implements OnModuleInit, OnModuleDestroy {
  onModuleInit() {
    console.log("✅ Drizzle DB connected");
  }

  onModuleDestroy() {
    console.log("❌ Drizzle DB disconnected");
  }

  get client() {
    return db;
  }
}
