import { UseInterceptors } from "@nestjs/common";
import { ClassConstructor } from "class-transformer";
import { SerializeInterceptor } from "../inteceptors";

export function Serialize(dto: ClassConstructor<any>): MethodDecorator & ClassDecorator {
  return UseInterceptors(new SerializeInterceptor(dto));
}