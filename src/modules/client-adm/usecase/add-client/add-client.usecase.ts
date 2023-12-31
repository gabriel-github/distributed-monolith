import { Id } from "../../../@shared/domain/value-object/id.value-object";
import { UseCaseInterface } from "../../../@shared/usecase/use-case.interface";
import { Client } from "../../domain/client.entity";
import { ClientGateway } from "../../gateway/client.gateway";
import { AddClientInputDto, AddClientOutputDto } from "./add-client.usecase.dto";



export class AddClientUseCase implements UseCaseInterface {
  constructor(private clientRepository: ClientGateway) {}

  async execute(input: AddClientInputDto): Promise<AddClientOutputDto> {
    const client = new Client({
      id: new Id(input.id) || new Id(),
      name: input.name,
      email: input.email,
      address: input.address
    })

    await this.clientRepository.add(client);

    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      address: client.address,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  }
}