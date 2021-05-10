import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { inject } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: {
        name: string;
        email: string;
    };
    token: string;
}

class AuthenticateUserUseCase {
    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository
    ) {}

    async execute({ email, password }: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new Error("Email or password incorrect!");
        }

        const passwordMatch = await compare(password, user.password);

        if (!passwordMatch) {
            throw new Error("Email or password incorrect!");
        }

        const token = sign({}, "801d5d8bd9b25f3af06717b3e59a965f", {
            subject: user.id,
            expiresIn: "1d",
        });

        return {
            user: {
                name: user.name,
                email: user.email,
            },
            token,
        };
    }
}

export { AuthenticateUserUseCase };
