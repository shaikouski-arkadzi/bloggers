import { injectable } from "inversify";
import { db } from "../../db";

@injectable()
export class TestingCommandRepository {
  constructor() {}

  async clearDB(): Promise<void> {
    const collections = db.getCollections();

    await collections.blogsCollection.deleteMany({});
    await collections.postsCollection.deleteMany({});
    await collections.usersCollection.deleteMany({});
    await collections.commentsCollection.deleteMany({});
    await collections.sessionsCollection.deleteMany({});
  }
}
