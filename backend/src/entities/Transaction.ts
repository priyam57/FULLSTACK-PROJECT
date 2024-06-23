import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { ITransaction } from "../interfaces/ITransaction";

@Entity()
export default class Transaction extends BaseEntity implements ITransaction {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar", { name: "title" })
  title!: string;

  @Column("varchar", { name: "description" })
  description!: string;

  @Column("decimal", { name: "price" })
  price!: number;

  @Column("varchar", { name: "date_of_sale" })
  dateOfSale!: string;

  @Column("varchar", { name: "category" })
  category!: string;

  @Column("varchar", { name: "image" })
  image!: string;

  @Column("boolean", { name: "sold" })
  sold!: boolean;
}
