import {Id} from "../../@shared/domain/value-object/id.value-object";
import {Product} from "../domain/product.entity";
import {ProductGateway} from "../gateway/product.gateway";
import {ProductModel} from "./product.model";

export class ProductRepository implements ProductGateway {
  async findAll(): Promise<Product[]> {
    const products = await ProductModel.findAll();

    return products.map(
      (product) =>
        new Product({
          id: new Id(product.productId),
          name: product.productName,
          description: product.productDescription,
          salesPrice: product.productSalesPrice,
        })
    );
  }
  async find(id: string): Promise<Product> {
    const product = await ProductModel.findOne({
      where: {
        id: id,
      },
    });

    return new Product({
      id: new Id(product.productId),
      name: product.productName,
      description: product.productDescription,
      salesPrice: product.productSalesPrice,
    });
  }
}