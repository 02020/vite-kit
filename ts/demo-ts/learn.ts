

type Size = 'small' | 'default' | 'big';

type SizeMap = Record<Size, number>;


type AnimalType = 'cat' | 'dog' | 'frog';
interface AnimalDescription { name: string, title: string }

const AnimalMap: Record<AnimalType, AnimalDescription> = {
    cat: { name: '猫', title: 'cat' },
    dog: { name: '狗', title: 'dog' },
    frog: { name: '蛙', title: 'wa' },
};

type Car = 'Audi' | 'BMW' | 'MercedesBenz'
type CarList = Record<Car, {age: number}>

const cars: CarList = {
    Audi: { age: 119 },
    BMW: { age: 113 },
    MercedesBenz: { age: 133 },
}
 





// 保留 => { default: number, big: number }
type BiggerSizeMap = Pick<SizeMap, 'default' | 'big'>;

// 删除 => { default: number }
type DefaultSizeMap = Omit<BiggerSizeMap, 'big'>;




type Result = 1 | 2 | 3 | 'error' | 'success';

// 保留 =>   'error' | 'success
type StringResult = Extract<Result, string>;   

// 排除 =>   1 | 2 | 3
type NumericResult = Exclude<Result, string>;  



const config = { width: 2, height: 2 };
function getLength(str: string) { return str.length; }

type TConfig = typeof config;    // { width: number, height: number }
type TGetLength = typeof getLength;    // (str: string) => number
 



interface SomeProps {
  a: string
  b: number
  c: (e: MouseEvent) => void
  d: (e: TouchEvent) => void
}

type GetKeyByValueType<T, Condition> = {
  [K in keyof T]: T[K] extends Condition ? K : never
} [keyof T];

type FunctionPropNames =  GetKeyByValueType<SomeProps, Function>;    // 'c' | 'd'



type Constructor = new (...args: any[]) => any;


// // 获取参数类型
// type ConstructorParameters<T extends new (...args: any[]) => any> = T extends new (...args: infer P) => any ? P : never;

// // 获取实例类型
// type InstanceType<T extends new (...args: any[]) => any> = T extends new (...args: any[]) => infer R ? R : any;
 


class TestClass {

  constructor(
    public name: string,
    public string: number
  ) {}
}

type Params = ConstructorParameters<typeof TestClass>;  // [string, numbder]

type Instance = InstanceType<typeof TestClass>;         // TestClass
 

// type ElementOf<T> = T extends Array<infer E> ? E : never

// type TTuple = [string, number];

// type ToUnion = ElementOf<TTuple>; // string | number
 

type TTuple = [string, number];
type Res = TTuple[number];  // string | number


