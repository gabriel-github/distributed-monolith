import { Id } from '../../../@shared/domain/value-object/id.value-object';
import { UseCaseInterface } from '../../../@shared/usecase/use-case.interface';
import { Invoice } from '../../domain/invoice.entity';
import { Product } from '../../domain/product.entity';
import { Address } from '../../domain/value-object/address';
import { InvoiceGateway } from '../../gateway/invoice.gateway';
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from './generate-invoice.dto';

interface ItemOutput {
  id: string;
  name: string;
  price: number;
}

export class GenerateInvoiceUseCase implements UseCaseInterface {
  constructor(private invoiceRepository: InvoiceGateway) { }

  async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {

    const items = this.mapGenerateItems(input.items);
    const address = new Address({
      city: input.city,
      state: input.state,
      street: input.street,
      zipCode: input.zipCode,
      complement: input.complement,
      number: input.number
    });

    const invoice = new Invoice({
      name: input.name,
      document: input.document,
      address,
      items
    })

    this.invoiceRepository.generate(invoice)

    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      street: invoice.address.street,
      number: invoice.address.number,
      complement: invoice.address.complement,
      city: invoice.address.city,
      state: invoice.address.state,
      zipCode: invoice.address.zipCode,
      items: this.mapConvertItems(invoice.items),
      total: invoice.total,
    }
  }

  mapGenerateItems(items: ItemOutput[]) {
    return items.map(item => {
      return new Product({
        id: new Id(item.id),
        name: item.name,
        price: item.price
      })
    })
  }

  mapConvertItems(items: Product[]) {
    return items.map(item => ({
      id: item.id.id,
      name: item.name,
      price: item.price
    }))
  }
}