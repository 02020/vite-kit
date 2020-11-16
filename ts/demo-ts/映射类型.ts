

type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>;  // Type of 'this' in methods is D & M
}
 


function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {};
  let methods: object = desc.methods || {};
  return { ...data, ...methods } as D & M;
}

let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx;  // Strongly typed this
      this.y += dy;  // Strongly typed this
    }
  }
}); 


obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
 


type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends Function ? K : never }[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

interface Part {
  id: number;
  name: string;
  subparts: Part[];
  updatePart(newName: string): void;
}

type T40 = FunctionPropertyNames<Part>;  // "updatePart"
type T42 = FunctionProperties<Part>;     // { updatePart(newName: string): void }
 


function methodDecorator (): MethodDecorator {
  return (target, key, descriptor) => {
    
  };
}


type Options<T> = {
  [P in keyof T]: T[P];
}

declare function test<T>(o: Options<T>): T;

test({ name: 'Hello' }).name     // string




class Man {
  handsome = 'handsome';
}
class Woman {
  beautiful = 'beautiful';
}

function Human(arg: Man | Woman) {
  if (arg instanceof Man) {
      console.log(arg.handsome);

  } else {
      // 这一块中一定是 Woman
      console.log(arg.beautiful);
  }
}
 

interface B {
  b: string;
}
interface A {
  a: string;
}
function foo(x: A | B) {
  if ('a' in x) {
      return x.a;
  }
  return x.b;
} 


// 双重断言.
function handler(event: Event) {
  const element = (event as any) as HTMLElement; // 正常
}

 


function query2(...args:[string | number, number, boolean]){
  const d : string | number = args[0];
  const n: number = args[1];
  const b: boolean = args[2];
} 