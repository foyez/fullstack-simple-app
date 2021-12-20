import { Arg, Field, Mutation, ObjectType, Resolver } from "type-graphql";

import { User } from "../entities";
import { UserRegisterInput } from "./types/user-input";
import { hashPassword } from "../utils/libraries";
import { validateRegister } from "../utils/validations";

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => User, { nullable: true })
  user?: User;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@Resolver(User)
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg("credentials", () => UserRegisterInput) credentials: UserRegisterInput
  ): Promise<UserResponse> {
    const { username, email, password } = credentials;

    const errors = validateRegister(credentials);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await hashPassword(password);
    const user = User.create({ username, email, hashedPassword });

    try {
      await user.save();
    } catch (err) {}

    return { user };
  }
}
