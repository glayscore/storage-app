import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsProductIDCorrectConstraint
  implements ValidatorConstraintInterface
{
  validate(productId: string) {
    const regex = /^[LS](\d{5})\s[SM]$/;
    return typeof productId === 'string' && regex.test(productId);
  }

  defaultMessage() {
    return 'Product ID must follow the pattern Lxxxxx S, where xxxx is a numeric id and S is the size.';
  }
}

export function IsProductIDCorrect(validationOptions?: ValidationOptions) {
  return function (object: unknown, propertyName: string) {
    registerDecorator({
      name: 'IsProductIDCorrect',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsProductIDCorrectConstraint,
    });
  };
}
